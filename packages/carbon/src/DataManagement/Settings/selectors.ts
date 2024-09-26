import { State } from "Store";
import { ParsedURL } from "@dashlane/url-parser";
import { personalSettingsSelector } from "Session/selectors";
export const anonymousUserIdSelector = (state: State): string =>
  state.userSession.personalSettings.AnonymousUserId;
export const banishedUrlsListSelector = (state: State): string[] =>
  personalSettingsSelector(state).BanishedUrlsList ?? [];
export const getIsUrlBanishedSelector = (
  state: State,
  url: string
): boolean => {
  const domain = new ParsedURL(url).getHostname();
  return banishedUrlsListSelector(state)
    .map((banishedUrl) => {
      return new ParsedURL(banishedUrl).getHostname();
    })
    .some((hostname) => hostname === domain);
};
