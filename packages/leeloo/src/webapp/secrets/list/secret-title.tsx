import * as React from "react";
import { Icon, Paragraph } from "@dashlane/design-system";
import { Secret } from "@dashlane/vault-contracts";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import styles from "../styles.css";
interface Props {
  secret: Secret;
  isShared: boolean;
  showTitleIcons?: boolean;
  tag?: React.ReactNode;
}
export const SecretTitle = ({
  secret,
  isShared,
  showTitleIcons = true,
  tag,
}: Props) => {
  return (
    <div className={styles.titleOuterWrapper}>
      <div
        sx={{
          alignItems: "center",
          borderRadius: "4px",
          border: "1px solid",
          borderColor: "ds.border.neutral.quiet.idle",
          display: "flex",
          height: "32px",
          justifyContent: "center",
          width: " 48px",
          backgroundColor: "ds.container.agnostic.neutral.standard",
          marginRight: "16px",
        }}
      >
        <Icon name="ItemSecretOutlined" color="ds.text.neutral.standard" />
      </div>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className={styles.title}>
          <IntelligentTooltipOnOverflow
            tooltipText={secret.title}
            className={styles.container}
          >
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.catchy"
            >
              {secret.title}
            </Paragraph>
          </IntelligentTooltipOnOverflow>
          {tag ? <div className={styles.tagPlacement}>{tag}</div> : null}
          {isShared && showTitleIcons ? (
            <span role="img" aria-hidden sx={{ marginLeft: "5px" }}>
              <Icon
                name="SharedOutlined"
                size="xsmall"
                color="ds.text.neutral.quiet"
              />
            </span>
          ) : null}

          {!!secret.attachments &&
          secret.attachments.length > 0 &&
          showTitleIcons ? (
            <span role="img" aria-hidden sx={{ marginLeft: "5px" }}>
              <Icon
                name="AttachmentOutlined"
                size="xsmall"
                color="ds.text.neutral.quiet"
              />
            </span>
          ) : null}

          {secret.isSecured && showTitleIcons ? (
            <span role="img" aria-hidden sx={{ marginLeft: "5px" }}>
              <Icon
                name="LockOutlined"
                size="xsmall"
                color="ds.text.neutral.quiet"
              />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
