import {
  Flex,
  Icon,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { BlockQuote } from "../../../../libs/dashlane-style/block-quote/block-quote";
import { fromUnixTime } from "date-fns";
import { LOCALE_FORMAT } from "../../../../libs/i18n/helpers";
const I18N_KEYS = {
  SCIM_LAST_SYNC: "team_settings_directory_sync_last_sync",
  SCIM_SYNC_NOT_AVAILABLE: "team_settings_directory_sync_not_available",
  REFRESH: "team_settings_scim_sync_refresh",
  NOT_AVAILABLE: "team_settings_encryption_service_not_available",
  VERSION: "team_settings_encryption_service_version",
};
interface SCIMSyncStatusProps {
  lastSyncUnix?: number | null;
  version?: string | null;
  loading: boolean;
  refreshData: () => void;
}
export const SCIMSyncStatus = ({
  lastSyncUnix,
  version,
  loading,
  refreshData,
}: SCIMSyncStatusProps) => {
  const { translate } = useTranslate();
  return (
    <BlockQuote>
      {loading ? (
        <IndeterminateLoader />
      ) : (
        <Flex flexDirection="column" gap="5px">
          <Paragraph
            textStyle="ds.body.reduced.regular"
            color="ds.text.neutral.standard"
          >
            {`${translate(I18N_KEYS.SCIM_LAST_SYNC)} ${
              lastSyncUnix
                ? fromUnixTime(lastSyncUnix).toLocaleString(
                    navigator.language,
                    {
                      ...LOCALE_FORMAT.lll,
                      timeZoneName: "short",
                    }
                  )
                : translate(I18N_KEYS.SCIM_SYNC_NOT_AVAILABLE)
            }`}
          </Paragraph>
          <Paragraph
            textStyle="ds.body.reduced.regular"
            color="ds.text.neutral.standard"
          >
            {`${translate(I18N_KEYS.VERSION)} ${
              version ?? translate(I18N_KEYS.NOT_AVAILABLE)
            }`}
          </Paragraph>
          <Paragraph
            as="a"
            color="ds.text.brand.standard"
            sx={{
              textDecoration: "none",
              fontWeight: "normal",
              display: "flex",
              flexDirection: "row",
            }}
            onClick={() => refreshData()}
          >
            <Icon
              name="ActionRefreshOutlined"
              sx={{ marginRight: "5px" }}
              color="ds.text.brand.standard"
              size="xsmall"
            />
            {translate(I18N_KEYS.REFRESH)}
          </Paragraph>
        </Flex>
      )}
    </BlockQuote>
  );
};
