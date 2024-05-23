import { colors, FlexContainer, jsx } from '@dashlane/ui-components';
import { PaymentCardColorType } from '@dashlane/vault-contracts';
import { getBackgroundColorForPaymentCard } from './getBackgroundColorForPaymentCard';
import { CardIcon } from './icons/card-icon';
interface Props {
    className?: string;
    paymentCardColor?: PaymentCardColorType;
}
export const PaymentCardIcon = (props: Props) => {
    const isCardWhite = props.paymentCardColor === PaymentCardColorType.White;
    const backgroundColor = getBackgroundColorForPaymentCard(props.paymentCardColor);
    return (<FlexContainer alignItems="center" justifyContent="center" className={props.className} sx={{
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            height: '32px',
            width: '48px',
            backgroundColor: backgroundColor,
        }} data-testid="card-icon-container">
      <CardIcon fill={isCardWhite ? colors.grey04 : backgroundColor} color={isCardWhite ? colors.black : colors.white}/>
    </FlexContainer>);
};
