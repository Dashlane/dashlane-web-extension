import React from 'react';
import { format as dateFormatter, isValid, parse } from 'date-fns';
import { PaymentCard, PaymentCardColorType } from '@dashlane/vault-contracts';
import { Field, ItemType, UserCopyVaultItemFieldEvent, UserRevealVaultItemFieldEvent, } from '@dashlane/hermes';
import { Button, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import DetailField from 'libs/dashlane-style/detail-field';
import DetailSelect from 'libs/dashlane-style/select-field/detail';
import { DateFieldSelect } from 'libs/dashlane-style/date-field/select';
import { ButtonsOnHover } from 'libs/dashlane-style/buttons-on-hover';
import { LocaleFormat } from 'libs/i18n/helpers';
import { logEvent } from 'libs/logs/logEvent';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { CopyToClipboardButton } from 'webapp/credentials/edit/copy-to-clipboard-control';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
import styles from './payment-card-form.css';
const I18N_KEYS = {
    FIELD_OWNERNAME: 'webapp_payment_edition_field_ownerName',
    FIELD_PLACEHOLDER_NO_OWNERNAME: 'webapp_payment_edition_field_placeholder_no_ownerName',
    FIELD_CARDNUMBER: 'webapp_payment_edition_field_cardNumber',
    FIELD_PLACEHOLDER_NO_CARDNUMBER: 'webapp_payment_edition_field_placeholder_no_cardNumber',
    FIELD_SECURITYCODE: 'webapp_payment_edition_field_securityCode',
    FIELD_PLACEHOLDER_NO_SECURITYCODE: 'webapp_payment_edition_field_placeholder_no_securityCode',
    FIELD_CARD_ACTION_HIDE: 'webapp_payment_edition_field_card_action_hide',
    FIELD_CARD_ACTION_SHOW: 'webapp_payment_edition_field_card_action_show',
    FIELD_EXPIREDATE: 'webapp_payment_edition_field_expireDate',
    FIELD_CARDNAME: 'webapp_payment_edition_field_cardname',
    FIELD_PLACEHOLDER_NO_CARDNAME: 'webapp_payment_edition_field_placeholder_no_cardname',
    FIELD_CARDCOLOR_LABEL: 'webapp_payment_edition_field_cardColor',
    FIELD_CARDCOLOR: 'webapp_payment_edition_field_cardColor_',
    FIELD_NOTES: 'webapp_payment_edition_field_notes',
    FIELD_PLACEHOLDER_NO_NOTES: 'webapp_payment_edition_field_placeholder_no_notes',
    FIELD_CARDNUMBER_COPIED: 'webapp_payment_edition_field_cardNumber_copied',
    FIELD_SECURITYCODE_COPIED: 'webapp_payment_edition_field_securityCode_copied',
    FIELD_NOTE_COPIED: 'webapp_payment_edition_field_notes_copied'
};
const EXPIRY_FIELD_FORMAT = 'yyyy-MM';
type PaymentCardField = Field.CardNumber | Field.SecurityCode | Field.Note;
export type PaymentCardFormFields = Pick<PaymentCard, 'cardNumber' | 'color' | 'expireMonth' | 'expireYear' | 'itemName' | 'note' | 'ownerName' | 'securityCode' | 'spaceId'>;
interface PaymentCardFormProps {
    itemId?: string;
    errors?: Set<keyof PaymentCardFormFields>;
    paymentCardContent: PaymentCardFormFields;
    signalEditedValues: (newPaymentCardContent: PaymentCardFormFields) => void;
    showCopyAlert?: (text: string) => void;
}
const copyLogEvent = (field: PaymentCardField) => (itemId: string | undefined) => {
    if (itemId) {
        logEvent(new UserCopyVaultItemFieldEvent({
            itemType: ItemType.CreditCard,
            field,
            itemId,
            isProtected: true,
        }));
    }
};
const PaymentCardColorTypeToKeyDictionary: Record<PaymentCardColorType, string> = {
    [PaymentCardColorType.Black]: `${I18N_KEYS.FIELD_CARDCOLOR}BLACK`,
    [PaymentCardColorType.Blue1]: `${I18N_KEYS.FIELD_CARDCOLOR}BLUE_1`,
    [PaymentCardColorType.Blue2]: `${I18N_KEYS.FIELD_CARDCOLOR}BLUE_2`,
    [PaymentCardColorType.Gold]: `${I18N_KEYS.FIELD_CARDCOLOR}GOLD`,
    [PaymentCardColorType.Green1]: `${I18N_KEYS.FIELD_CARDCOLOR}GREEN_1`,
    [PaymentCardColorType.Green2]: `${I18N_KEYS.FIELD_CARDCOLOR}GREEN_2`,
    [PaymentCardColorType.Orange]: `${I18N_KEYS.FIELD_CARDCOLOR}ORANGE`,
    [PaymentCardColorType.Red]: `${I18N_KEYS.FIELD_CARDCOLOR}RED`,
    [PaymentCardColorType.Silver]: `${I18N_KEYS.FIELD_CARDCOLOR}SILVER`,
    [PaymentCardColorType.White]: `${I18N_KEYS.FIELD_CARDCOLOR}WHITE`,
};
export const PaymentCardForm = ({ itemId, errors, paymentCardContent, signalEditedValues, showCopyAlert, }: PaymentCardFormProps) => {
    const { cardNumber, color, expireMonth, expireYear, itemName, note, ownerName, securityCode, spaceId, } = paymentCardContent;
    const { translate } = useTranslate();
    const { shouldShowTrialDiscontinuedDialog: isDisabled } = useTrialDiscontinuedDialogContext();
    const hasCardNumber = Boolean(cardNumber.length);
    const hasSecurityCode = Boolean(securityCode.length);
    const hasNote = Boolean(note.length);
    const handleContentChanged = (field: keyof PaymentCard) => (eventOrValue: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => {
        const updatedValue = typeof eventOrValue === 'string'
            ? eventOrValue
            : eventOrValue.target.value;
        const value = field === 'cardNumber'
            ? updatedValue.replaceAll(' ', '')
            : updatedValue;
        signalEditedValues({
            ...paymentCardContent,
            [field]: value,
        });
    };
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const [shouldShowCardNumber, setShouldShowCardNumber] = React.useState(!hasCardNumber);
    const logRevealPaymentCardField = React.useCallback((field: PaymentCardField) => {
        if (itemId) {
            logEvent(new UserRevealVaultItemFieldEvent({
                field,
                isProtected: true,
                itemId: itemId,
                itemType: ItemType.CreditCard,
            }));
        }
    }, [itemId]);
    const toggleShowCardNumber = React.useCallback(() => {
        if (!shouldShowCardNumber) {
            logRevealPaymentCardField(Field.CardNumber);
        }
        setShouldShowCardNumber((oldValue) => !oldValue);
    }, [shouldShowCardNumber, logRevealPaymentCardField]);
    const handleToggleShowCardNumber = React.useCallback(() => {
        if (shouldShowCardNumber) {
            toggleShowCardNumber();
            return;
        }
        if (!areProtectedItemsUnlocked) {
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.CreditCard,
                successCallback: () => toggleShowCardNumber(),
            });
            return;
        }
        toggleShowCardNumber();
    }, [
        areProtectedItemsUnlocked,
        openProtectedItemsUnlocker,
        shouldShowCardNumber,
        toggleShowCardNumber,
    ]);
    const isItemLocked = !areProtectedItemsUnlocked;
    const handleCopyField = (copyEvent: (item?: string) => void, i18nKey: string) => {
        copyEvent(itemId);
        if (showCopyAlert) {
            showCopyAlert(translate(i18nKey));
        }
    };
    const [shouldShowSecurityCode, setShouldShowSecurityCode] = React.useState(securityCode === '');
    const [shouldDisplayNote, setShouldDisplayNote] = React.useState(note === '');
    const toggleShowSecurityCode = React.useCallback(() => {
        if (!shouldShowSecurityCode) {
            logRevealPaymentCardField(Field.SecurityCode);
        }
        setShouldShowSecurityCode((oldValue) => !oldValue);
    }, [shouldShowSecurityCode, logRevealPaymentCardField]);
    const toggleNote = () => setShouldDisplayNote((oldValue) => !oldValue);
    const handleToggleShowSecurityCode = React.useCallback(() => {
        if (shouldShowSecurityCode) {
            toggleShowSecurityCode();
            return;
        }
        if (!areProtectedItemsUnlocked) {
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.CreditCard,
                successCallback: () => toggleShowSecurityCode(),
            });
            return;
        }
        toggleShowSecurityCode();
    }, [
        areProtectedItemsUnlocked,
        openProtectedItemsUnlocker,
        shouldShowSecurityCode,
        toggleShowSecurityCode,
    ]);
    const handleToggleShowNote = React.useCallback(() => {
        if (shouldDisplayNote) {
            toggleNote();
            return;
        }
        if (!areProtectedItemsUnlocked) {
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.CreditCard,
                successCallback: () => toggleNote(),
            });
            return;
        }
        toggleNote();
    }, [
        areProtectedItemsUnlocked,
        openProtectedItemsUnlocker,
        shouldShowSecurityCode,
        toggleShowSecurityCode,
    ]);
    const handleChangeExpiryDate = (newDate: string) => {
        const date = parse(newDate, EXPIRY_FIELD_FORMAT, new Date());
        signalEditedValues({
            ...paymentCardContent,
            expireMonth: isValid(date) ? dateFormatter(date, 'MM') : '',
            expireYear: isValid(date) ? dateFormatter(date, 'yyyy') : '',
        });
    };
    const colorOptions = Object.values(PaymentCardColorType).map((colorOption) => {
        return {
            label: translate(PaymentCardColorTypeToKeyDictionary[colorOption]),
            value: colorOption,
        };
    });
    const displayedCardNumber = shouldShowCardNumber
        ? cardNumber
        : '●●●● ●●●● ●●●● ●●●●';
    const cardNumberFieldValue = hasCardNumber ? displayedCardNumber : '';
    const cardNumberMaskFormat = /^3[47]/.test(cardNumber)
        ? '9999 999999 999999'
        : '9999 9999 9999 99999';
    const cardNumberMask = shouldShowCardNumber
        ? cardNumberMaskFormat
        : undefined;
    const expirationDate = expireYear && expireMonth ? `${expireYear}-${expireMonth}` : '';
    return (<React.Fragment>
      <DetailField key="ownerName" value={ownerName} label={translate(I18N_KEYS.FIELD_OWNERNAME)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_OWNERNAME)} onChange={handleContentChanged('ownerName')} disabled={!!isDisabled}/>

      <ButtonsOnHover enabled={hasCardNumber}>
        <DetailField key={`cardNumber${shouldShowCardNumber}`} label={translate(I18N_KEYS.FIELD_CARDNUMBER)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_CARDNUMBER)} dataName="cardNumber" disabled={(!shouldShowCardNumber && hasCardNumber) || !!isDisabled} type="text" value={cardNumberFieldValue} mask={cardNumberMask} onChange={handleContentChanged('cardNumber')} error={errors?.has('cardNumber')}/>
        <Button mood="neutral" intensity="quiet" sx={{ marginRight: '16px' }} onClick={handleToggleShowCardNumber}>
          {shouldShowCardNumber
            ? translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE)
            : translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW)}
        </Button>
        <CopyToClipboardButton data={cardNumber} checkProtected={() => isItemLocked} onCopy={() => handleCopyField(copyLogEvent(Field.CardNumber), I18N_KEYS.FIELD_CARDNUMBER_COPIED)} itemType={LockedItemType.CreditCard}/>
      </ButtonsOnHover>

      <ButtonsOnHover enabled={hasSecurityCode}>
        <DetailField key={`securityCode${shouldShowSecurityCode}`} disabled={(!shouldShowSecurityCode && hasSecurityCode) || !!isDisabled} value={shouldShowSecurityCode ? securityCode : '●●●'} label={translate(I18N_KEYS.FIELD_SECURITYCODE)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_SECURITYCODE)} type="text" onChange={handleContentChanged('securityCode')} error={errors?.has('securityCode')}/>
        <Button mood="neutral" intensity="quiet" sx={{ marginRight: '16px' }} onClick={handleToggleShowSecurityCode}>
          {shouldShowSecurityCode
            ? translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE)
            : translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW)}
        </Button>
        <CopyToClipboardButton data={securityCode} checkProtected={() => isItemLocked} onCopy={() => handleCopyField(copyLogEvent(Field.SecurityCode), I18N_KEYS.FIELD_SECURITYCODE_COPIED)} itemType={LockedItemType.CreditCard}/>
      </ButtonsOnHover>

      <DateFieldSelect value={expirationDate} dateFormat={EXPIRY_FIELD_FORMAT} yearsRange={[0, 30]} label={translate(I18N_KEYS.FIELD_EXPIREDATE)} monthLabelFormatter={(value) => translate.shortDate(value, LocaleFormat.MM)} onChange={handleChangeExpiryDate} hideDay allowEmpty={true} disabled={!!isDisabled}/>

      <hr className={styles.separator}/>

      <DetailField key="cardname" value={itemName} label={translate(I18N_KEYS.FIELD_CARDNAME)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_CARDNAME)} onChange={handleContentChanged('itemName')} disabled={!!isDisabled}/>

      <DetailSelect key={`cardColor${color}`} label={translate(I18N_KEYS.FIELD_CARDCOLOR_LABEL)} placeholder={translate(PaymentCardColorTypeToKeyDictionary[color])} options={colorOptions} defaultOption={{
            label: translate(PaymentCardColorTypeToKeyDictionary[color]),
            value: color,
        }} onChange={handleContentChanged('color')} disabled={!!isDisabled}/>

      <SpaceSelect spaceId={spaceId ?? ''} labelSx={spaceSelectFormLabelSx} onChange={(newSpaceId) => handleContentChanged('spaceId')(newSpaceId)} disabled={!!isDisabled}/>

      <ButtonsOnHover enabled={hasNote}>
        <DetailField label={translate(I18N_KEYS.FIELD_NOTES)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_NOTES)} dataName="note" disabled={(!shouldDisplayNote && hasNote) || !!isDisabled} value={shouldDisplayNote || !hasNote ? note : '●●●●'} onChange={handleContentChanged('note')} multiLine={true} testId="credential_edit_note_value"/>
        <Button mood="neutral" intensity="quiet" sx={{ marginRight: '16px' }} onClick={handleToggleShowNote}>
          {shouldDisplayNote
            ? translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE)
            : translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW)}
        </Button>
        <CopyToClipboardButton data={note} checkProtected={() => isItemLocked} onCopy={() => handleCopyField(copyLogEvent(Field.Note), I18N_KEYS.FIELD_NOTE_COPIED)} itemType={LockedItemType.CreditCard}/>
      </ButtonsOnHover>
    </React.Fragment>);
};
