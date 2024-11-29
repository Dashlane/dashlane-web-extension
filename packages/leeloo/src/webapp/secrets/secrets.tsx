import { useEffect, useMemo, useState } from "react";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import {
  DataStatus,
  useFeatureFlip,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { SecretSortField } from "@dashlane/communication";
import { PageView } from "@dashlane/hermes";
import {
  secureFilesApi,
  SortDirection,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { logPageView } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import { OrderDir } from "../../libs/sortHelper";
import { SECRETS_LIST_PREFERENCES } from "../../libs/localstorage-constants";
import { PersonalDataSectionView } from "../personal-data-section-view/personal-data-section-view";
import { SortingOptions } from "../list-view/types";
import { Header as ListHeader } from "../list-view/header";
import {
  UpgradeNoticeBanner,
  UpgradeNoticeType,
} from "../credentials/header/upgrade-notice-banner";
import { SecretsHeader } from "./header/secrets-header";
import styles from "./styles.css";
import { SecretsList } from "./list/secrets-list";
import { BaseLayout } from "../layout/base-layout";
import { EmptyStateHeader } from "../empty-state/shared/empty-state-header";
import { useTeamSpaceContext } from "../../team/settings/components/TeamSpaceContext";
const I18N_KEYS = {
  HEADER_NAME: "webapp_secure_notes_list_header_name",
  HEADER_CREATED: "webapp_secure_notes_list_header_created",
  HEADER_UPDATED: "webapp_secure_notes_list_header_updated",
  EMPTY_STATE_PAGE_TITLE: "webapp_secrets_empty_state_page_title",
};
export interface State {
  sortingOptions: SortingOptions<SecretSortField>;
}
export const Secrets = () => {
  const { currentSpaceId } = useTeamSpaceContext();
  const { translate } = useTranslate();
  const [sortingOptions, setSortingOptions] = useState<SortingOptions>({
    field: "title",
    direction: OrderDir.ascending,
  });
  const emptyStateBatch2FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch2
  );
  const header = useMemo(() => {
    return [
      {
        key: "title",
        sortable: true,
        content: translate(I18N_KEYS.HEADER_NAME),
        logSubaction: "name",
      },
      {
        key: "createdAt",
        sortable: true,
        content: translate(I18N_KEYS.HEADER_CREATED),
        className: styles.created,
        logSubaction: "creationDate",
      },
      {
        key: "updatedAt",
        sortable: true,
        content: translate(I18N_KEYS.HEADER_UPDATED),
        className: styles.updated,
        logSubaction: "lastUpdated",
      },
    ];
  }, [translate]);
  const sortCriteria = useMemo((): SortingOptions[] => {
    const { field } = sortingOptions;
    const fixedField = header.map((h) => h.key).includes(field)
      ? (field as SecretSortField)
      : "title";
    const baseOptions: SortingOptions[] = [
      {
        direction: sortingOptions.direction,
        field: fixedField,
      },
    ];
    return baseOptions;
  }, [header, sortingOptions]);
  const { fetchSecureFileQuota } = useModuleCommands(secureFilesApi);
  const { data: secretsData, status } = useModuleQuery(
    vaultItemsCrudApi,
    "query",
    {
      vaultItemTypes: [VaultItemType.Secret],
      propertyFilters:
        currentSpaceId !== null
          ? [
              {
                property: "spaceId",
                value: currentSpaceId,
              },
            ]
          : undefined,
      propertySorting: {
        property: sortCriteria[0].field,
        direction:
          sortCriteria[0]?.direction === OrderDir.ascending
            ? SortDirection.Ascend
            : SortDirection.Descend,
      },
    }
  );
  const restoreFromStorage = () => {
    const preferences = localStorage.getItem(SECRETS_LIST_PREFERENCES);
    try {
      if (preferences) {
        const storedSorting = JSON.parse(preferences);
        setSortingOptions(storedSorting.sortingOptions);
      }
    } catch (err) {}
  };
  useEffect(() => {
    restoreFromStorage();
    void fetchSecureFileQuota();
    logPageView(PageView.ItemSecretList);
  }, []);
  if (status !== DataStatus.Success) {
    return null;
  }
  const secrets = secretsData?.secretsResult.items ?? [];
  const totalSecretsCount = secrets.length ?? 0;
  const saveToStorage = (state: State) => {
    localStorage.setItem(SECRETS_LIST_PREFERENCES, JSON.stringify(state));
  };
  const sortSecrets = (sortingOptions: SortingOptions<SecretSortField>) => {
    setSortingOptions(sortingOptions);
    saveToStorage({ sortingOptions });
  };
  const onSort = (sortingOptions: SortingOptions<SecretSortField>) => {
    sortSecrets(sortingOptions);
  };
  return (
    <PersonalDataSectionView>
      <BaseLayout
        header={
          !totalSecretsCount && emptyStateBatch2FeatureFlip ? (
            <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
          ) : (
            <SecretsHeader totalSecretsCount={totalSecretsCount} />
          )
        }
      >
        <UpgradeNoticeBanner
          customSx={{ marginBottom: "8px" }}
          noticeType={UpgradeNoticeType.SecureNotes}
        />

        <SecretsList
          header={
            <ListHeader
              header={header}
              onSort={onSort}
              options={sortingOptions}
            />
          }
          className={styles.list}
          secrets={secrets}
        />
      </BaseLayout>
    </PersonalDataSectionView>
  );
};
