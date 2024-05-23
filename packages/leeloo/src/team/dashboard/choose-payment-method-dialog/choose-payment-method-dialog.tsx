import { Dispatch, SetStateAction } from 'react';
import { SpaceTier } from '@dashlane/communication';
import { Button, Icon } from '@dashlane/design-system';
import { Card, Dialog, DialogBody, DialogTitle, FlexContainer, GridChild, GridContainer, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { BUSINESS_BUY } from 'team/urls';
import { DiscontinuationModalState } from '../dashboard';
interface Props {
    isOpen: boolean;
    plan: SpaceTier | null | undefined;
    setModalState: Dispatch<SetStateAction<DiscontinuationModalState>>;
}
const cardStyles: ThemeUIStyleObject = {
    marginTop: '16px',
    '&:hover': {
        cursor: 'pointer',
        borderWidth: '2px',
        borderColor: 'ds.border.brand.standard.hover',
    },
};
const gridContainerStyles: ThemeUIStyleObject = {
    width: '100%',
    padding: '20px 16px',
};
const gridChildStyles: ThemeUIStyleObject = {
    padding: '8px',
    backgroundColor: 'ds.container.expressive.brand.quiet.idle',
    borderRadius: '8px',
    margin: 'auto',
};
const contactSupportUrl = '*****';
export const ChoosePaymentMethodDialog = ({ isOpen, plan, setModalState, }: Props) => {
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    return (<Dialog isOpen={isOpen} ariaDescribedby="dialogContent" onClose={() => { }}>
      <DialogTitle title={translate('team_payment_method_dialog_title')}/>
      <DialogBody>
        <Card sx={cardStyles} onClick={() => {
            const url = `${BUSINESS_BUY}?plan=${plan}&subCode=${accountInfo?.subscriptionCode}`;
            openUrl(url);
        }}>
          <GridContainer gap="12px" gridTemplateColumns="40px 480px 60px" sx={gridContainerStyles}>
            <GridChild sx={gridChildStyles}>
              <Icon name="ItemPaymentOutlined" size="large" color="ds.text.brand.standard"/>
            </GridChild>
            <GridChild sx={{ margin: 'auto 0' }}>
              <Paragraph color="ds.text.neutral.standard" bold>
                {translate('team_payment_method_dialog_credit_card')}
              </Paragraph>
            </GridChild>
            <GridChild sx={{
            margin: 'auto',
        }}>
              <Button mood="brand" intensity="supershy" size="large">
                <Icon name="ArrowRightOutlined" size="medium" color="ds.text.neutral.standard"/>
              </Button>
            </GridChild>
          </GridContainer>
        </Card>
        <Card sx={cardStyles} onClick={() => {
            openUrl(contactSupportUrl);
        }}>
          <GridContainer gap="12px" gridTemplateColumns="40px 480px 60px" sx={gridContainerStyles}>
            <GridChild sx={gridChildStyles}>
              <Icon name="ItemTaxNumberOutlined" size="large" color="ds.text.brand.standard"/>
            </GridChild>
            <GridChild>
              <Paragraph color="ds.text.neutral.standard" bold>
                {translate('team_account_invoice_payment')}
              </Paragraph>
              <Paragraph color="ds.text.neutral.quiet" size="small" sx={{ marginTop: '4px' }}>
                {translate('team_payment_method_dialog_support_team')}
              </Paragraph>
            </GridChild>
            <GridChild sx={{
            margin: 'auto',
        }}>
              <Button mood="brand" intensity="supershy" size="large" layout="iconOnly" icon={<Icon name="ArrowRightOutlined" size="medium" color="ds.text.neutral.standard"/>}/>
            </GridChild>
          </GridContainer>
        </Card>
      </DialogBody>
      <FlexContainer sx={{
            justifyContent: 'flex-end',
        }}>
        <Button intensity="quiet" mood="neutral" onClick={() => {
            setModalState(DiscontinuationModalState.PURCHASE);
        }}>
          {translate('_common_action_back')}
        </Button>
      </FlexContainer>
    </Dialog>);
};
