import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Button, CloseIcon, colors } from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  ITEM_CONFIRM_DOWNLOAD_MESSAGE:
    "webapp_account_invoices_item_confirm_download_message",
  ITEM_CANCEL_DOWNLOAD_TOOLTIP:
    "webapp_account_invoices_item_cancel_download_tooltip",
  ITEM_BUTTON_DOWNLOAD: "webapp_account_invoices_item_button_download",
  ITEM_BUTTON_CUSTOMIZE: "webapp_account_invoices_item_button_customize",
};
export interface DownloadInvoiceConfirmationProps {
  onCancelDownloadRequested: () => void;
  isDownloadInvoiceRequested: boolean;
  onCustomizeInvoiceRequested: () => void;
  onDownloadInvoiceConfirmed: () => void;
}
export const DownloadInvoiceConfirmation = ({
  onCancelDownloadRequested,
  isDownloadInvoiceRequested,
  onCustomizeInvoiceRequested,
  onDownloadInvoiceConfirmed,
}: DownloadInvoiceConfirmationProps) => {
  const { translate } = useTranslate();
  return (
    <TransitionGroup>
      {isDownloadInvoiceRequested && (
        <CSSTransition
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            exit: styles.exit,
            exitActive: styles.exitActive,
          }}
          timeout={200}
          appear
          unmountOnExit
        >
          <div className={styles.confirmDownload}>
            <header className={styles.confirmDownloadHeader}>
              <p className={styles.confirmDownloadMessage}>
                {translate(I18N_KEYS.ITEM_CONFIRM_DOWNLOAD_MESSAGE)}
              </p>
              <Button
                type="button"
                nature="ghost"
                className={styles.unselectButton}
                title={translate(I18N_KEYS.ITEM_CANCEL_DOWNLOAD_TOOLTIP)}
                onClick={onCancelDownloadRequested}
              >
                <CloseIcon
                  size={20}
                  color={colors.dashGreen03}
                  hoverColor={colors.dashGreen00}
                />
              </Button>
            </header>
            <div className={styles.confirmDownloadButtons}>
              <Button
                type="button"
                size="small"
                nature="secondary"
                className={styles.confirmDownloadButton}
                onClick={onDownloadInvoiceConfirmed}
              >
                {translate(I18N_KEYS.ITEM_BUTTON_DOWNLOAD)}
              </Button>
              <Button
                type="button"
                size="small"
                nature="secondary"
                onClick={onCustomizeInvoiceRequested}
              >
                {translate(I18N_KEYS.ITEM_BUTTON_CUSTOMIZE)}
              </Button>
            </div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
