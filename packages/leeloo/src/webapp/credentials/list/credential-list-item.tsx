import { memo } from "react";
import { fromUnixTime } from "date-fns";
import { Checkbox, Tooltip } from "@dashlane/design-system";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import { CredentialPreferences } from "@dashlane/autofill-contracts";
import { PageView } from "@dashlane/hermes";
import LocalizedTimeAgo from "../../../libs/i18n/localizedTimeAgo";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import {
  useLocation,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { logPageView } from "../../../libs/logs/logEvent";
import { logSelectCredential } from "../../../libs/logs/events/vault/select-item";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useMultiselectContext,
  useMultiselectHandler,
  useMultiselectUpdateContext,
} from "../../list-view/multi-select/multi-select-context";
import { CredentialTitle } from "./credential-title";
import { ListRowActions } from "./list-row-actions";
import { SX_STYLES } from "../style";
import Row from "../../list-view/row";
import { useCompromisedCredentialsContext } from "../credentials-view/compromised-credentials-context";
import { VaultRowItemCollectionsList } from "./collections";
import { useCredentialsContext } from "../credentials-view/credentials-context";
import { useSharingContext } from "../credentials-view/sharing-context";
const I18N_KEYS = {
  DISABLED_CHECKBOX_TOOLTIP: "webapp_multiselect_disabled_checkbox_tooltip",
  LAST_USED_NEVER: "webapp_credentials_row_last_used_never",
};
interface CredentialListItemProps {
  credential: Credential;
  credentialPreferences: CredentialPreferences;
  isUserFrozen: boolean;
  className?: string;
}
interface CredentialRowProps extends CredentialListItemProps {
  isSelected: boolean;
  isShared: boolean;
}
interface TitleProps {
  credential: Credential;
  credentialPreferences: CredentialPreferences;
  isShared: boolean;
}
const Title = ({ credential, credentialPreferences, isShared }: TitleProps) => {
  const { isCredentialCompromised } = useCompromisedCredentialsContext();
  return (
    <CredentialTitle
      credential={credential}
      isShared={isShared}
      requiresMP={Boolean(credentialPreferences?.requireMasterPassword)}
      isCompromised={isCredentialCompromised(credential.id)}
    />
  );
};
const CredentialRow = ({
  credential,
  credentialPreferences,
  isUserFrozen,
  isSelected,
  isShared,
  className,
}: CredentialRowProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { pathname } = useLocation();
  const { credentials, previousPage } = useCredentialsContext();
  const { sharingStatus } = useSharingContext();
  const onSelectCredential = useMultiselectHandler(credentials, sharingStatus);
  const credentialItemRoute = routes.userVaultItem(
    credential.id,
    VaultItemType.Credential,
    pathname
  );
  const onRowClick = () => {
    logPageView(PageView.ItemCredentialDetails);
    logSelectCredential(credential.id);
  };
  return (
    <Row
      previousPage={previousPage}
      link={credentialItemRoute}
      type={"link"}
      selected={isSelected}
      onClick={onRowClick}
      className={className}
      checkable={
        <Tooltip
          passThrough={!isShared}
          location="right"
          content={translate(I18N_KEYS.DISABLED_CHECKBOX_TOOLTIP)}
          sx={{
            maxWidth: "200px",
            whiteSpace: "normal",
          }}
        >
          <span sx={{ marginRight: "16px" }}>
            <Checkbox
              aria-label={
                credential.URL !== "" ? credential.URL : credential.username
              }
              sx={{ position: "relative", gap: "0" }}
              checked={isSelected}
              onChange={(event) =>
                onSelectCredential(credential.id, "credentials", event)
              }
              readOnly={isShared}
            />
          </span>
        </Tooltip>
      }
      data={[
        {
          key: "title",
          content: (
            <Title
              credential={credential}
              credentialPreferences={credentialPreferences}
              isShared={isShared}
            />
          ),
        },
        {
          key: "lastUse",
          content: (
            <IntelligentTooltipOnOverflow>
              {credential.lastUse && credential.lastUse > 0 ? (
                <LocalizedTimeAgo date={fromUnixTime(credential.lastUse)} />
              ) : (
                translate(I18N_KEYS.LAST_USED_NEVER)
              )}
            </IntelligentTooltipOnOverflow>
          ),
          sxProps: SX_STYLES.LAST_USE_CELL,
        },
        {
          key: "collection",
          content: <VaultRowItemCollectionsList vaultItemId={credential.id} />,
          sxProps: SX_STYLES.COLLECTION_CELL,
        },
      ]}
      actions={
        <ListRowActions
          credentialItemRoute={credentialItemRoute}
          credential={credential}
          credentialPreferences={credentialPreferences}
          isUserFrozen={isUserFrozen}
        />
      }
    />
  );
};
const MemoedCredentialRow = memo(CredentialRow);
export const CredentialListItem = ({
  credential,
  credentialPreferences,
  isUserFrozen,
  className,
}: CredentialListItemProps) => {
  const { isSelected } = useMultiselectContext();
  const { sharingStatus } = useSharingContext();
  const { toggleSelectedItems } = useMultiselectUpdateContext();
  const isShared = sharingStatus[credential.id]?.isShared;
  const isCredentialSelected = isSelected(credential.id, "credentials");
  if (isCredentialSelected && isShared) {
    toggleSelectedItems(new Set([credential.id]), "credentials");
    return null;
  }
  return (
    <MemoedCredentialRow
      credential={credential}
      credentialPreferences={credentialPreferences}
      isUserFrozen={isUserFrozen}
      isShared={isShared}
      isSelected={isCredentialSelected}
      className={className}
    />
  );
};
