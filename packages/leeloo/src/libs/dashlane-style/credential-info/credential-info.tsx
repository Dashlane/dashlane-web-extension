import { memo, ReactNode, useMemo } from "react";
import {
  DSStyleObject,
  Icon,
  mergeSx,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { useAreRichIconsEnabled } from "../../hooks/use-are-rich-icons-enabled";
export enum CredentialInfoSize {
  XSMALL = "xsmall",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
export interface Props {
  title: string;
  login?: string;
  email?: string;
  shared?: boolean;
  showTitleIcons?: boolean;
  autoProtected?: boolean;
  size?: CredentialInfoSize;
  domain?: string;
  fullWidth?: boolean;
  children?: JSX.Element | null;
  tag?: ReactNode;
  sxProps?: Partial<ThemeUIStyleObject>;
}
const RawCredentialInfo = ({
  title = "",
  login = "",
  email = "",
  size = CredentialInfoSize.SMALL,
  domain = "",
  shared = false,
  showTitleIcons = true,
  autoProtected = false,
  fullWidth = false,
  children = null,
  tag,
  sxProps = {},
}: Props) => {
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const statusesSupported = size === CredentialInfoSize.SMALL;
  const loginTextSupported = size === CredentialInfoSize.SMALL;
  const loginText = loginTextSupported ? login || email : null;
  const thumbnail = useMemo(
    () => (
      <ConnectedDomainThumbnail
        domainURL={domain}
        forceFallback={!areRichIconsEnabled}
      />
    ),
    [areRichIconsEnabled, domain]
  );
  return (
    <div
      data-testid="credential-info-container"
      title={title}
      sx={mergeSx([
        sxProps,
        { display: "flex", alignItems: "center" } as Partial<DSStyleObject>,
        fullWidth ? { width: "100%" } : {},
      ])}
    >
      <div
        role="img"
        aria-hidden
        data-testsize={size}
        data-testid="credential-info-thumbnail"
      >
        {thumbnail}
      </div>
      <span
        data-testid="credential-info-content"
        sx={mergeSx([
          {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "16px",
            minWidth: 0,
            width: "100%",
          } as Partial<DSStyleObject>,
          fullWidth ? { width: "100%" } : {},
        ])}
      >
        <span
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.catchy"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Paragraph>
          {tag ? <span sx={{ mr: "5px", ml: "8px" }}>{tag}</span> : null}

          {statusesSupported && showTitleIcons ? (
            <>
              {shared ? (
                <span
                  role="img"
                  aria-hidden
                  data-testid="credential-info-sharing-status-icon"
                  sx={{
                    marginLeft: "5px",
                  }}
                >
                  <Icon
                    name="SharedOutlined"
                    size="xsmall"
                    color="ds.text.neutral.quiet"
                  />
                </span>
              ) : null}
              {autoProtected ? (
                <span
                  role="img"
                  aria-hidden
                  data-testid="credential-info-autoprotect-status-icon"
                  sx={{
                    marginLeft: "5px",
                  }}
                >
                  <Icon
                    name="LockOutlined"
                    size="xsmall"
                    color="ds.text.neutral.quiet"
                  />
                </span>
              ) : null}
            </>
          ) : null}
        </span>
        {loginText ? (
          <Paragraph
            data-testid="credential-info-login-text"
            color="ds.text.neutral.quiet"
            textStyle="ds.body.reduced.regular"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {loginText}
          </Paragraph>
        ) : null}
        {children}
      </span>
    </div>
  );
};
export const CredentialInfo = memo(RawCredentialInfo);
