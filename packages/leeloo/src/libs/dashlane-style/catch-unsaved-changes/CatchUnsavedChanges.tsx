import { Dialog, DialogBody, DialogFooter, DialogTitle, jsx, Paragraph, } from '@dashlane/ui-components';
import { Location } from 'history';
import { Fragment, useEffect, useState } from 'react';
import { Prompt, Redirect } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
interface CatchUnsavedChangesProps {
    dirty: boolean;
    onLeavePage?: () => void;
    onKeepEditing?: () => void;
    onUnsavedChangesCaught?: () => void;
    titleText?: string;
    bodyText?: string;
}
const I18N_KEYS = {
    MODAL_TITLE: '_common_form_unsaved_changes_title',
    MODAL_DESCRIPTION: '_common_form_unsaved_changes_description',
    DISCARD_BUTTON: '_common_form_unsaved_changes_discard',
    KEEP_EDITING: '_common_form_unsaved_changes_keep_editing',
    CLOSE_ICON: '_common_dialog_dismiss_button',
};
export const CatchUnsavedChanges = ({ dirty, onLeavePage, onKeepEditing, onUnsavedChangesCaught, titleText, bodyText, }: CatchUnsavedChangesProps) => {
    const { translate } = useTranslate();
    const [modalOpen, setModalOpen] = useState(false);
    const [nextLocation, setNextLocation] = useState<Location | null>(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const handleNavigateAway = (location: Location) => {
        onUnsavedChangesCaught?.();
        setNextLocation(location);
        setModalOpen(true);
        return false;
    };
    const handleModalClose = () => {
        setModalOpen(false);
        onKeepEditing?.();
    };
    useEffect(() => {
        const beforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            if (dirty) {
                event.returnValue = translate(I18N_KEYS.MODAL_DESCRIPTION);
            }
        };
        window.addEventListener('beforeunload', beforeUnload);
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, [dirty]);
    const continueNavigation = () => {
        onLeavePage?.();
        setModalOpen(false);
        setShouldRedirect(true);
    };
    if (shouldRedirect && nextLocation) {
        return <Redirect to={nextLocation.pathname}/>;
    }
    else {
        return (<>
        <Prompt when={dirty} message={handleNavigateAway}/>
        <Dialog closeIconName={translate(I18N_KEYS.CLOSE_ICON)} disableScrolling={false} isOpen={modalOpen} onClose={handleModalClose} disableOutsideClickClose={true}>
          <DialogTitle title={titleText ?? translate(I18N_KEYS.MODAL_TITLE)}/>
          <DialogBody>
            <Paragraph>
              {bodyText ?? translate(I18N_KEYS.MODAL_DESCRIPTION)}
            </Paragraph>
          </DialogBody>
          <DialogFooter primaryButtonTitle={translate(I18N_KEYS.DISCARD_BUTTON)} primaryButtonOnClick={continueNavigation} secondaryButtonTitle={translate(I18N_KEYS.KEEP_EDITING)} secondaryButtonOnClick={() => setModalOpen(false)}/>
        </Dialog>
      </>);
    }
};
