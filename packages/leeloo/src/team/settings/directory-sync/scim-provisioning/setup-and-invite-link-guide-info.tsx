import { Icon, jsx, Paragraph } from '@dashlane/design-system';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import React, { useState } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
import { LinkCard, LinkType } from 'team/settings/components/layout/link-card';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { InviteLinkActivationDialog } from 'team/invite-link-activation-dialog/invite-link-activation-dialog';
import { InviteLinkSharingDialog } from 'team/invite-link-sharing-dialog/invite-link-sharing-dialog';
import { FlexChild, FlexContainer } from '@dashlane/ui-components';
const SETUP_GUIDE_HREF = '*****';
const I18N_KEYS = {
    SETUP_GUIDE_HEADING: 'team_settings_encryption_service_scim_setup_guide_heading',
    SETUP_GUIDE_DESCRIPTION: 'team_settings_encryption_service_scim_setup_guide_description',
    SETUP_GUIDE_LINK: 'team_settings_encryption_service_scim_setup_guide_link_text',
    INVITE_LINK_GUIDE_HEADING: 'team_settings_encryption_service_scim_invite_link_heading',
    INVITE_LINK_GUIDE_DESCRIPTION: 'team_settings_encryption_service_scim_invite_link_description_first',
    INVITE_LINK_GUIDE_COPY: 'team_settings_encryption_service_scim_invite_link_copy',
};
type Params = {
    isScimEnabled: boolean;
};
export const SetupAndInviteLinkGuideInfo = (params: Params) => {
    const { translate } = useTranslate();
    const isTeamSignUpPageEnabled = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.OnboardingWebTeamsignuppage);
    const { getInviteLinkDataForAdmin } = useInviteLinkData();
    const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
    const [showActivateInviteLinkModal, setShowActivateInviteLinkModal] = useState(false);
    const handleCopyInviteLink = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const inviteLinkDataForAdmin = await getInviteLinkDataForAdmin();
        if (inviteLinkDataForAdmin?.disabled || !inviteLinkDataForAdmin?.teamKey) {
            setShowActivateInviteLinkModal(true);
        }
        else {
            setShowInviteLinkModal(true);
        }
    };
    return (<FlexContainer gap="6" {...params}>
      {isTeamSignUpPageEnabled ? (<InviteLinkSharingDialog showSharingDialog={showInviteLinkModal} setShowSharingDialog={setShowInviteLinkModal}/>) : null}
      {isTeamSignUpPageEnabled && showActivateInviteLinkModal ? (<InviteLinkActivationDialog showActivationDialog={showActivateInviteLinkModal} setShowActivationDialog={setShowActivateInviteLinkModal} setShowSharingDialog={setShowInviteLinkModal}/>) : null}

      <LinkCard linkProps={{
            linkType: LinkType.ExternalLink,
            linkHref: SETUP_GUIDE_HREF,
        }} heading={translate(I18N_KEYS.SETUP_GUIDE_HEADING)} description={translate(I18N_KEYS.SETUP_GUIDE_DESCRIPTION)} linkText={translate(I18N_KEYS.SETUP_GUIDE_LINK)}/>
      {isTeamSignUpPageEnabled && params.isScimEnabled ? (<LinkCard linkProps={{
                linkType: LinkType.ExternalLink,
            }} heading={translate(I18N_KEYS.INVITE_LINK_GUIDE_HEADING)} description={<div>
              <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular" sx={{ mb: '8px' }}>
                {translate(I18N_KEYS.INVITE_LINK_GUIDE_DESCRIPTION)}
              </Paragraph>
              <FlexChild as={Paragraph} innerAs="a" color="ds.text.brand.standard" onClick={handleCopyInviteLink} gap="4px" href="_blank">
                <span>{translate(I18N_KEYS.INVITE_LINK_GUIDE_COPY)}</span>
                <Icon name="ActionCopyOutlined" size="medium" color="ds.text.brand.standard"/>
              </FlexChild>
            </div>}/>) : null}
    </FlexContainer>);
};
