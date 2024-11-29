import { ReactNode } from "react";
import {
  Button,
  Flex,
  Heading,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import { Card, Eyebrow } from "@dashlane/ui-components";
import useTranslate from "../libs/i18n/useTranslate";
import { redirectToUrl } from "../libs/external-urls";
import { useDeleteOrResetAccount } from "./hooks/use-delete-or-reset-account";
import { BasePanelContainer } from "../left-panels/base-panel-container";
import { UsernameStep } from "./form-steps/username-step";
import { DeleteOrResetAccountSteps } from "./types";
import { VerificationStep } from "./form-steps/verification-step";
import { SuccessStep } from "./form-steps/success-step";
import {
  DASHLANE_ARTICLE_DELETE_YOUR_ACCOUNT,
  DASHLANE_ARTICLE_RESET_YOUR_ACCOUNT,
} from "../webapp/urls";
export const I18N_KEYS = {
  TITLE_DELETE: "webapp_delete_account_title",
  INFOBOX_TITLE_DELETE: "webapp_infobox_delete_account_title",
  STEP_USERNAME_PARAGRAPH: "webapp_step_username_paragraph_delete",
  STEP_VERIFICATION_PARAGRAPH_DELETE:
    "webapp_step_verification_paragraph_delete_markup",
  BUTTON_LEARN_MORE: "webapp_delete_account_learn_more",
  TITLE_RESET: "webapp_reset_account_title",
  INFOBOX_TITLE_RESET: "webapp_infobox_reset_account_title",
  STEP_VERIFICATION_PARAGRAPH_RESET: "webapp_step_verification_paragraph_reset",
};
interface DeleteOrResetAccountProps {
  isDelete: boolean;
}
const getCurrentStep = (
  isFlowCompleted: boolean,
  hasUserAuthenticationMethod: boolean
): DeleteOrResetAccountSteps => {
  if (isFlowCompleted) {
    return DeleteOrResetAccountSteps.DeletionSuccess;
  }
  if (hasUserAuthenticationMethod) {
    return DeleteOrResetAccountSteps.TokenValidation;
  }
  return DeleteOrResetAccountSteps.Username;
};
export const DeleteOrResetAccount = ({
  isDelete,
}: DeleteOrResetAccountProps) => {
  const { translate } = useTranslate();
  const { userAuthenticationMethod, isFlowCompleted } =
    useDeleteOrResetAccount();
  const currentStep: DeleteOrResetAccountSteps = getCurrentStep(
    isFlowCompleted,
    userAuthenticationMethod !== null
  );
  const totalStepNumber = 2;
  const currentStepNumber = userAuthenticationMethod !== null ? 2 : 1;
  const InfoBoxCopyFromStep: Record<DeleteOrResetAccountSteps, ReactNode> = {
    [DeleteOrResetAccountSteps.Username]: translate(
      I18N_KEYS.STEP_USERNAME_PARAGRAPH
    ),
    [DeleteOrResetAccountSteps.TokenValidation]: isDelete
      ? translate.markup(I18N_KEYS.STEP_VERIFICATION_PARAGRAPH_DELETE)
      : translate(I18N_KEYS.STEP_VERIFICATION_PARAGRAPH_RESET),
    [DeleteOrResetAccountSteps.DeletionSuccess]: null,
  };
  const FormComponentFromStep: Record<DeleteOrResetAccountSteps, ReactNode> = {
    [DeleteOrResetAccountSteps.Username]: <UsernameStep isDelete={isDelete} />,
    [DeleteOrResetAccountSteps.TokenValidation]: (
      <VerificationStep isDelete={isDelete} />
    ),
    [DeleteOrResetAccountSteps.DeletionSuccess]: (
      <SuccessStep isDelete={isDelete} />
    ),
  };
  return (
    <BasePanelContainer backgroundColor="ds.container.agnostic.neutral.standard">
      <Flex
        flexWrap="nowrap"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          margin: "0px auto 0px auto",
          minHeight: "100vh",
          maxWidth: "860px",
          padding: "0 24px",
        }}
        gap="8px"
      >
        <Heading
          textStyle="ds.title.section.large"
          as="h1"
          sx={{ marginBottom: "16px" }}
        >
          {translate(isDelete ? I18N_KEYS.TITLE_DELETE : I18N_KEYS.TITLE_RESET)}
        </Heading>
        {!isFlowCompleted ? (
          <Infobox
            sx={{ width: "100%" }}
            size="large"
            mood="danger"
            title={translate(
              isDelete
                ? I18N_KEYS.INFOBOX_TITLE_DELETE
                : I18N_KEYS.INFOBOX_TITLE_RESET
            )}
            description={
              <Paragraph>{InfoBoxCopyFromStep[currentStep]}</Paragraph>
            }
            actions={[
              <Button
                intensity="quiet"
                key="learnMore"
                icon="ActionOpenExternalLinkOutlined"
                layout="iconTrailing"
                onClick={() => {
                  redirectToUrl(
                    isDelete
                      ? DASHLANE_ARTICLE_DELETE_YOUR_ACCOUNT
                      : DASHLANE_ARTICLE_RESET_YOUR_ACCOUNT
                  );
                }}
              >
                {translate(I18N_KEYS.BUTTON_LEARN_MORE)}
              </Button>,
            ]}
          />
        ) : null}
        <Flex
          flexWrap="nowrap"
          as={Card}
          flexDirection="column"
          fullWidth
          gap="16px"
          sx={{
            padding: "24px",
            backgroundColor: "ds.container.agnostic.neutral.supershy",
            borderColor: "ds.border.neutral.quiet.idle",
          }}
        >
          {!isFlowCompleted ? (
            <Eyebrow>
              Step {currentStepNumber} of {totalStepNumber}
            </Eyebrow>
          ) : null}
          {FormComponentFromStep[currentStep]}
        </Flex>
      </Flex>
    </BasePanelContainer>
  );
};
