import { jsx } from '@dashlane/design-system';
import { colors, FlexContainer, LoadingIcon, Modal, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    ADD_SEATS_PROCESSING_LINE_1: 'team_account_addseats_processing_copy_line_1',
    ADD_SEATS_PROCESSING_LINE_2: 'team_account_addseats_processing_copy_line_2',
};
export const AddSeatsProcessingModal = () => {
    const { translate } = useTranslate();
    return (<Modal isOpen={true} onClose={() => { }}>
      <FlexContainer alignItems="center" flexDirection="column" justifyContent="center" sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: colors.dashGreen06,
        }}>
        <LoadingIcon size="88px" color={colors.dashGreen00}/>
        <FlexContainer alignItems="center" flexDirection="column" justifyContent="center" gap="6px" sx={{ paddingTop: '22px' }}>
          <Paragraph size="medium" color={colors.grey00}>
            {translate(I18N_KEYS.ADD_SEATS_PROCESSING_LINE_1)}
          </Paragraph>
          <Paragraph size="medium" color={colors.grey00}>
            {translate(I18N_KEYS.ADD_SEATS_PROCESSING_LINE_2)}
          </Paragraph>
        </FlexContainer>
      </FlexContainer>
    </Modal>);
};
