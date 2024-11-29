import { ChangeEventHandler } from "react";
import { Button, SearchField } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  DOWNLOAD_CSV_BUTTON: "team_activity_download_button",
  FILTERS_LABEL_USER_LOGIN: "team_activity_filters_label_user_login",
};
interface Props {
  userFilter: string;
  startDownload: () => void;
  areFiltersLocked: boolean;
  handleChangeUser: ChangeEventHandler<HTMLInputElement>;
}
export const ActivityLogsFilterHeader = ({
  startDownload,
  areFiltersLocked,
  userFilter,
  handleChangeUser,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}
    >
      <SearchField
        label={translate(I18N_KEYS.FILTERS_LABEL_USER_LOGIN)}
        onChange={handleChangeUser}
        value={userFilter}
        sx={{ width: "350px" }}
      />
      <Button
        onClick={startDownload}
        disabled={areFiltersLocked}
        layout="iconLeading"
        icon="DownloadOutlined"
      >
        {translate(I18N_KEYS.DOWNLOAD_CSV_BUTTON)}
      </Button>
    </div>
  );
};
