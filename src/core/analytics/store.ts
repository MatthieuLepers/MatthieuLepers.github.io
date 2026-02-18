import axios from 'axios';

import { getLocalStorage, setLocalStorage } from '@/core/LocalStorage';
import { EventQueue } from '@/core/analytics/EventQueue';
import type { AnalyticsEventType, CTAEvent, SectionEvent } from '@/core/analytics/types';

const useAnalyticsStore = () => {
  let currentSection: SectionEvent | null = null;

  const queue = new EventQueue({
    maxBatchSize: 20,
    maxRetries: 5,
    baseDelayMs: 1000,
  });

  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/`,
  });

  const privates = {
    flush: () => queue.flush((payloads) => axiosInstance.post('analytics/events', payloads)),
    getSessionId() {
      const currentSessionId = getLocalStorage<string | null>('sessionId', 'null');

      if (!currentSessionId) {
        const sessionId = crypto.randomUUID();
        setLocalStorage('sessionId', sessionId);

        return sessionId;
      }

      return currentSessionId;
    },
  };

  const events = {
    emit(eventType: AnalyticsEventType, data: Record<string, any> = {}) {
      queue.enqueue({
        eventType,
        sessionId: privates.getSessionId(),
        timestamp: Date.now(),
        data,
      });
    },
    onLand() {
      events.emit('land', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      });
    },
    onEnterSection(payload: Omit<SectionEvent, 'enteredAt' | 'duration'>) {
      const now = Date.now();

      if (currentSection) {
        const duration = now - currentSection.enteredAt;

        events.emit('section', {
          ...currentSection,
          duration,
        });
      }

      currentSection = {
        ...payload,
        enteredAt: now,
      };
    },
    onClickCTA(payload: CTAEvent) {
      events.emit('cta', payload);
    },
  };

  const flushCurrentSection = () => {
    if (!currentSection) return;

    const duration = Date.now() - currentSection.enteredAt;

    events.emit('section', {
      ...currentSection,
      duration,
    });

    currentSection = null;
  };

  const setup = () => {
    window.addEventListener('load', () => {
      window.setInterval(() => {
        privates.flush();
      }, 5000);

      privates.flush();
    });

    window.addEventListener('beforeunload', () => {
      flushCurrentSection();
      events.emit('leave');

      queue.flush((payloads) => {
        const blob = new Blob([JSON.stringify(payloads)], {
          type: 'application/json',
        });

        navigator.sendBeacon(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/analytics/events`,
          blob,
        );

        return Promise.resolve();
      });
    });
  };

  return {
    actions: {
      setup,
      ...events,
    },
  };
};

export const analyticsStore = useAnalyticsStore();
