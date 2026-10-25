export type AnalyticsEventType = 'land' | 'leave' | 'section' | 'cta';

// Base types
export type AnalyticsBaseEvent<
  TEventType = AnalyticsEventType,
  TData = Record<string, unknown> | undefined,
> = {
  eventType: TEventType;
  sessionId: string;
  timestamp: number;
  data: TData;
};

export type LandEvent = AnalyticsBaseEvent<'land'>;

export type LeaveEvent = AnalyticsBaseEvent<'leave'>;

// App events
export type SectionEventType = 'hero' | 'project';

export type SectionEventOrigin = 'scroll' | 'hero_arrow_down' | 'project_arrow_up' | 'project_arrow_down' | 'navigation';

export type SectionEvent = AnalyticsBaseEvent<'section', {
  type: SectionEventType;
  origin?: SectionEventOrigin;
  projectName?: string;
  enteredAt: number;
  duration?: number;
}>;

export type CTABaseEvent<
  TCTAType extends string,
  TEventData extends AnalyticsBaseEvent['data'] = AnalyticsBaseEvent['data']
> = AnalyticsBaseEvent<'cta', TEventData & {
  type: TCTAType;
}>;

export type SocialCTAEvent = CTABaseEvent<'calendly' | 'profil_linkedin' | 'profil_malt' | 'profil_github'>;

export type I18nCTAEvent = CTABaseEvent<'i18n', {
  lang: string;
}>;

export type ProjectCTAEvent = CTABaseEvent<'project_try' | 'project_github', {
  projectName: string;
}>;
