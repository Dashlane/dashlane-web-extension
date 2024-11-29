import { FC } from "react";
export enum SettingTab {
  Privacy = "privacy",
  Appearance = "appearance",
}
export type SettingsRouteParams = {
  settingTab: SettingTab;
};
export type SettingsConfiguration = Record<
  SettingTab,
  {
    title: string;
    component: FC;
    hidden?: boolean;
  }
>;
