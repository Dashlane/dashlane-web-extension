import {
  GuideSectionItems,
  GuideSections,
  Section,
} from "../types/section.types";
import { Link, Task } from "../types/item.types";
import {
  AddPasswordGuideItem,
  CreateAccountGuideItem,
  GetMobileAppGuideItem,
  InstallExtensionGuideItem,
  InviteMembersGuideItem,
  OpenAdminConsoleGuideItem,
  ShareItemGuideItem,
  TryAutofillGuideItem,
} from "../guide-items";
import { GuideUserType } from "../types/user.types";
const I18N_KEYS = {
  VAULT: "onb_vault_get_started_section_title_vault",
  TEAM_SECURITY: "onb_vault_get_started_section_title_team_security",
  ADDITIONAL_TASKS: "onb_vault_get_started_section_title_additional_tasks",
};
export const useGuideSectionsDefinition = (
  userType: GuideUserType
): GuideSections => {
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const vaultGuideItems: GuideSectionItems = {
    [Task.INSTALL_EXTENSION]: {
      hidden:
        !isInExtensionOrDesktop || userType !== GuideUserType.TEAM_CREATOR,
      component: InstallExtensionGuideItem,
    },
    [Task.CREATE_ACCOUNT]: {
      component: CreateAccountGuideItem,
      hidden: userType === GuideUserType.TEAM_CREATOR,
    },
    [Task.ADD_PASSWORD]: {
      component: AddPasswordGuideItem,
    },
    [Task.TRY_AUTOFILL]: {
      component: TryAutofillGuideItem,
    },
    [Task.GET_MOBILE_APP]: {
      component: GetMobileAppGuideItem,
      hidden: userType === GuideUserType.TEAM_CREATOR,
    },
  };
  const teamSecurityGuideItems: GuideSectionItems = {
    [Task.INVITE_MEMBERS]: {
      component: InviteMembersGuideItem,
    },
    [Task.OPEN_ADMIN_CONSOLE]: {
      component: OpenAdminConsoleGuideItem,
    },
  };
  const sharingGuideItems: GuideSectionItems = {
    [Link.SHARE_ITEM]: {
      component: ShareItemGuideItem,
    },
  };
  const defaultSections = {
    [Section.VAULT]: {
      name: I18N_KEYS.VAULT,
      items: vaultGuideItems,
    },
  };
  const adminSections = {
    [Section.TEAM_SECURITY]: {
      name: I18N_KEYS.TEAM_SECURITY,
      items: teamSecurityGuideItems,
    },
    [Section.ADDITIONAL_TASKS]: {
      name: I18N_KEYS.ADDITIONAL_TASKS,
      items: sharingGuideItems,
    },
  };
  if (userType === GuideUserType.TEAM_CREATOR) {
    return {
      ...defaultSections,
      ...adminSections,
    };
  }
  return defaultSections;
};
