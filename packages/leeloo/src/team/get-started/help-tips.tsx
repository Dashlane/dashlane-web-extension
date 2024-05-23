import { ReactNode, useState } from 'react';
import { Button, Heading, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { Card, FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { openUrl } from 'libs/external-urls';
import { ADMIN_HELP_CENTER, DASHLANE_RESOURCE_LIBRARY } from 'team/urls';
const I18N_KEYS = {
    ACCESS_GUIDES_TITLE: 'team_get_started_help_access_guide_title',
    ACCESS_GUIDES_CONTENT: 'team_get_started_help_access_guide_content',
    ACCESS_GUIDES_CTA: 'team_get_started_help_access_guide_cta',
    CUSTOMIZE_TITLE: 'team_get_started_help_customize_title',
    CUSTOMIZE_CONTENT: 'team_get_started_help_customize_content',
    CUSTOMIZE_CTA: 'team_get_started_help_customize_cta',
    ACTIVITY_TITLE: 'team_get_started_help_activity_title',
    ACTIVITY_CONTENT: 'team_get_started_help_activity_content',
    ACTIVITY_CTA: 'team_get_started_help_activity_cta',
    DEPLOY_TITLE: 'team_get_started_help_deploy_title',
    DEPLOY_CONTENT: 'team_get_started_help_deploy_content',
    DEPLOY_CTA: 'team_get_started_help_deploy_cta',
    MORE_HELP_TITLE: 'team_get_started_help_more_title',
    VISIT_HELP_CENTER: 'team_get_started_help_visit_help_center',
    VISIT_RESOURCE_LIBRARY: 'team_get_started_help_visit_help_resources',
    CONTACT_SUPPORT: 'team_get_started_help_visit_help_contact_support',
    NEXT_BUTTON: '_common_action_continue',
    PREVIOUS_BUTTON: '_common_action_back',
};
const DEPLOY_DASHLANE_HELP_URL = '*****';
interface StandardHelpTipCardProps {
    title: string;
    content: string;
    ctaText: string;
    ctaAction: () => void;
    buttonIcon?: ReactNode;
}
const StandardHelpTipCard = ({ title, content, ctaText, ctaAction, buttonIcon, }: StandardHelpTipCardProps) => (<FlexContainer flexDirection="column" gap={4}>
    <Heading as="h1">{title}</Heading>
    <Paragraph>{content}</Paragraph>
    <Button onClick={ctaAction} sx={{ marginTop: '16px' }} size="small" mood="neutral" intensity="quiet" layout={buttonIcon ? 'iconTrailing' : 'labelOnly'} icon={buttonIcon}>
      {ctaText}
    </Button>
  </FlexContainer>);
interface HelpTipsProps {
    setContactSupportDialogIsOpen: (isOpen: boolean) => void;
}
export const HelpTips = ({ setContactSupportDialogIsOpen }: HelpTipsProps) => {
    const { translate } = useTranslate();
    const routerContext = useRouterGlobalSettingsContext();
    const history = useHistory();
    const helpTips: ReactNode[] = [
        <StandardHelpTipCard key="accessGuides" title={translate(I18N_KEYS.ACCESS_GUIDES_TITLE)} content={translate(I18N_KEYS.ACCESS_GUIDES_CONTENT)} ctaText={translate(I18N_KEYS.ACCESS_GUIDES_CTA)} ctaAction={() => {
                openUrl(ADMIN_HELP_CENTER);
            }} buttonIcon={<Icon name="ActionOpenExternalLinkOutlined"/>}/>,
        <StandardHelpTipCard key="customize" title={translate(I18N_KEYS.CUSTOMIZE_TITLE)} content={translate(I18N_KEYS.CUSTOMIZE_CONTENT)} ctaText={translate(I18N_KEYS.CUSTOMIZE_CTA)} ctaAction={() => {
                history.push(routerContext.routes.teamSettingsRoutePath);
            }}/>,
        <StandardHelpTipCard key="activity" title={translate(I18N_KEYS.ACTIVITY_TITLE)} content={translate(I18N_KEYS.ACTIVITY_CONTENT)} ctaText={translate(I18N_KEYS.ACTIVITY_CTA)} ctaAction={() => {
                history.push(routerContext.routes.teamActivityRoutePath);
            }}/>,
        <StandardHelpTipCard key="deploy" title={translate(I18N_KEYS.DEPLOY_TITLE)} content={translate(I18N_KEYS.DEPLOY_CONTENT)} ctaText={translate(I18N_KEYS.DEPLOY_CTA)} ctaAction={() => {
                openUrl(DEPLOY_DASHLANE_HELP_URL);
            }} buttonIcon={<Icon name="ActionOpenExternalLinkOutlined"/>}/>,
        <FlexContainer key="moreHelp" flexDirection="column" gap={4} justifyContent="start">
      <Heading as="h1">{translate(I18N_KEYS.MORE_HELP_TITLE)}</Heading>
      <Button size="small" mood="brand" sx={{ textAlign: 'left' }} intensity="supershy" layout="iconTrailing" icon={<Icon name="ActionOpenExternalLinkOutlined"/>} onClick={() => openUrl(ADMIN_HELP_CENTER)}>
        {translate(I18N_KEYS.VISIT_HELP_CENTER)}
      </Button>
      <Button size="small" mood="brand" sx={{ textAlign: 'left' }} intensity="supershy" layout="iconTrailing" icon={<Icon name="ActionOpenExternalLinkOutlined"/>} onClick={() => openUrl(DASHLANE_RESOURCE_LIBRARY)}>
        {translate(I18N_KEYS.VISIT_RESOURCE_LIBRARY)}
      </Button>
      <Button size="small" mood="brand" sx={{ textAlign: 'left' }} intensity="supershy" layout="iconTrailing" icon={<Icon name="ActionOpenExternalLinkOutlined"/>} onClick={() => setContactSupportDialogIsOpen(true)}>
        {translate(I18N_KEYS.CONTACT_SUPPORT)}
      </Button>
    </FlexContainer>,
    ];
    const [currentItem, setCurrentItem] = useState(0);
    const totalItems = helpTips.length;
    const handleNextClick = () => {
        setCurrentItem((current) => (current + 1) % totalItems);
    };
    const handlePreviousClick = () => {
        setCurrentItem((current) => current - 1 < 0 ? totalItems - 1 : (current - 1) % totalItems);
    };
    return (<Card sx={{
            padding: '32px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            borderColor: 'ds.border.neutral.quiet.idle',
            maxWidth: '480px',
            minWidth: '320px',
        }}>
      <FlexContainer alignItems="center" sx={{ marginBottom: '16px' }} flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
        <Paragraph color="ds.text.neutral.quiet">
          {currentItem + 1}/{totalItems}
        </Paragraph>
        <FlexContainer gap={4}>
          <Button aria-label={translate(I18N_KEYS.PREVIOUS_BUTTON)} onClick={handlePreviousClick} mood="neutral" intensity="supershy" icon={<Icon name="CaretLeftOutlined"/>} layout="iconOnly"/>
          <Button aria-label={translate(I18N_KEYS.NEXT_BUTTON)} onClick={handleNextClick} mood="neutral" intensity="supershy" icon={<Icon name="CaretRightOutlined"/>} layout="iconOnly"/>
        </FlexContainer>
      </FlexContainer>
      {helpTips[currentItem]}
    </Card>);
};
