import { Button, Icon, jsx } from '@dashlane/design-system';
import { FlexContainer, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const friendsFamilyUrl = '*****';
export const FriendsAndFamilyInfo = () => {
    const { translate } = useTranslate();
    return (<FlexContainer flexWrap="nowrap" gap="16px" sx={{
            borderStyle: 'solid',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderWidth: '1px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            borderRadius: '4px',
            padding: '32px',
        }}>
      <FlexContainer sx={{
            padding: '10px 8px',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'ds.container.expressive.brand.quiet.idle',
        }}>
        <Icon name="GroupOutlined" color="ds.text.neutral.standard"/>
      </FlexContainer>
      <FlexContainer flexDirection="column" gap="16px" sx={{ flexGrow: '1' }}>
        <FlexContainer flexDirection="column" gap="8px">
          <Paragraph size="large" bold color="ds.text.neutral.catchy">
            {translate('team_account_addseats_success_friends_family_header')}
          </Paragraph>
          <Paragraph size="small" color="ds.text.neutral.quiet">
            {translate('team_account_addseats_success_friends_family_body')}
          </Paragraph>
        </FlexContainer>

        <a href={friendsFamilyUrl} target="_blank" rel="noopener noreferrer">
          <Button mood="neutral" intensity="quiet">
            {translate('team_account_addseats_success_friends_family_learn_more_cta')}
          </Button>
        </a>
      </FlexContainer>
    </FlexContainer>);
};
