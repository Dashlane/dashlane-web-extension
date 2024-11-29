import { useState } from "react";
import {
  Button as HermesButton,
  PageView,
  UserClickEvent,
} from "@dashlane/hermes";
import { DataStatus } from "@dashlane/framework-react";
import { Button, Card, Heading, Paragraph } from "@dashlane/design-system";
import { Lee } from "../../../../lee";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useNodePremiumStatus } from "../../../../libs/carbon/hooks/useNodePremiumStatus";
import { logEvent, logPageView } from "../../../../libs/logs/logEvent";
import { PastReceiptsDialog } from "../past-receipts-dialog/past-receipts-dialog";
interface Props {
  lee: Lee;
}
const I18N_KEYS = {
  HEADER: "account_summary_billing_history_header",
  NO_INVOICE: "account_summary_billing_history_no_invoice",
  DOWNLOAD: "account_summary_billing_history_download_button",
};
export const BillingHistory = ({ lee }: Props) => {
  const { translate } = useTranslate();
  const premiumStatus = useNodePremiumStatus();
  const [showDownloadReceiptsDialog, setShowDownloadReceiptsDialog] =
    useState(false);
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return null;
  }
  const showDownloadReceiptsButton =
    premiumStatus.data.b2bStatus?.currentTeam?.hasPaid;
  const handleClickOnDownload = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.DownloadBillingHistory,
      })
    );
    logPageView(PageView.TacAccountCustomizeInvoice);
    setShowDownloadReceiptsDialog(true);
  };
  const handleCloseDownloadReceiptsDialog = () => {
    setShowDownloadReceiptsDialog(false);
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <Heading
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
        as="h2"
      >
        {translate(I18N_KEYS.HEADER)}
      </Heading>

      {showDownloadReceiptsButton ? (
        <Button
          mood="brand"
          intensity="supershy"
          icon="DownloadOutlined"
          layout="iconLeading"
          onClick={handleClickOnDownload}
        >
          {translate(I18N_KEYS.DOWNLOAD)}
        </Button>
      ) : (
        <Paragraph color="ds.text.inverse.quiet">
          {translate(I18N_KEYS.NO_INVOICE)}
        </Paragraph>
      )}
      <PastReceiptsDialog
        lee={lee}
        onClose={handleCloseDownloadReceiptsDialog}
        isOpen={showDownloadReceiptsDialog}
      />
    </Card>
  );
};
