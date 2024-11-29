import * as React from "react";
import { noop } from "lodash";
import { Enum } from "typescript-string-enums";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { AlertSize } from "@dashlane/ui-components";
import { Button, Flex, Icon } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { AlertProvider } from "../../../libs/alert-notifications/alert-provider";
import { ConfirmDiscardDialog } from "../../personal-data/edit/discard";
import { Panel } from "..";
import { editPanelIgnoreClickOutsideClassName } from "../../variables";
import { CloseActionLabels } from "./close-action-labels";
import { useWebStoreMessage } from "../../web-store-dialog/utils";
import cssVariables from "../../variables.css";
import styles from "./styles.css";
const actionsAnimationDurationMs = parseInt(
  cssVariables["--transition-duration-slow"],
  10
);
export const NavigateOutAction = Enum("close", "cancel");
export type NavigateOutAction = Enum<typeof NavigateOutAction>;
const I18N_KEYS = {
  CLOSE: "webapp_panel_edition_generic_close",
  CANCEL: "webapp_panel_edition_generic_cancel_changes",
  DELETE: "webapp_panel_edition_generic_delete",
  SAVE: "webapp_panel_edition_generic_save_changes",
};
export interface Props {
  formId: string;
  isViewingExistingItem: boolean;
  itemHasBeenEdited: boolean;
  isCardValid?: boolean;
  isEditableItem?: boolean;
  onClickDelete?: (e: React.MouseEvent<HTMLElement>) => void;
  onNavigateOut: (
    action?: NavigateOutAction,
    e?: React.MouseEvent<HTMLElement>
  ) => void;
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
  ) => void;
  header?: React.ReactNode;
  primaryActions?: React.ReactNode[];
  secondaryActions?: React.ReactNode[];
  submitPending?: boolean;
  submitDisabled?: boolean;
  ignoreCloseOnEscape?: boolean;
  withoutCloseButton?: boolean;
  withoutDeleteButton?: boolean;
  withoutConfirmationDialog?: boolean;
  isSomeDialogOpen?: boolean;
  isUsingNewDesign?: boolean;
}
export const EditPanel = ({
  children,
  formId,
  isViewingExistingItem,
  itemHasBeenEdited,
  isCardValid = true,
  isEditableItem = true,
  onClickDelete,
  onNavigateOut,
  onSubmit,
  header,
  primaryActions,
  secondaryActions,
  submitPending,
  submitDisabled,
  ignoreCloseOnEscape,
  withoutCloseButton,
  withoutDeleteButton,
  withoutConfirmationDialog,
  isSomeDialogOpen = false,
  isUsingNewDesign = false,
}: React.PropsWithChildren<Props>) => {
  const { translate } = useTranslate();
  const [displayConfirmDiscardDialog, setDisplayConfirmDiscardDialog] =
    React.useState(false);
  const addWebStoreDialog = useWebStoreMessage();
  const showSaveAction = (): boolean => {
    return isEditableItem && itemHasBeenEdited && isCardValid;
  };
  const showCancelAction = (): boolean => {
    return Boolean(
      isEditableItem && (!isViewingExistingItem || itemHasBeenEdited)
    );
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    if (onSubmit && !submitPending && !submitDisabled) {
      onSubmit(event);
      addWebStoreDialog?.();
    }
    return false;
  };
  const getNavigateOutSubaction = (): NavigateOutAction => {
    return showSaveAction()
      ? NavigateOutAction.cancel
      : NavigateOutAction.close;
  };
  const handleNavigateOut = (event?: React.MouseEvent<HTMLElement>) => {
    if (
      (itemHasBeenEdited && displayConfirmDiscardDialog) ||
      isSomeDialogOpen
    ) {
      return;
    }
    if (onNavigateOut) {
      const action = getNavigateOutSubaction();
      if (
        (event === undefined && action === "cancel") ||
        (itemHasBeenEdited && !withoutConfirmationDialog)
      ) {
        setDisplayConfirmDiscardDialog(true);
      } else {
        onNavigateOut(action, event);
      }
    }
  };
  const getCloseAction = (): React.ReactNode => {
    if (withoutCloseButton) {
      return null;
    }
    return (
      <Flex>
        <Button
          data-testid="detail_panel_close_button"
          aria-label={
            showCancelAction()
              ? translate(I18N_KEYS.CANCEL)
              : translate(I18N_KEYS.CLOSE)
          }
          mood="neutral"
          intensity="quiet"
          size="medium"
          onClick={handleNavigateOut}
        >
          <CloseActionLabels
            labels={[translate(I18N_KEYS.CLOSE), translate(I18N_KEYS.CANCEL)]}
            visibleLabel={
              showCancelAction()
                ? translate(I18N_KEYS.CANCEL)
                : translate(I18N_KEYS.CLOSE)
            }
          />
        </Button>
      </Flex>
    );
  };
  const getPrimaryActions = (): React.ReactNode[] => {
    const baseActions = primaryActions ?? [];
    if (!showSaveAction()) {
      return baseActions;
    }
    const saveAction = (
      <CSSTransition
        classNames={{
          enter: styles.primaryActionsEnter,
          enterActive: styles.primaryActionsEnterActive,
          exit: styles.primaryActionsExit,
          exitActive: styles.primaryActionsExitActive,
        }}
        timeout={actionsAnimationDurationMs}
        key="save"
      >
        <Flex>
          <Button
            type="submit"
            size="medium"
            sx={{ minWidth: "80px" }}
            disabled={submitPending || submitDisabled}
            isLoading={submitPending}
            form={formId}
          >
            {translate(I18N_KEYS.SAVE)}
          </Button>
        </Flex>
      </CSSTransition>
    );
    return [saveAction, ...baseActions];
  };
  const getSecondaryActions = (): React.ReactNode[] => {
    const deleteSecondaryAction: React.ReactNode[] =
      isViewingExistingItem && isEditableItem && !withoutDeleteButton
        ? [
            <Button
              key="delete"
              aria-label={translate(I18N_KEYS.DELETE)}
              size="medium"
              mood="danger"
              icon={<Icon name="ActionDeleteOutlined" />}
              layout="iconOnly"
              intensity="supershy"
              onClick={onClickDelete ?? noop}
            />,
          ]
        : [];
    return secondaryActions
      ? deleteSecondaryAction.concat(secondaryActions)
      : deleteSecondaryAction;
  };
  const handleDismissDiscardDialog = (): void => {
    setDisplayConfirmDiscardDialog(false);
  };
  const handleConfirmDiscardDialog = (): void => {
    onNavigateOut(NavigateOutAction.cancel);
  };
  return (
    <AlertProvider portalId="alert-popup-portal" alertSize={AlertSize.SMALL}>
      <Panel
        onNavigateOut={handleNavigateOut}
        ignoreClickOutsideClassName={editPanelIgnoreClickOutsideClassName}
        ignoreCloseOnEscape={ignoreCloseOnEscape}
      >
        {header}
        <form
          sx={{
            backgroundColor: isUsingNewDesign
              ? "ds.background.alternate"
              : "ds.container.agnostic.neutral.supershy",
          }}
          className={styles.form}
          autoComplete="off"
          noValidate={true}
          onSubmit={handleSubmit}
          id={formId}
        >
          {children}

          <div
            className={styles.alertPopup}
            id="alert-sidepanel-popup-portal"
          />
        </form>

        <footer
          sx={{
            backgroundColor: "ds.container.agnostic.neutral.supershy",
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "ds.border.neutral.quiet.idle",
          }}
          className={styles.actions}
        >
          <div className={styles.actionsContainer}>{getSecondaryActions()}</div>
          <div className={styles.actionsContainer}>
            <TransitionGroup className={styles.primaryActionsTransitionGroup}>
              {getPrimaryActions()}
            </TransitionGroup>

            {getCloseAction()}
          </div>
        </footer>
        {displayConfirmDiscardDialog ? (
          <ConfirmDiscardDialog
            onDismissClick={handleDismissDiscardDialog}
            onConfirmClick={handleConfirmDiscardDialog}
          />
        ) : null}
      </Panel>
    </AlertProvider>
  );
};
