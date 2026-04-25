export type AlertsPayload = {
  headline: string;
  unread: number;
  items: {
    id: string;
    title: string;
    detail: string;
    severity: 'high' | 'medium' | 'low';
    area: string;
    action: string;
  }[];
};
