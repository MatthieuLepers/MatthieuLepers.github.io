import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { AnalyticsEvent } from '@/core/analytics/types';

interface EventRecord {
  id?: number;
  payload: AnalyticsEvent;
  createdAt: number;
  retryCount: number;
}

interface EventDB extends DBSchema {
  events: {
    key: number;
    value: EventRecord;
    indexes: {
      'by-createdAt': number,
    };
  };
}

export class EventQueue {
  private dbPromise: Promise<IDBPDatabase<EventDB>>;

  private isFlushing = false;

  private maxRetries: number;

  private maxBatchSize: number;

  private baseDelay: number;

  private channel: BroadcastChannel;

  constructor(options?: {
    dbName?: string;
    maxRetries?: number;
    maxBatchSize?: number;
    baseDelayMs?: number;
  }) {
    const dbName = options?.dbName ?? 'event-buffer-db';

    this.maxRetries = options?.maxRetries ?? 5;
    this.maxBatchSize = options?.maxBatchSize ?? 50;
    this.baseDelay = options?.baseDelayMs ?? 1000;

    this.dbPromise = openDB<EventDB>(dbName, 1, {
      upgrade(db) {
        const store = db.createObjectStore('events', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-createdAt', 'createdAt');
      },
    });

    this.channel = new BroadcastChannel('event-queue-lock');

    window.addEventListener('online', () => this.scheduleFlush());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.scheduleFlush();
      }
    });
  }

  async enqueue(payload: AnalyticsEvent) {
    const db = await this.dbPromise;

    await db.add('events', {
      payload,
      createdAt: Date.now(),
      retryCount: 0,
    });

    this.scheduleFlush();
  }

  private computeBackoff(retryCount: number) {
    return this.baseDelay * 2 ** retryCount;
  }

  private scheduleFlush(delay = 0) {
    setTimeout(() => this.flush(), delay);
  }

  async flush(sendFn?: (payloads: Array<AnalyticsEvent>) => Promise<void>) {
    if (this.isFlushing || !sendFn) return;

    this.isFlushing = true;
    this.channel.postMessage('lock');

    try {
      const db = await this.dbPromise;

      const readTx = db.transaction('events', 'readonly');
      const allEvents = await readTx
        .objectStore('events')
        .index('by-createdAt')
        .getAll()
      ;

      await readTx.done;

      if (!allEvents.length) return;

      const batch = allEvents.slice(0, this.maxBatchSize);
      const payloads = batch.map((e) => e.payload);

      try {
        await sendFn(payloads);

        const writeTx = db.transaction('events', 'readwrite');
        const store = writeTx.objectStore('events');

        await Promise.all(batch
          .filter((e) => e.id !== undefined)
          .map((e) => store.delete(e.id as number)))
        ;

        await writeTx.done;

        // Continue if more events
        if (allEvents.length > this.maxBatchSize) {
          this.scheduleFlush(0);
        }
      } catch {
        const writeTx = db.transaction('events', 'readwrite');
        const store = writeTx.objectStore('events');

        await Promise.all(
          batch.map((event) => {
            const updatedRetry = event.retryCount + 1;

            if (updatedRetry >= this.maxRetries) {
              return event.id !== undefined
                ? store.delete(event.id)
                : Promise.resolve()
              ;
            }

            return store.put({
              ...event,
              retryCount: updatedRetry,
            });
          }),
        );

        await writeTx.done;

        const maxRetry = Math.max(...batch.map((e) => e.retryCount));
        const delay = this.computeBackoff(maxRetry);

        this.scheduleFlush(delay);
      }
    } finally {
      this.isFlushing = false;
      this.channel.postMessage('unlock');
    }
  }
}
