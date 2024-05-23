import { Fragment, useState } from 'react';
import { Button, Icon, Infobox, jsx } from '@dashlane/design-system';
import { colors, FlexChild, FlexContainer, InfoCircleIcon, LoadingIcon, Paragraph, ThemeUIStyleObject, Tooltip, } from '@dashlane/ui-components';
import { SpinnerInput } from 'libs/dashlane-style/spinner-input/spinner-input';
import useTranslate from 'libs/i18n/useTranslate';
import { LocaleFormat } from 'libs/i18n/helpers';
import { Mode, PaymentLoading } from 'libs/billing/PaymentLoading';
import { BillingDetails } from 'team/account/upgrade';
import { ComputedPrice } from 'team/account/upgrade/add-seats/computed-price';
import { useCreditCardPaymentMethodDisplay } from 'team/account/upgrade-success/useCreditCardPaymentDisplay';
import { HorizontalRule } from 'team/change-plan/components/HorizontalRule';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
import { PaymentMethodCard } from 'webapp/subscription-management/payment-method/payment-method-card';
import { CostDetailsForTier } from './teamPlanCalculator';
import { useBillingSeatDetails } from './useBillingSeatDetails';
import styles from './styles.css';
const I18N_KEYS = {
    NUMBER_OF_SEATS: 'team_account_teamplan_upgrade_premium_number_of_seats',
    NEW_SEAT: 'team_account_teamplan_upgrade_new_seat',
    TAX: 'team_account_teamplan_upgrade_tax',
    PRORATED_DISCOUNT: 'team_account_teamplan_changeplan_order_summary_prorated_discount',
    PRORATED_DISCOUNT_TOOLTIP: 'team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip',
    RENEWAL_PRICE: 'team_account_teamplan_upgrade_renewal_price',
    RENEWAL_TAX_PRICE: 'team_account_teamplan_upgrade_renewal_tax_price',
    RENEWAL_VAT_PRICE: 'team_account_teamplan_upgrade_renewal_vat_price',
    INVOICE_RENEWAL_PRICE: 'team_account_teamplan_upgrade_invoice_renewal_price',
    PAY_TODAY: 'team_account_teamplan_upgrade_due_now',
    VAT: 'team_account_teamplan_vat',
};
const flexContainerStyles: ThemeUIStyleObject = {
    display: 'flex',
    margin: '24px 0',
    color: 'ds.text.neutral.standard',
};
interface RowProps {
    label?: React.ReactNode;
    labelSx?: ThemeUIStyleObject;
    value?: React.ReactNode;
}
const Row = ({ label, labelSx, value }: RowProps) => {
    return (<FlexContainer sx={flexContainerStyles}>
      {label ? (<FlexChild flex="1" sx={{ ...labelSx }}>
          {label}
        </FlexChild>) : null}
      {value ? <FlexChild flex="0">{value}</FlexChild> : null}
    </FlexContainer>);
};
export interface Props {
    nextBillingDate: Date;
    billingDetails: BillingDetails;
    dueNowTranslation: string;
    seatCountLabel: string;
    totalSeatCount: number;
    onAdditionalSeatCountChange: (seats: number) => void;
    isComputingBilling: boolean;
    additionalSeatsDetails: CostDetailsForTier[];
    planType: string | undefined;
}
export const AddSeatsDialogBody = ({ nextBillingDate, billingDetails, dueNowTranslation, seatCountLabel, totalSeatCount, onAdditionalSeatCountChange, isComputingBilling, additionalSeatsDetails, planType, }: Props) => {
    const { translate } = useTranslate();
    const { additionalSeatsCount, additionalSeatsTaxesTranslation, hasTax, renewalTotalPrice, tierPriceTranslation, proratedDiscountTranslation, hasProratedDiscount, } = useBillingSeatDetails({
        billingDetails,
        additionalSeatsDetails,
    });
    const { pollUntilCardUpdate } = useCreditCardPaymentMethodDisplay({});
    const { loading, billingCountry } = useBillingCountry();
    const [paymentLoading, setPaymentLoading] = useState(false);
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const hasInvoicePlanType = planType === 'invoice';
    const taxCopy = billingCountry === 'US' ? I18N_KEYS.TAX : I18N_KEYS.VAT;
    const renewalTaxCopy = billingCountry === 'US'
        ? I18N_KEYS.RENEWAL_TAX_PRICE
        : I18N_KEYS.RENEWAL_VAT_PRICE;
    const renewalCopy = hasTax ? renewalTaxCopy : I18N_KEYS.RENEWAL_PRICE;
    const renewalPrice = hasInvoicePlanType
        ? I18N_KEYS.INVOICE_RENEWAL_PRICE
        : renewalCopy;
    return (<>
      <FlexContainer sx={{
            padding: '28px 0',
            fontSize: 4,
            fontWeight: 'bold',
            color: 'ds.text.neutral.catchy',
        }}>
        <SpinnerInput inputWidth="66px" label={seatCountLabel} id="numberOfSeats" defaultValue={1} minValue={1} onChange={onAdditionalSeatCountChange}/>
      </FlexContainer>

      <HorizontalRule />

      <Row label={translate(I18N_KEYS.NUMBER_OF_SEATS)} value={totalSeatCount}/>

      <Row label={translate(I18N_KEYS.NEW_SEAT, {
            count: additionalSeatsCount,
        })} value={tierPriceTranslation}/>

      {hasTax && (<Row label={translate(taxCopy)} value={additionalSeatsTaxesTranslation}/>)}

      {hasProratedDiscount && (<Row label={<>
              <Paragraph>{translate(I18N_KEYS.PRORATED_DISCOUNT)}</Paragraph>

              <Tooltip content={translate(I18N_KEYS.PRORATED_DISCOUNT_TOOLTIP)}>
                <InfoCircleIcon size={16} color={colors.grey00}/>
              </Tooltip>
            </>} labelSx={{ display: 'flex', alignItems: 'center' }} value={proratedDiscountTranslation}/>)}

      <>
        <HorizontalRule />

        <Paragraph sx={{ marginTop: '24px', fontSize: '18px' }}>
          {translate('team_payment_method_dialog_credit_card')}
        </Paragraph>

        <FlexContainer sx={{
            ...flexContainerStyles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderRadius: '4px',
        }}>
          <FlexChild flex="1" sx={{ paddingLeft: '16px' }}>
            <PaymentMethodCard b2b hideTitle hideUpdateButton displayModifiedCreditCardView/>
          </FlexChild>
          <FlexChild flex="0" sx={{ margin: 'auto 0', paddingRight: '12px' }}>
            <Button icon={<Icon name="ActionEditOutlined"/>} layout="iconLeading" intensity="supershy" onClick={() => {
            pollUntilCardUpdate();
            setPaymentLoading(true);
        }}>
              {paymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading} mode={Mode.UPDATE}/>) : (translate('team_account_name_edit_label'))}
            </Button>
          </FlexChild>
        </FlexContainer>
      </>

      <FlexContainer sx={flexContainerStyles}>
        <Infobox title={translate(renewalPrice, {
            totalPrice: renewalTotalPrice,
            totalSeat: totalSeatCount,
            date: translate.shortDate(nextBillingDate, LocaleFormat.LL),
        })}/>
      </FlexContainer>

      <HorizontalRule />

      <FlexContainer sx={{ display: 'flex', marginTop: '24px', fontSize: 4 }}>
        <FlexChild flex="1">{translate(I18N_KEYS.PAY_TODAY)}</FlexChild>
        <ComputedPrice isComputing={isComputingBilling} price={dueNowTranslation} className={styles.totalAmount}/>
      </FlexContainer>
    </>);
};
