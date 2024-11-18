export interface Announcement {
  type: string;
  [key: string]: any;
}
export interface AnnouncementContext {
  timestamp: number;
}
export type Monitor<A extends Announcement> = (
  announcement: A,
  context: AnnouncementContext
) => void;
export type Announce<A extends Announcement> = (...announcements: A[]) => void;
