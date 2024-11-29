import { useState } from "react";
import {
  Button,
  Dialog,
  Icon,
  IndeterminateLoader,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { Card, GridChild, GridContainer } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Mode, PaymentLoading } from "../../../../libs/billing/PaymentLoading";
import { openUrl } from "../../../../libs/external-urls";
import { PaymentMethodCard } from "../../../../webapp/subscription-management/payment-method/payment-method-card";
import { DASHLANE_SUPPORT_ADD_SEATS } from "../../../urls";
import { useCreditCardPaymentMethodDisplay } from "../../upgrade-success/useCreditCardPaymentDisplay";
import { CardTitleAndDescription } from "./card-title-and-description";
const I18N_KEYS = {
  ANOTHER_CREDIT_CARD: "team_payment_method_dialog_another_credit_card",
  DIALOG_TITLE: "team_payment_method_dialog_buy_seats",
  CREDIT_CARD: "team_payment_method_dialog_credit_card",
  DIALOG_DESCRIPTION: "team_payment_method_dialog_title",
  DISMISS: "_common_dialog_dismiss_button",
  INVOICE_PAYMENT: "team_account_invoice_payment",
  REPLACE_CREDIT_CARD: "team_payment_method_dialog_replace_credit_card",
  SECONDARY_PAYMENT: "team_payment_method_dialog_secondary_payment",
  SUPPORT_TEAM: "team_payment_method_dialog_support_team",
};
const cardStyles: ThemeUIStyleObject = {
  marginTop: "16px",
  "&:hover": {
    cursor: "pointer",
    borderWidth: "2px",
    borderColor: "ds.border.brand.standard.hover",
  },
};
const gridContainerStyles: ThemeUIStyleObject = {
  width: "100%",
  padding: "20px 16px",
};
interface Props {
  handleClose: () => void;
  openUpgradeDialog: () => void;
}
export const ChoosePaymentMethodDialog = ({
  handleClose,
  openUpgradeDialog,
}: Props) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [updatePaymentLoading, setUpdatePaymentLoading] = useState(false);
  const { translate } = useTranslate();
  const {
    loading,
    hasCreditCardPaymentMethod,
    isExpired,
    pollUntilCardUpdate,
  } = useCreditCardPaymentMethodDisplay({
    handleCardUpdate: openUpgradeDialog,
  });
  const paymentMode = hasCreditCardPaymentMethod ? Mode.REPLACE : Mode.ADD;
  const ArrowButton = (
    <Button
      intensity="supershy"
      size="large"
      layout="iconOnly"
      icon={<Icon name="ArrowRightOutlined" color="ds.text.neutral.standard" />}
    />
  );
  const onClickChooseCurrentCreditCard = () => {
    if (isExpired) {
      pollUntilCardUpdate();
      setUpdatePaymentLoading(true);
    } else {
      openUpgradeDialog();
    }
  };
  const onClickChooseNewCreditCard = () => {
    pollUntilCardUpdate();
    setPaymentLoading(true);
  };
  const onClickChooseInvoiceMethod = () => openUrl(DASHLANE_SUPPORT_ADD_SEATS);
  if (loading) {
    return <IndeterminateLoader />;
  }
  return (
    <Dialog
      isOpen={true}
      closeActionLabel={translate(I18N_KEYS.DISMISS)}
      onClose={handleClose}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      aria-describedby="dialogContent"
    >
      <Paragraph>{translate(I18N_KEYS.DIALOG_DESCRIPTION)}</Paragraph>
      {hasCreditCardPaymentMethod ? (
        <Card sx={cardStyles} onClick={onClickChooseCurrentCreditCard}>
          <GridContainer
            gap="12px"
            gridTemplateColumns="1fr 60px"
            alignItems="center"
            sx={gridContainerStyles}
          >
            <GridChild>
              <PaymentMethodCard b2b hideTitle hideUpdateButton />
            </GridChild>
            <GridChild sx={{ margin: "auto" }}>
              {isExpired && updatePaymentLoading ? (
                <Button intensity="supershy" size="large">
                  <PaymentLoading
                    b2c={false}
                    setPaymentLoading={setUpdatePaymentLoading}
                    mode={Mode.UPDATE}
                  />
                </Button>
              ) : (
                ArrowButton
              )}
            </GridChild>
          </GridContainer>
        </Card>
      ) : null}
      <Card sx={cardStyles} onClick={onClickChooseNewCreditCard}>
        <GridContainer
          gap="12px"
          gridTemplateColumns="40px 1fr 60px"
          sx={gridContainerStyles}
        >
          <CardTitleAndDescription
            cardTitle={
              hasCreditCardPaymentMethod
                ? translate(I18N_KEYS.ANOTHER_CREDIT_CARD)
                : translate(I18N_KEYS.CREDIT_CARD)
            }
            cardDescription={
              hasCreditCardPaymentMethod
                ? translate(I18N_KEYS.REPLACE_CREDIT_CARD)
                : translate(I18N_KEYS.SECONDARY_PAYMENT)
            }
            iconName="ItemPaymentOutlined"
          />
          <GridChild sx={{ margin: "auto" }}>
            {paymentLoading ? (
              <Button intensity="supershy" size="large">
                <PaymentLoading
                  b2c={false}
                  setPaymentLoading={setPaymentLoading}
                  mode={paymentMode}
                />
              </Button>
            ) : (
              ArrowButton
            )}
          </GridChild>
        </GridContainer>
      </Card>
      <Card sx={cardStyles} onClick={onClickChooseInvoiceMethod}>
        <GridContainer
          gap="12px"
          gridTemplateColumns="40px 1fr 60px"
          sx={gridContainerStyles}
        >
          <CardTitleAndDescription
            cardTitle={translate(I18N_KEYS.INVOICE_PAYMENT)}
            cardDescription={translate(I18N_KEYS.SUPPORT_TEAM)}
            iconName="ItemTaxNumberOutlined"
          />
          <GridChild sx={{ margin: "auto" }}>{ArrowButton}</GridChild>
        </GridContainer>
      </Card>
    </Dialog>
  );
};
