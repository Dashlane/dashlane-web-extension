import { DLogo } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Logo } from "@dashlane/design-system";
export interface TeamAdminSidenavHeaderProps {
  isCollapsed?: boolean;
}
const I18N_KEYS = {
  DASHLANE_LOGO_TITLE: "_common_dashlane_logo_title",
};
export const TeamAdminSidenavHeader = ({
  isCollapsed = false,
}: TeamAdminSidenavHeaderProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        width: isCollapsed ? "96px" : "256px",
      }}
    >
      <div
        data-testid="logo-header"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isCollapsed ? "center" : "baseline",
          padding: isCollapsed ? "none" : "20px 24px",
          justifyContent: "center",
          height: "80px !important",
          borderBottom: "1px solid ds.border.neutral.quiet.idle !important",
        }}
      >
        {isCollapsed ? (
          <div sx={{ position: "relative", right: "3px" }}>
            <DLogo color={"ds.text.inverse.catchy"} height={39} width={39} />
          </div>
        ) : (
          <Logo
            height={40}
            name="DashlaneLockup"
            title={translate(I18N_KEYS.DASHLANE_LOGO_TITLE)}
            color="ds.text.inverse.catchy"
          />
        )}
      </div>
    </div>
  );
};
