export type AnalyticsEventType = 'land' | 'leave' | 'section' | 'cta';

export type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  sessionId: string;
  timestamp: number;
  data: Record<string, any>;
};

export type SectionEventType = 'hero' | 'project';

export type SectionEventOrigin = 'scroll' | 'hero_arrow_down' | 'project_arrow_up' | 'project_arrow_down' | 'navigation';

export type SectionEvent = {
  type: SectionEventType;
  origin?: SectionEventOrigin;
  projectName?: string;
  enteredAt: number;
  duration?: number;
};

export type CTAEventType = 'calendly' | 'profil_linkedin' | 'profil_malt' | 'profil_github' | 'i18n' | 'project_try' | 'project_github';

export type CTAEvent = {
  type: CTAEventType;
  projectName?: string;
  lang?: string;
};
