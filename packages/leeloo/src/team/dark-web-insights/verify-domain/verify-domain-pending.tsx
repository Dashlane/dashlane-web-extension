import { fromUnixTime } from "date-fns";
import { Card, Flex } from "@dashlane/design-system";
import {
  Accordion,
  AccordionDetails,
  AccordionSection,
  AccordionSummary,
  Button,
  colors,
  GridContainer,
  Heading,
  Paragraph,
  RefreshIcon,
  TextInput,
} from "@dashlane/ui-components";
import { Domain } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import LocalizedTimeAgo from "../../../libs/i18n/localizedTimeAgo";
import { InputWithCopyButton } from "../../../libs/dashlane-style/text-input-with-action-button/input-with-copy-button";
import { Stepper } from "./stepper/stepper";
const I18N_KEYS = {
  VERIFY_PENDING_TITLE: "team_breach_report_domain_verify_pending_title",
  CONFIRM_DNS_TEXT: "team_breach_report_domain_verify_dns_confirm_text",
  VERIFY_DNS_TEXT_DESCRIPTION:
    "team_breach_report_domain_verify_dns_description",
  VERIFY_DNS_TEXT_SECONDARY_DESCRIPTION:
    "team_breach_report_domain_verify_dns_secondary_description",
  DESCRIPTION: "breach_report_verify_domain_dialog_description_markup",
  SECONDARY_DESCRIPTION:
    "breach_report_verify_domain_dialog_secondary_description",
  VERIFY_HOST: "team_settings_domain_verify_host",
  VERIFY_TXT: "team_settings_domain_verify_txt",
  VERIFYING_CTA_TXT: "team_breach_report_verifying_txt",
  CANCEL_BTN: "team_dwi_pending_cancel_button_label",
  RETRY_BTN: "team_dwi_pending_retry_button_label",
  LATEST_ATTEMPT_LABEL: "team_dwi_pending_latest_attempt_label",
  PENDING_TXT: "team_dwi_pending_verification_txt",
};
const RetrySection = ({
  lastVerificationAttemptDateUnix,
  onRetry,
}: {
  lastVerificationAttemptDateUnix?: number;
  onRetry: () => void;
}) => {
  const { translate } = useTranslate();
  return (
    <Flex
      justifyContent="space-between"
      flexDirection="column"
      gap={5}
      sx={{
        margin: "30px 0",
        paddingLeft: "24px",
        borderLeft: `solid 2px ${colors.grey00}`,
      }}
    >
      <Paragraph size="x-small" bold>
        {translate(I18N_KEYS.LATEST_ATTEMPT_LABEL)}{" "}
        {lastVerificationAttemptDateUnix ? (
          <LocalizedTimeAgo
            date={fromUnixTime(lastVerificationAttemptDateUnix)}
          />
        ) : null}
      </Paragraph>
      <Button
        type="button"
        nature="ghost"
        sx={{
          width: "fit-content",
          margin: 0,
          padding: 0,
          minWidth: 0,
          height: "fit-content",
          "&:hover": {
            backgroundColor: "transparent !important",
            textDecoration: "underline",
          },
          "&:focus": {
            backgroundColor: "transparent !important",
            textDecoration: "underline",
          },
        }}
        onClick={onRetry}
      >
        <Flex alignItems="center" gap={2}>
          <RefreshIcon size={12} />
          <Paragraph size="x-small" color={colors.midGreen00}>
            {translate(I18N_KEYS.RETRY_BTN)}
          </Paragraph>
        </Flex>
      </Button>
    </Flex>
  );
};
interface VerifyDomainDarkWebInsightsProps {
  domain: Domain;
  isDeactivating: boolean;
  handleDeactivateDomain: () => void;
  handleRetryValidateDomain: () => void;
}
export const VerifyDomainPending = ({
  domain,
  isDeactivating,
  handleDeactivateDomain,
  handleRetryValidateDomain,
}: VerifyDomainDarkWebInsightsProps) => {
  const { translate } = useTranslate();
  const {
    dnsToken: { computedToken, challengeDomain } = {
      computedToken: "",
      challengeDomain: "",
    },
    lastVerificationAttemptDateUnix,
  } = domain;
  return (
    <>
      <Stepper />
      <div>
        <Card sx={{ margin: "24px 0" }}>
          <Heading size="x-small">
            {translate(I18N_KEYS.VERIFY_PENDING_TITLE)}
          </Heading>
          <Paragraph
            sx={{ marginBottom: "20px", marginTop: "10px" }}
            color={colors.grey00}
          >
            {translate(I18N_KEYS.PENDING_TXT)}
          </Paragraph>
          <RetrySection
            lastVerificationAttemptDateUnix={lastVerificationAttemptDateUnix}
            onRetry={handleRetryValidateDomain}
          />
          <Flex gap="16px">
            <div sx={{ width: "70%" }}>
              <TextInput fullWidth defaultValue={domain.name} disabled />
            </div>
            <div>
              <Button
                type="button"
                disabled={isDeactivating}
                nature="secondary"
                onClick={handleDeactivateDomain}
              >
                {translate(I18N_KEYS.CANCEL_BTN)}
              </Button>
            </div>
            <div>
              <Button type="button" disabled sx={{ maxWidth: "120px" }}>
                {translate(I18N_KEYS.VERIFYING_CTA_TXT)}
              </Button>
            </div>
          </Flex>
        </Card>
        <Accordion size="medium">
          <AccordionSection open>
            <AccordionSummary>
              {translate(I18N_KEYS.CONFIRM_DNS_TEXT)}
            </AccordionSummary>
            <AccordionDetails>
              <GridContainer
                gap="24px"
                gridTemplateColumns="1fr"
                gridAutoRows="auto"
              >
                <Paragraph size="small" color={colors.grey00}>
                  {translate(I18N_KEYS.VERIFY_DNS_TEXT_DESCRIPTION)}
                </Paragraph>
                <InputWithCopyButton
                  inputValue={challengeDomain}
                  textInputProps={{
                    fullWidth: true,
                    readOnly: true,
                    label: translate(I18N_KEYS.VERIFY_HOST),
                  }}
                />
                <InputWithCopyButton
                  inputValue={computedToken}
                  textInputProps={{
                    fullWidth: true,
                    readOnly: true,
                    label: translate(I18N_KEYS.VERIFY_TXT),
                  }}
                />
                <Paragraph
                  size="small"
                  sx={{ marginBottom: "20px" }}
                  color={colors.grey00}
                >
                  {translate(I18N_KEYS.VERIFY_DNS_TEXT_SECONDARY_DESCRIPTION)}
                </Paragraph>
              </GridContainer>
            </AccordionDetails>
          </AccordionSection>
        </Accordion>
      </div>
    </>
  );
};
