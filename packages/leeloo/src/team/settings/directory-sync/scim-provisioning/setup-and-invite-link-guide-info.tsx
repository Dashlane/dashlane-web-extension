import { FormEvent, MouseEvent, useState } from "react";
import { useFeatureFlip } from "@dashlane/framework-react";
import { Flex, Icon, Paragraph } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { AvailableFeatureFlips } from "@dashlane/team-admin-contracts";
import { LinkCard, LinkType } from "../../components/layout/link-card";
import { useInviteLinkDataGraphene } from "../../hooks/use-invite-link";
import { useInviteLinkData } from "../../hooks/useInviteLinkData";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { InviteLinkActivationDialog } from "../../../invite-link-activation-dialog/invite-link-activation-dialog";
import { InviteLinkSharingDialog } from "../../../invite-link-sharing-dialog/invite-link-sharing-dialog";
import { ShareInviteLinkDialog } from "../../../invite-link-sharing-dialog/share-invite-link-dialog";
import { ActivateInviteLinkDialog } from "../../../invite-link-activation-dialog/activate-invite-link-dialog";
const SETUP_GUIDE_HREF = "__REDACTED__";
const I18N_KEYS = {
  SETUP_GUIDE_HEADING:
    "team_settings_encryption_service_scim_setup_guide_heading",
  SETUP_GUIDE_DESCRIPTION:
    "team_settings_encryption_service_scim_setup_guide_description",
  SETUP_GUIDE_LINK:
    "team_settings_encryption_service_scim_setup_guide_link_text",
  INVITE_LINK_GUIDE_HEADING:
    "team_settings_encryption_service_scim_invite_link_heading",
  INVITE_LINK_GUIDE_DESCRIPTION:
    "team_settings_encryption_service_scim_invite_link_description_first",
  INVITE_LINK_GUIDE_COPY:
    "team_settings_encryption_service_scim_invite_link_copy",
};
type Params = {
  isScimEnabled: boolean | null;
};
export const SetupAndInviteLinkGuideInfo = ({ isScimEnabled }: Params) => {
  const { translate } = useTranslate();
  const { getInviteLinkDataForAdmin } = useInviteLinkData();
  const inviteLinkDataGraphene = useInviteLinkDataGraphene();
  const shouldUseInviteLinkDataGraphene = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showActivateInviteLinkModal, setShowActivateInviteLinkModal] =
    useState(false);
  if (
    shouldUseInviteLinkDataGraphene === null ||
    shouldUseInviteLinkDataGraphene === undefined
  ) {
    return null;
  }
  const teamData =
    inviteLinkDataGraphene.status === DataStatus.Success
      ? inviteLinkDataGraphene
      : undefined;
  const handleCopyInviteLink = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    const legacyInviteLinkData = await getInviteLinkDataForAdmin();
    if (
      shouldUseInviteLinkDataGraphene
        ? teamData?.enabled
        : legacyInviteLinkData?.disabled || !legacyInviteLinkData?.teamKey
    ) {
      setShowActivateInviteLinkModal(true);
    } else {
      setShowInviteLinkModal(true);
    }
  };
  const handleOnShareInviteLinkDialogClose = () => {
    setShowInviteLinkModal(false);
  };
  const handleOnActivateInviteLinkDialogCancel = () => {
    setShowActivateInviteLinkModal(false);
  };
  return (
    <Flex gap="6">
      {shouldUseInviteLinkDataGraphene ? (
        <ShareInviteLinkDialog
          isOpen={showInviteLinkModal}
          onClose={handleOnShareInviteLinkDialogClose}
        />
      ) : (
        <InviteLinkSharingDialog
          showSharingDialog={showInviteLinkModal}
          setShowSharingDialog={setShowInviteLinkModal}
        />
      )}
      {showActivateInviteLinkModal ? (
        shouldUseInviteLinkDataGraphene ? (
          <ActivateInviteLinkDialog
            isOpen={showActivateInviteLinkModal}
            onCancel={handleOnActivateInviteLinkDialogCancel}
          />
        ) : (
          <InviteLinkActivationDialog
            showActivationDialog={showActivateInviteLinkModal}
            setShowActivationDialog={setShowActivateInviteLinkModal}
            setShowSharingDialog={setShowInviteLinkModal}
          />
        )
      ) : null}

      <LinkCard
        linkProps={{
          linkType: LinkType.ExternalLink,
          linkHref: SETUP_GUIDE_HREF,
        }}
        heading={translate(I18N_KEYS.SETUP_GUIDE_HEADING)}
        description={translate(I18N_KEYS.SETUP_GUIDE_DESCRIPTION)}
        linkText={translate(I18N_KEYS.SETUP_GUIDE_LINK)}
      />
      {isScimEnabled ? (
        <LinkCard
          linkProps={{
            linkType: LinkType.ExternalLink,
          }}
          heading={translate(I18N_KEYS.INVITE_LINK_GUIDE_HEADING)}
          description={
            <div>
              <Paragraph
                color="ds.text.neutral.standard"
                textStyle="ds.body.standard.regular"
                sx={{ mb: "8px" }}
              >
                {translate(I18N_KEYS.INVITE_LINK_GUIDE_DESCRIPTION)}
              </Paragraph>
              <Paragraph
                as="a"
                color="ds.text.brand.standard"
                onClick={handleCopyInviteLink}
                href="_blank"
                sx={{ gap: "4px" }}
              >
                <span>{translate(I18N_KEYS.INVITE_LINK_GUIDE_COPY)}</span>
                <Icon
                  name="ActionCopyOutlined"
                  size="medium"
                  color="ds.text.brand.standard"
                />
              </Paragraph>
            </div>
          }
        />
      ) : null}
    </Flex>
  );
};
