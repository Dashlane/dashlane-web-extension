import { jsx } from '@dashlane/design-system';
import { colors, DialogBody, FlexContainer, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
export interface ImportDataDialogLoadingProps {
    isOpen: boolean;
    showCloseIcon: boolean;
}
const ignoreOnClose = () => { };
export const ImportDataDialogLoading = ({ isOpen, showCloseIcon, }: ImportDataDialogLoadingProps) => {
    const { translate } = useTranslate();
    return (<SimpleDialog isOpen={isOpen} onRequestClose={ignoreOnClose} showCloseIcon={showCloseIcon} disableOutsideClickClose disableBackgroundPanelClose>
      <DialogBody>
        <FlexContainer flexDirection="column" alignContent="center" justifyContent="center" alignItems="center" gap="25px">
          <LoadingIcon size={88} aria-hidden="true" color={colors.dashGreen01}/>
          <Paragraph>{translate('webapp_import_chrome_loader')}</Paragraph>
        </FlexContainer>
      </DialogBody>
    </SimpleDialog>);
};
