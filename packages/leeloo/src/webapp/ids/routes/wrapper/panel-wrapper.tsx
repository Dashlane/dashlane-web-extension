import * as React from 'react';
import { PageView } from '@dashlane/hermes';
import { Lee } from 'lee';
import { logPageView } from 'libs/logs/logEvent';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { Panel } from 'webapp/panel';
import { ConfirmDiscardDialog } from 'webapp/personal-data/edit/discard';
import { editPanelIgnoreClickOutsideClassName } from 'webapp/variables';
import transitionRouteStyles from 'libs/router/Routes/styles.css';
interface ChildProps {
    id?: string;
    listRoute: string;
    setDialogActive: (isShown: boolean) => void;
    lee: Lee;
    hasUnsavedData: boolean;
    setHasUnsavedData: (hasUnsavedData: boolean) => void;
}
interface Props {
    lee: Lee;
    component: React.ComponentType<ChildProps>;
    match?: {
        params?: {
            uuid?: string;
        };
    };
}
export const PanelWrapper = (props: Props) => {
    const { component: Component } = props;
    const { routes } = useRouterGlobalSettingsContext();
    const baseRoute = routes.userIdsDocuments;
    const [isDialogActive, setDialogActive] = React.useState(false);
    const [hasUnsavedData, setHasUnsavedData] = React.useState(false);
    const [displayDiscardAlert, setDisplayDiscardAlert] = React.useState(false);
    const showListView = () => {
        logPageView(PageView.ItemIdList);
        redirect(baseRoute);
    };
    const handleCancel = () => {
        showListView();
    };
    const handleClickOutside = hasUnsavedData
        ? (event: React.MouseEvent<HTMLElement>) => {
            if ((event?.target as HTMLElement)?.classList?.contains(transitionRouteStyles.overlay)) {
                event.stopPropagation();
            }
            setDisplayDiscardAlert(true);
        }
        : handleCancel;
    const confirmDiscardDialog = () => {
        setDisplayDiscardAlert(false);
        showListView();
    };
    return (<Panel ignoreClickOutsideClassName={editPanelIgnoreClickOutsideClassName} ignoreCloseOnEscape={isDialogActive || displayDiscardAlert} onNavigateOut={handleClickOutside}>
      <Component listRoute={baseRoute} id={props.match?.params?.uuid} setDialogActive={setDialogActive} lee={props.lee} hasUnsavedData={hasUnsavedData} setHasUnsavedData={setHasUnsavedData}/>
      {displayDiscardAlert ? (<ConfirmDiscardDialog onDismissClick={() => setDisplayDiscardAlert(false)} onConfirmClick={confirmDiscardDialog}/>) : null}
    </Panel>);
};
