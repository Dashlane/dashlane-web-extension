import { forEach } from "ramda";
import { logWarn } from "Logs/Debugger";
import {
  Announce,
  Announcement,
  AnnouncementContext,
  Monitor,
} from "Libs/Probe/types";
const monitorForAnnouncement =
  <A extends Announcement>(monitor: Monitor<A>, context: AnnouncementContext) =>
  (announcement: A) => {
    try {
      monitor(announcement, context);
    } catch (error) {
      logWarn({
        message: `Monitor raised an error on announcement ${announcement.type}`,
        tag: "Probe",
        details: { error },
      });
    }
  };
const getAnnouncementContext = (): AnnouncementContext => ({
  timestamp: Date.now(),
});
const monitorForAnnouncements =
  <A extends Announcement>(announcements: A[], context: AnnouncementContext) =>
  (monitor: Monitor<A>) =>
    forEach(monitorForAnnouncement(monitor, context), announcements);
export const setupProbe =
  <A extends Announcement>(...monitors: Monitor<A>[]): Announce<A> =>
  (...announcements: A[]) => {
    const context = getAnnouncementContext();
    forEach(monitorForAnnouncements(announcements, context), monitors);
  };
