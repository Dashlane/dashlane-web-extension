import { Badge, Button, Heading, Icon, jsx, Paragraph, } from '@dashlane/design-system';
import { Card, FlexContainer, GridChild, GridContainer, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory, useRouteMatch } from 'libs/router';
const I18N_KEYS = {
    SCIM_CARD_OPTION: 'tac_settings_directory_sync_card_option',
    SCIM_CARD_BUTTON_SETUP: 'tac_settings_directory_sync_card_button_setup',
    SCIM_CARD_BUTTON_EDIT: 'tac_settings_directory_sync_card_button_edit',
    SCIM_CARD_BADGE_ENABLED: 'tac_settings_directory_sync_card_badge_enabled',
    SCIM_CARD_BADGE_BETA: 'tac_settings_directory_sync_card_title_badge_beta',
};
interface FeatureCardItemProps {
    title: string;
    description?: string;
    isSupported: boolean;
    disabled: boolean;
}
export interface FeatureCardProps {
    title: string;
    redirectUrl: string;
    optionNumber: number;
    disabled?: boolean;
    selected?: boolean;
    supportedFeatures: Omit<FeatureCardItemProps, 'disabled'>[];
    isBetaFeature?: boolean;
    onCtaClick?: () => void;
}
const FeatureCardItem = ({ title, description, isSupported, disabled = false, }: FeatureCardItemProps) => {
    const { translate } = useTranslate();
    return (<FlexContainer flexDirection="row" gap="8px" flexWrap="nowrap" alignItems="flex-start">
      <div sx={{
            padding: '10px',
            borderRadius: '12px',
            background: isSupported
                ? 'ds.container.expressive.positive.quiet.disabled'
                : 'ds.container.expressive.danger.quiet.disabled',
        }}>
        <Icon name={isSupported ? 'FeedbackSuccessOutlined' : 'FeedbackFailOutlined'} color={disabled
            ? 'ds.text.oddity.disabled'
            : isSupported
                ? 'ds.text.positive.quiet'
                : 'ds.text.danger.quiet'}/>
      </div>
      <FlexContainer flexDirection="column" gap="4px">
        <Paragraph textStyle="ds.body.standard.regular" color={disabled ? 'ds.text.oddity.disabled' : 'ds.text.neutral.catchy'}>
          {translate(title)}
        </Paragraph>
        {description ? (<Paragraph textStyle="ds.body.helper.regular" color={disabled ? 'ds.text.oddity.disabled' : 'ds.text.neutral.quiet'}>
            {translate(description)}
          </Paragraph>) : null}
      </FlexContainer>
    </FlexContainer>);
};
export const FeatureCard = ({ title, redirectUrl, optionNumber, supportedFeatures, onCtaClick, disabled = false, selected = false, isBetaFeature = false, }: FeatureCardProps) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const match = useRouteMatch();
    const url = `${match.path}/${redirectUrl}`;
    const onSetupClick = () => {
        onCtaClick?.();
        history.push(url);
    };
    return (<Card sx={{
            padding: '24px',
            borderColor: selected
                ? 'ds.border.brand.standard.idle'
                : 'ds.border.neutral.quiet.idle',
            width: '100%',
        }}>
      <GridContainer gridTemplateAreas="'option badge' 'title title' 'body body' 'button button'">
        <GridChild gridArea="option" sx={{ marginBottom: '8px' }}>
          <Paragraph color={disabled ? 'ds.text.oddity.disabled' : 'ds.text.neutral.quiet'} textStyle="ds.body.helper.regular">
            {`${translate(I18N_KEYS.SCIM_CARD_OPTION)} ${optionNumber}`}
          </Paragraph>
        </GridChild>
        {selected ? (<GridChild gridArea="badge" justifySelf="right">
            <Badge mood="positive" intensity="catchy" label={translate(I18N_KEYS.SCIM_CARD_BADGE_ENABLED)}/>
          </GridChild>) : null}
        <GridChild gridArea="title" sx={{ marginBottom: '32px' }}>
          <Heading as="h3" textStyle="ds.title.section.medium" color={disabled ? 'ds.text.oddity.disabled' : 'ds.text.neutral.catchy'} sx={{ display: 'inline-block' }}>
            {translate(title)}
          </Heading>
          {isBetaFeature ? (<Badge mood="brand" label={translate(I18N_KEYS.SCIM_CARD_BADGE_BETA)} sx={{ display: 'inline', marginLeft: '8px' }}/>) : null}
        </GridChild>
        <GridChild gridArea="body">
          <FlexContainer gap="32px" flexDirection="column" sx={{ marginBottom: '32px' }}>
            {supportedFeatures.map((feat) => (<FeatureCardItem key={optionNumber + feat.title} disabled={disabled} {...feat}/>))}
          </FlexContainer>
        </GridChild>
        <GridChild gridArea="button" justifySelf="right">
          <Button onClick={onSetupClick} disabled={disabled} intensity="catchy">
            {selected
            ? translate(I18N_KEYS.SCIM_CARD_BUTTON_EDIT)
            : translate(I18N_KEYS.SCIM_CARD_BUTTON_SETUP)}
          </Button>
        </GridChild>
      </GridContainer>
    </Card>);
};
