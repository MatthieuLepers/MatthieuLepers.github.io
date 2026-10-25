import axios from 'axios';

import { EventQueue } from '@/core/analytics/EventQueue';
import type {
  AnalyticsBaseEvent,
  I18nCTAEvent,
  ProjectCTAEvent,
  SectionEvent,
  SocialCTAEvent,
} from '@/core/analytics/types';
import { getLocalStorage, setLocalStorage } from '@/core/LocalStorage';

const useAnalyticsStore = () => {
  const isDisabled = import.meta.env.VITE_TRACKING_DISABLED === 'true';
  let currentSection: SectionEvent['data'] | null = null;

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
    emit<TEventType extends AnalyticsBaseEvent = AnalyticsBaseEvent>(
      eventType: TEventType['eventType'],
      data?: TEventType['data'],
    ) {
      if (isDisabled) return;

      queue.enqueue({
        eventType,
        sessionId: privates.getSessionId(),
        timestamp: Date.now(),
        data,
      });
    },
    onLand() {
      if (isDisabled) return;

      events.emit('land', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      });
    },
    onEnterSection(payload: Omit<SectionEvent['data'], 'enteredAt' | 'duration'>) {
      if (isDisabled) return;

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
    onI18nCTAClick(payload: I18nCTAEvent['data']) {
      if (isDisabled) return;

      events.emit<I18nCTAEvent>('cta', {
        ...payload,
        type: 'i18n',
      });
    },
    onSocialCTAClick(payload: SocialCTAEvent['data']) {
      if (isDisabled) return;

      events.emit<SocialCTAEvent>('cta', payload);
    },
    onProjectCTAClick(payload: ProjectCTAEvent['data']) {
      if (isDisabled) return;

      events.emit<ProjectCTAEvent>('cta', payload);
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
    if (isDisabled) return;

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
