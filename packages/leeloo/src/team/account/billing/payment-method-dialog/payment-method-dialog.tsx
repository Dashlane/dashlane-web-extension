import { Fragment, useState } from 'react';
import { Button, Icon } from '@dashlane/design-system';
import { Card, colors, Dialog, DialogBody, DialogTitle, Eyebrow, GridChild, GridContainer, jsx, LoadingIcon, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Mode, PaymentLoading } from 'libs/billing/PaymentLoading';
import { openUrl } from 'libs/external-urls';
import { DASHLANE_SUPPORT_ADD_SEATS } from 'team/urls';
import { PaymentMethodCard } from 'webapp/subscription-management/payment-method/payment-method-card';
import { useCreditCardPaymentMethodDisplay } from 'team/account/upgrade-success/useCreditCardPaymentDisplay';
interface CardRowProps {
    cardTitle: string;
    cardDescription: string;
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
export const getCardData = (hasCreditCard: boolean | undefined): CardRowProps => {
    if (hasCreditCard) {
        return {
            cardTitle: 'team_payment_method_dialog_another_credit_card',
            cardDescription: 'team_payment_method_dialog_replace_credit_card',
        };
    }
    else {
        return {
            cardTitle: 'team_payment_method_dialog_credit_card',
            cardDescription: 'team_payment_method_dialog_secondary_payment',
        };
    }
};
const CardRow = ({ cardTitle, cardDescription }: CardRowProps) => {
    return (<>
      <GridChild sx={gridChildStyles}>
        <Icon name="ItemPaymentOutlined" size="large" color="ds.text.brand.standard"/>
      </GridChild>
      <GridChild>
        <Paragraph color="ds.text.neutral.standard" bold>
          {cardTitle}
        </Paragraph>
        <Paragraph color="ds.text.neutral.quiet" size="small" sx={{ marginTop: '4px' }}>
          {cardDescription}
        </Paragraph>
      </GridChild>
    </>);
};
interface Props {
    handleClose: () => void;
    openUpgradeDialog: () => void;
}
export const PaymentMethodDialog = ({ handleClose, openUpgradeDialog, }: Props) => {
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [updatePaymentLoading, setUpdatePaymentLoading] = useState(false);
    const { translate } = useTranslate();
    const { loading, hasCreditCardPaymentMethod, isExpired, pollUntilCardUpdate, } = useCreditCardPaymentMethodDisplay({
        handleCardUpdate: openUpgradeDialog,
    });
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const cardData = getCardData(hasCreditCardPaymentMethod);
    const paymentMode = hasCreditCardPaymentMethod ? Mode.REPLACE : Mode.ADD;
    return (<Dialog isOpen={true} closeIconName={translate('_common_dialog_dismiss_button')} onClose={handleClose} ariaDescribedby="dialogContent">
      <Eyebrow color="ds.text.neutral.quiet" sx={{ marginBottom: '16px' }}>
        {translate('team_payment_method_dialog_buy_seats')}
      </Eyebrow>
      <DialogTitle title={translate('team_payment_method_dialog_title')}/>
      <DialogBody>
        {hasCreditCardPaymentMethod && (<Card sx={cardStyles} onClick={() => {
                if (isExpired) {
                    pollUntilCardUpdate();
                    setUpdatePaymentLoading(true);
                }
                else {
                    openUpgradeDialog();
                }
            }}>
            <GridContainer gap="12px" gridTemplateColumns="1fr 60px" sx={{ width: '100%', padding: '0 16px' }}>
              <GridChild>
                <PaymentMethodCard b2b hideTitle hideUpdateButton displayModifiedCreditCardView/>
              </GridChild>
              <GridChild sx={{
                margin: 'auto',
            }}>
                {isExpired ? (<Button mood="brand" intensity="supershy" size="large">
                    {updatePaymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setUpdatePaymentLoading} mode={Mode.UPDATE}/>) : (<Icon name="ArrowRightOutlined" size="medium" color="ds.text.neutral.standard"/>)}
                  </Button>) : (<Button mood="brand" intensity="supershy" size="large" layout="iconOnly" icon={<Icon name="ArrowRightOutlined" size="medium" color="ds.text.neutral.standard"/>}/>)}
              </GridChild>
            </GridContainer>
          </Card>)}
        <Card sx={cardStyles} onClick={() => {
            pollUntilCardUpdate();
            setPaymentLoading(true);
        }}>
          <GridContainer gap="12px" gridTemplateColumns="40px 1fr 60px" sx={gridContainerStyles}>
            <CardRow cardTitle={translate(cardData.cardTitle)} cardDescription={translate(cardData.cardDescription)}/>
            <GridChild sx={{
            margin: 'auto',
        }}>
              <Button mood="brand" intensity="supershy" size="large">
                {paymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading} mode={paymentMode}/>) : (<Icon name="ArrowRightOutlined" size="medium" color="ds.text.neutral.standard"/>)}
              </Button>
            </GridChild>
          </GridContainer>
        </Card>
        <Card sx={cardStyles} onClick={() => {
            openUrl(DASHLANE_SUPPORT_ADD_SEATS);
        }}>
          <GridContainer gap="12px" gridTemplateColumns="40px 1fr 60px" sx={gridContainerStyles}>
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
    </Dialog>);
};
