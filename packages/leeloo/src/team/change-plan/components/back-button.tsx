import { Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { FlexChild, FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
const I18N_KEYS = {
    BACK: 'team_account_teamplan_changeplan_back',
    ERROR_GENERIC: 'team_account_teamplan_changeplan_error_generic',
};
export const BackButton = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    return (<FlexChild>
      <Button mood="neutral" intensity="supershy" onClick={() => redirect(routes.teamAccountRoutePath)}>
        <FlexContainer alignItems="center">
          <Icon size="medium" name="ArrowLeftOutlined"/>
          <Paragraph color="ds.text.neutral.standard" textStyle="ds.title.block.medium" sx={{ marginLeft: '14px' }}>
            {translate(I18N_KEYS.BACK)}
          </Paragraph>
        </FlexContainer>
      </Button>
    </FlexChild>);
};
