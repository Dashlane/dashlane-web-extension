import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { teamMembersApi } from "@dashlane/team-admin-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { isValidEmail } from "../../../../../libs/validators";
import { hasRefusedMembers } from "../../../../../team/members/helpers";
import { EmailFields, InvitationStep } from "../types";
import { logCompleteSendManualInvite, logErrorSendManualInvite } from "../logs";
const EMAIL_COUNT = 3;
export interface UseInviteTeamMembersDialogData {
  emailFields: EmailFields;
  handleEmailChange: (index: number, value: string) => void;
  handleEmailsReset: () => void;
  handleProposeMembers: () => Promise<InvitationStep>;
}
export const useInviteTeamMembersDialogData =
  (): UseInviteTeamMembersDialogData => {
    const initialState: EmailFields = Array.from(
      { length: EMAIL_COUNT },
      () => ({
        value: "",
        valid: null,
        id: uuidv4(),
      })
    );
    const { proposeMembers } = useModuleCommands(teamMembersApi);
    const [emailFields, setEmailFields] = useState<EmailFields>(initialState);
    const handleEmailsValidation = (): {
      areEmailsValid: boolean;
      emails: string[];
    } => {
      const updatedEmailFields = emailFields.map((emailItem) => {
        return {
          ...emailItem,
          valid: emailItem.value ? isValidEmail(emailItem.value) : null,
        };
      });
      setEmailFields(updatedEmailFields);
      const emailFieldsWithValue = updatedEmailFields.filter(
        ({ value }) => !!value
      );
      const areEmailsValid = emailFieldsWithValue.length
        ? emailFieldsWithValue.every(({ valid }) => valid === true)
        : false;
      const emails = emailFieldsWithValue.length
        ? emailFieldsWithValue.map(({ value }) => value.trim().toLowerCase())
        : [];
      return {
        areEmailsValid,
        emails,
      };
    };
    const handleProposeMembers = (): Promise<InvitationStep> => {
      const { areEmailsValid, emails } = handleEmailsValidation();
      if (!areEmailsValid) {
        return Promise.resolve(InvitationStep.IDLE);
      }
      return proposeMembers({
        proposedMemberLogins: emails,
      })
        .then((response: { [key: string]: any }) => {
          if (response.tag === "failure") {
            throw new Error("Something went wrong while inviting members");
          }
          const inviteSuccessfulCount = response.data
            ? Object.keys(response.data.proposedMembers).length
            : 0;
          if (response.data && hasRefusedMembers(response.data)) {
            const inviteFailedCount = response.data
              ? Object.keys(response.data.refusedMembers).length
              : 0;
            logErrorSendManualInvite(
              emails.length,
              inviteSuccessfulCount,
              inviteFailedCount
            );
            throw new Error("Some members were refused");
          }
          logCompleteSendManualInvite(emails.length, inviteSuccessfulCount);
          return InvitationStep.SUCCESS;
        })
        .catch(() => {
          return InvitationStep.ERROR;
        });
    };
    const handleEmailChange = (index: number, value: string) => {
      const newState = emailFields.map((emailItem, i) => {
        if (i === index) {
          return {
            ...emailItem,
            value,
            valid: value ? emailItem.valid : null,
          };
        }
        return emailItem;
      });
      setEmailFields(newState);
    };
    const handleEmailsReset = () => {
      setEmailFields(initialState);
    };
    return {
      emailFields,
      handleEmailChange,
      handleEmailsReset,
      handleProposeMembers,
    };
  };
