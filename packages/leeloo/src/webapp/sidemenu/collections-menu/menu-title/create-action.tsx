import React, { useState } from 'react';
import { Button, Icon } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { CreateDialog } from 'webapp/vault/collection-view/dialogs';
import { CollectionGuidedIntro } from '../guided-intro/collection-guided-intro';
export const CreateAction = () => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const [buttonCoordinates, setButtonCoordinates] = useState({ x: 0, y: 0 });
    const ref = React.useRef(null);
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const getCoordonates = (element: HTMLButtonElement | null) => {
        const rect = element?.getBoundingClientRect();
        return { x: rect?.left ?? 0, y: rect?.top ?? 0 };
    };
    React.useEffect(() => {
        setButtonCoordinates(getCoordonates(ref.current));
    }, []);
    const handleClickOnCreate = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else {
            setIsOpen(true);
            logPageView(PageView.CollectionCreate);
        }
    };
    return (<div>
      <CollectionGuidedIntro buttonCoordinates={buttonCoordinates}/>
      <Button onClick={handleClickOnCreate} icon={<Icon name="ActionAddOutlined" title={translate('collections_sidemenu_create_icon_title')}/>} layout={'iconOnly'} intensity="supershy" mood="neutral" size="medium" ref={ref}/>
      {isOpen && <CreateDialog onClose={() => setIsOpen(false)}/>}
    </div>);
};
