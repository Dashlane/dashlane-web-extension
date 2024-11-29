import React, { useState } from "react";
import { Flex, Heading } from "@dashlane/design-system";
import { DLogo } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { Recover2faCodesRequestComponent } from "./request-2fa-codes";
import { RecoverOtpCodesSuccessComponent } from "./success-2fa-codes";
const I18N_KEYS = {
  HEADER: {
    TITLE: "webapp_recover_otp_codes_header_title",
    SUBTITLE: "webapp_recover_otp_codes_header_subtitle",
  },
};
export const Recover2FaCodes = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        height: "100vh",
        width: "100%",
        bg: "ds.background.alternate",
      }}
    >
      <Flex flexDirection="column">
        <Flex
          justifyContent="center"
          gap="8px"
          sx={{
            bg: "ds.container.agnostic.neutral.standard",
            padding: "32px",
            alignSelf: "stretch",
          }}
        >
          <Flex
            alignItems="center"
            gap="16px"
            sx={{
              maxWidth: "800px",
              flex: "1 0 0",
            }}
          >
            <DLogo size={48} color="ds.oddity.brand" />
            <Heading
              as="h1"
              textStyle="ds.title.section.large"
              color="ds.text.neutral.catchy"
            >
              {translate(I18N_KEYS.HEADER.TITLE)}
            </Heading>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="24px"
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            padding: "24px 24px 160px 24px",
            maxWidth: "848px",
            alignSelf: "stretch",
          }}
        >
          <Flex
            gap="16px"
            alignItems="flex-start"
            sx={{
              padding: "24px",
              alignSelf: "stretch",
              borderRadius: "8px",
              border: "1px solid transparent",
              borderColor: "ds.border.neutral.quiet.idle",
              bg: "ds.container.agnostic.neutral.supershy",
            }}
          >
            {isSuccess ? (
              <RecoverOtpCodesSuccessComponent />
            ) : (
              <Recover2faCodesRequestComponent
                onSuccess={() => setIsSuccess(true)}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
