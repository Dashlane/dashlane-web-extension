import { useEffect } from 'react';
import { Button, colors, FlexContainer, HappyFaceIcon, jsx, NeutralFaceIcon, Paragraph, SadFaceIcon, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { RateFormResponse } from '../types';
import { logRateFormDismissAction, logRateFormPageView } from '../logs';
import { CardLayout } from '../layout/CardLayout';
const I18N_KEYS = {
    TITLE: 'webapp_web_store_dialog_rate_form_title',
    RESPONSE_BAD: 'webapp_web_store_dialog_rate_form_bad',
    RESPONSE_OKAY: 'webapp_web_store_dialog_rate_form_okay',
    RESPONSE_GREAT: 'webapp_web_store_dialog_rate_form_great',
};
interface FaceButtonProps {
    icon: React.ReactNode;
    text: string;
    faceHoverColor: string;
    onClick: () => void;
}
const FaceButton = ({ icon, text, faceHoverColor, ...props }: FaceButtonProps) => (<Button type="button" nature="ghost" sx={{
        height: '105px',
        width: '110px',
        ':hover': {
            backgroundColor: colors.dashGreen06,
            'div > div': { backgroundColor: faceHoverColor },
        },
    }} {...props}>
    <FlexContainer flexDirection="column" alignItems="center" gap="16px">
      <div sx={{ borderRadius: '30px' }}>{icon}</div>
      <Paragraph>{text}</Paragraph>
    </FlexContainer>
  </Button>);
interface RateFormProps {
    formResponse: (response: RateFormResponse) => void;
    onClose: () => void;
}
export const RateForm = ({ formResponse, onClose }: RateFormProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        logRateFormPageView();
    }, []);
    const handleDismiss = () => {
        logRateFormDismissAction();
        onClose();
    };
    return (<CardLayout title={translate(I18N_KEYS.TITLE)} displayHeaderLogo onClose={handleDismiss}>
      <FlexContainer justifyContent="space-between">
        <FaceButton text={translate(I18N_KEYS.RESPONSE_BAD)} faceHoverColor={colors.red02} icon={<SadFaceIcon size={36}/>} onClick={() => {
            formResponse(RateFormResponse.Bad);
        }}/>
        <FaceButton text={translate(I18N_KEYS.RESPONSE_OKAY)} faceHoverColor={colors.dashGreen03} icon={<NeutralFaceIcon size={36}/>} onClick={() => {
            formResponse(RateFormResponse.Okay);
        }}/>
        <FaceButton text={translate(I18N_KEYS.RESPONSE_GREAT)} faceHoverColor={colors.validatorGreen} icon={<HappyFaceIcon size={36}/>} onClick={() => {
            formResponse(RateFormResponse.Great);
        }}/>
      </FlexContainer>
    </CardLayout>);
};
