import { Children, ReactNode, useEffect } from "react";
import { Icon } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { Country, CurrentLocationUpdated } from "@dashlane/communication";
import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  DriversLicense,
  FiscalId,
  IdCard,
  Passport,
  SocialSecurityId,
  SortDirection,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { DRIVER_LICENSE_BRITISH_SPELLING_COUNTRIES } from "../helpers";
import { GridView } from "../../components/grid-view/grid-view";
import { EmptyView } from "../../empty-view/empty-view";
import { IdVaultItemType } from "../types";
import {
  DriversLicenseArticle,
  FiscalIdArticle,
  IdCardArticle,
  PassportArticle,
  SocialSecurityIdArticle,
} from "./item-articles";
import { IdsHeader } from "../ids-header";
import { BaseLayout } from "../../layout/base-layout";
import { EmptyStateHeader } from "../../empty-state/shared/empty-state-header";
import { IdsEmptyState } from "../empty-state/ids-empty-state";
const I18N_KEYS = {
  EMPTY_TITLE: "webapp_ids_empty_view_title",
  EMPTY_DESCRIPTION: "webapp_ids_empty_view_description",
  DRIVER_LICENSES_HEADER: "webapp_ids_driver_licences_grid_header_title",
  FISCAL_IDS_HEADER: "webapp_ids_fiscal_ids_grid_header_title",
  ID_CARDS_HEADER: "webapp_ids_id_cards_grid_header_title",
  PASSPORTS_HEADER: "webapp_ids_passports_grid_header_title",
  SOCIAL_SECURITY_IDS_HEADER:
    "webapp_ids_social_security_ids_grid_header_title",
  EMPTY_STATE_PAGE_TITLE: "webapp_ids_empty_state_page_title",
};
const Wrapper = (props: { children: ReactNode }) => {
  return (
    <div
      sx={{
        whiteSpace: "nowrap",
      }}
      data-testid="ids-documents-grid-items"
    >
      {Children.toArray(props.children)}
    </div>
  );
};
const IdsEmptyView = ({
  currentLocation,
}: {
  currentLocation: CurrentLocationUpdated;
}) => {
  const emptyStateBatch1FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch1
  );
  const { translate } = useTranslate();
  return (
    <BaseLayout
      header={
        emptyStateBatch1FeatureFlip ? (
          <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
        ) : (
          <IdsHeader currentLocation={currentLocation} />
        )
      }
    >
      {emptyStateBatch1FeatureFlip ? (
        <IdsEmptyState currentLocation={currentLocation} />
      ) : (
        <EmptyView
          icon={
            <Icon
              name="ItemIdOutlined"
              color="ds.text.neutral.standard"
              sx={{ width: "64px", minWidth: "64px", height: "64px" }}
            />
          }
          title={translate(I18N_KEYS.EMPTY_TITLE)}
        >
          <p>{translate(I18N_KEYS.EMPTY_DESCRIPTION)}</p>
        </EmptyView>
      )}
    </BaseLayout>
  );
};
function getDriverLicenseLabel(
  locale: string,
  country: Country,
  count: number
) {
  if (
    !DRIVER_LICENSE_BRITISH_SPELLING_COUNTRIES.has(country) ||
    locale !== "en"
  ) {
    return null;
  }
  return count === 1 ? "Driver's licence" : `Driver's licences (${count})`;
}
interface IdsContentProps {
  userEditDocumentRoute: (type: IdVaultItemType, id: string) => string;
  currentSpaceId: string | null;
  currentCountry: Country;
  currentLocation: CurrentLocationUpdated;
}
export const IdsContent = ({
  currentSpaceId,
  userEditDocumentRoute,
  currentCountry,
  currentLocation,
}: IdsContentProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logPageView(PageView.ItemIdList);
  }, []);
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [
      VaultItemType.DriversLicense,
      VaultItemType.FiscalId,
      VaultItemType.IdCard,
      VaultItemType.Passport,
      VaultItemType.SocialSecurityId,
    ],
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
      property: "creationDatetime",
      direction: SortDirection.Descend,
    },
  });
  if (
    status !== DataStatus.Success ||
    !Object.values(data).some((idDataResult) => idDataResult.matchCount > 0)
  ) {
    return <IdsEmptyView currentLocation={currentLocation} />;
  }
  const renderIdCard = (item: IdCard) => {
    return (
      <IdCardArticle
        item={item}
        key={item.id}
        route={userEditDocumentRoute(VaultItemType.IdCard, item.id)}
      />
    );
  };
  const renderSocialSecurityId = (item: SocialSecurityId) => {
    return (
      <SocialSecurityIdArticle
        item={item}
        key={item.id}
        route={userEditDocumentRoute(VaultItemType.SocialSecurityId, item.id)}
      />
    );
  };
  const renderDriverLicense = (item: DriversLicense) => {
    return (
      <DriversLicenseArticle
        item={item}
        key={item.id}
        route={userEditDocumentRoute(VaultItemType.DriversLicense, item.id)}
      />
    );
  };
  const renderPassport = (item: Passport) => {
    return (
      <PassportArticle
        item={item}
        key={item.id}
        route={userEditDocumentRoute(VaultItemType.Passport, item.id)}
      />
    );
  };
  const renderFiscalId = (item: FiscalId) => {
    return (
      <FiscalIdArticle
        item={item}
        key={item.id}
        route={userEditDocumentRoute(VaultItemType.FiscalId, item.id)}
      />
    );
  };
  const {
    driversLicensesResult,
    fiscalIdsResult,
    idCardsResult,
    passportsResult,
    socialSecurityIdsResult,
  } = data;
  const idsData = [
    {
      result: idCardsResult,
      key: I18N_KEYS.ID_CARDS_HEADER,
      render: renderIdCard,
    },
    {
      result: socialSecurityIdsResult,
      key: I18N_KEYS.SOCIAL_SECURITY_IDS_HEADER,
      render: renderSocialSecurityId,
    },
    {
      result: driversLicensesResult,
      key: I18N_KEYS.DRIVER_LICENSES_HEADER,
      label: getDriverLicenseLabel(
        translate.getLocale(),
        currentCountry,
        driversLicensesResult.matchCount
      ),
      render: renderDriverLicense,
    },
    {
      result: passportsResult,
      key: I18N_KEYS.PASSPORTS_HEADER,
      render: renderPassport,
    },
    {
      result: fiscalIdsResult,
      key: I18N_KEYS.FISCAL_IDS_HEADER,
      render: renderFiscalId,
    },
  ];
  return (
    <BaseLayout header={<IdsHeader currentLocation={currentLocation} />}>
      <Wrapper>
        {idsData.map(
          ({ label, key, render, result: { matchCount, items } }) => {
            if (!matchCount) {
              return null;
            }
            return (
              <GridView
                key={key}
                headerTitle={
                  label ??
                  translate(key, {
                    count: matchCount,
                  })
                }
                items={items}
                render={render}
              />
            );
          }
        )}
      </Wrapper>
    </BaseLayout>
  );
};
