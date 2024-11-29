import {
  ChangeEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserGroupDownload, UserGroupSummary } from "@dashlane/communication";
import { TextInput as TextInputUIComponents } from "@dashlane/ui-components";
import {
  Heading,
  Icon,
  Infobox,
  Paragraph,
  TextInput,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { Lee } from "../../../lee";
import { getUrlCompatibleUuid } from "../../../app/routes/services";
import { createUserGroup } from "../../../libs/carbon/triggers";
import { carbonConnector } from "../../../libs/carbon/connector";
import {
  ButtonWithPopup,
  ButtonWithPopupRef,
} from "../../../libs/dashlane-style/action-with-popup/button";
import { logPageView } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useHistory } from "../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { LEE_NETWORK_ERROR } from "../../alerts/alert-queue-provider";
import { Onboarding } from "./onboarding/onboarding";
import { useTeamSpaceContext } from "../../settings/components/TeamSpaceContext";
import { ConsolePage } from "../../page";
import { NewGroupHelpTip } from "./new-group-help-tip";
import { ROOT_GROUP_STYLES } from "../styles";
import { StarterGroupPaywall } from "../paywall/starter-group-paywall";
import { useGroupPaywallStatus } from "../paywall/use-group-paywall-status";
import { InTrialBusinessPaywall } from "../paywall/in-trial-business-paywall";
import { useIsStandard } from "../../helpers/use-is-standard";
import { StandardGroupPaywall } from "../paywall/standard-group-paywall";
export type GroupListProps = PropsWithChildren<{
  lee: Lee;
  userGroups: UserGroupDownload[];
}>;
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  GROUP_ROW: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gridAutoRows: "62px",
  },
  GROUP_ITEM: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "ds.container.expressive.neutral.supershy.idle",
    borderRadius: "4px",
    border: "1px solid ds.border.neutral.quiet.idle",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    padding: "20px 16px",
  },
};
const I18N_KEYS = {
  ERROR_TITLE: "team_groups_list_create_group_error_title",
  MISSING_KEY_ERROR:
    "team_groups_list_create_group_missing_public_key_error_message",
  CREATE_GROUP_GENERIC_ERROR: "team_groups_list_create_group_error_message",
  CONFIRM_NEW_GROUP_BUTTON: "team_groups_list_new_group_creation_confirm_btn",
  CANCEL_NEW_GROUP_BUTTON: "team_groups_list_new_group_creation_cancel_btn",
  NEW_GROUP_BUTTON: "team_groups_list_new_group_cta",
  NEW_GROUP_HEADER: "team_groups_list_new_group_creation_header",
  NEW_GROUP_INPUT_PLACEHOLDER: "team_groups_list_new_group_input_placeholder",
  GROUP_NAME_ALREADY_EXISTS:
    "team_groups_list_create_group_name_already_exists",
  GROUP_LIST_TITLE: "team_groups_list_title",
  SEARCH_INPUT_PLACEHOLDER: "team_groups_list_search_placeholder",
  INFO_BOX_TITLE: "team_groups_list_info_box_title",
};
export const firstTimeGroupCreationState = "isFirstTimeGroupCreation";
const groupAlphabeticalSort = (a: UserGroupDownload, b: UserGroupDownload) => {
  const aName = a.name.toLocaleLowerCase();
  const bName = b.name.toLocaleLowerCase();
  return aName.localeCompare(bName);
};
export const GroupList = ({ userGroups, lee }: GroupListProps) => {
  const newGroupButtonWithPopup = useRef<ButtonWithPopupRef>(null);
  const { translate } = useTranslate();
  const { teamId } = useTeamSpaceContext();
  const { routes } = useRouterGlobalSettingsContext();
  const { addAlertToQueue, reportTACError } = useAlertQueue();
  const [newGroupName, setNewGroupName] = useState("");
  const [isNewGroupNameValid, setIsNewGroupNameValid] = useState(false);
  const [hasNewGroupDelayPassed, setHasNewGroupDelayPassed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState(userGroups);
  const isFirstTimeGroupCreation = useRef(false);
  const history = useHistory();
  const {
    displayStarterPaywall,
    displayInTrialBusinessPaywall,
    enforceStarterPaywall,
  } = useGroupPaywallStatus(userGroups);
  const isStandardPlan = useIsStandard();
  useEffect(() => {
    logPageView(PageView.TacGroupList);
  }, []);
  useEffect(() => {
    const sortedGroups = [...userGroups].sort(groupAlphabeticalSort);
    const sortedAndFilteredGroups = searchTerm
      ? sortedGroups.filter((group) =>
          group.name
            .toLocaleLowerCase()
            .includes(searchTerm.trim().toLocaleLowerCase())
        )
      : sortedGroups;
    setFilteredGroups(sortedAndFilteredGroups);
  }, [searchTerm, userGroups]);
  const handleClickOnGroup = (group: UserGroupSummary) => {
    history.push({
      pathname: routes.teamGroupRoutePath(getUrlCompatibleUuid(group.groupId)),
    });
  };
  const handleNewGroupNameChanged = async (event: ChangeEvent<HTMLElement>) => {
    const trimmedValue = event.target["value"].trim() ?? "";
    const newGroupNameValid =
      trimmedValue !== "" &&
      (await carbonConnector.isGroupNameAvailable(trimmedValue));
    setNewGroupName(trimmedValue);
    setIsNewGroupNameValid(newGroupNameValid);
  };
  const handleClickOnAddGroupCancel = () => {
    setNewGroupName("");
  };
  const handleClickOnAddGroup = async () => {
    if (!teamId) {
      throw new Error("teamId missing when attempting to create group");
    }
    try {
      await createUserGroup(lee.dispatchGlobal, {
        name: newGroupName,
        teamId,
      });
      newGroupButtonWithPopup.current?.hidePopup();
      setNewGroupName("");
      if (!userGroups?.length) {
        isFirstTimeGroupCreation.current = true;
        setTimeout(() => {
          setHasNewGroupDelayPassed(true);
        }, 700);
      } else if (isFirstTimeGroupCreation.current) {
        isFirstTimeGroupCreation.current = false;
      }
    } catch (error) {
      let errorDetails: string;
      try {
        errorDetails = JSON.parse(error.message)?.code;
      } catch {
        errorDetails = `${error?.message}`.toUpperCase();
      }
      if (errorDetails !== LEE_NETWORK_ERROR) {
        addAlertToQueue({
          title: translate(I18N_KEYS.ERROR_TITLE),
          message:
            errorDetails === "MISSING_PUBLIC_KEY"
              ? translate(I18N_KEYS.MISSING_KEY_ERROR)
              : translate(I18N_KEYS.CREATE_GROUP_GENERIC_ERROR),
        });
      }
      reportTACError(new Error(error.message));
    }
  };
  const renderGroupItems = (groups: UserGroupSummary[]) =>
    groups.map((group, idx) =>
      group ? (
        <NewGroupHelpTip
          key={group.groupId}
          index={idx}
          isFirstTimeGroupCreation={isFirstTimeGroupCreation.current}
          hasNewGroupDelayPassed={hasNewGroupDelayPassed}
        >
          <div
            className="groupItem"
            onClick={() => handleClickOnGroup(group)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClickOnGroup(group);
              }
            }}
            tabIndex={0}
            role="button"
            title={group.name}
            sx={SX_STYLES.GROUP_ITEM}
          >
            <Heading
              as="h2"
              textStyle="ds.title.block.medium"
              color="ds.text.neutral.catchy"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {group.name}
            </Heading>
          </div>
        </NewGroupHelpTip>
      ) : null
    );
  const renderContent = () => {
    const groupsList = userGroups?.length ? (
      renderGroupItems(filteredGroups)
    ) : (
      <Onboarding />
    );
    return (
      <>
        {displayStarterPaywall ? (
          <StarterGroupPaywall
            enforcePaywall={enforceStarterPaywall}
            sx={{ marginBottom: "24px" }}
          />
        ) : null}

        {displayInTrialBusinessPaywall ? (
          <InTrialBusinessPaywall sx={{ marginBottom: "24px" }} />
        ) : null}

        {!isStandardPlan ? (
          <div sx={ROOT_GROUP_STYLES.CARD_CONTAINER}>
            <TextInput
              aria-label={translate(I18N_KEYS.SEARCH_INPUT_PLACEHOLDER)}
              placeholder={translate(I18N_KEYS.SEARCH_INPUT_PLACEHOLDER)}
              type="search"
              onChange={(e) => setSearchTerm(e.target.value ?? "")}
              prefixIcon={<Icon name="ActionSearchOutlined" />}
              sx={{ maxWidth: "365px", margin: 0, padding: "0" }}
            />

            <Infobox
              title={translate(I18N_KEYS.INFO_BOX_TITLE)}
              mood="neutral"
            />

            <div sx={userGroups?.length ? SX_STYLES.GROUP_ROW : undefined}>
              {groupsList}
            </div>
          </div>
        ) : (
          <StandardGroupPaywall />
        )}
      </>
    );
  };
  const renderHeader = () => {
    const showError = !isNewGroupNameValid && newGroupName !== "";
    return (
      <div sx={ROOT_GROUP_STYLES.HEADER}>
        <div
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Heading
            as="h1"
            color="ds.text.neutral.standard"
            textStyle="ds.title.section.large"
          >
            {translate(I18N_KEYS.GROUP_LIST_TITLE)}
          </Heading>
          {enforceStarterPaywall || isStandardPlan ? null : (
            <ButtonWithPopup
              ref={newGroupButtonWithPopup}
              buttonLabel={translate(I18N_KEYS.NEW_GROUP_BUTTON)}
              confirmButtonLabel={translate(I18N_KEYS.CONFIRM_NEW_GROUP_BUTTON)}
              cancelButtonLabel={translate(I18N_KEYS.CANCEL_NEW_GROUP_BUTTON)}
              onConfirmButtonClick={handleClickOnAddGroup}
              onCancelButtonClick={handleClickOnAddGroupCancel}
              confirmButtonDisabled={!isNewGroupNameValid}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Paragraph as="label">
                  {translate(I18N_KEYS.NEW_GROUP_HEADER)}
                </Paragraph>

                <TextInputUIComponents
                  fullWidth
                  onChange={handleNewGroupNameChanged}
                  defaultValue={newGroupName}
                  type="text"
                  placeholder={translate(I18N_KEYS.NEW_GROUP_INPUT_PLACEHOLDER)}
                  feedbackType={showError ? "error" : undefined}
                  feedbackText={
                    showError
                      ? translate(I18N_KEYS.GROUP_NAME_ALREADY_EXISTS)
                      : undefined
                  }
                  autoFocus
                />
              </div>
            </ButtonWithPopup>
          )}
        </div>
      </div>
    );
  };
  return <ConsolePage header={renderHeader()}>{renderContent()}</ConsolePage>;
};
