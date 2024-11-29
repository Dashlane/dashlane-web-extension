import { ReactNode } from "react";
import { Icon, mergeSx, Paragraph } from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import { ItemType } from "@dashlane/hermes";
import {
  Address,
  Company,
  Email,
  Identity,
  Phone,
  vaultItemsCrudApi,
  VaultItemType,
  Website,
} from "@dashlane/vault-contracts";
import { NamedRoutes } from "../../app/routes/types";
import { TranslatorInterface } from "../../libs/i18n/types";
import useTranslate from "../../libs/i18n/useTranslate";
import { logSelectPersonalInfo } from "../../libs/logs/events/vault/select-item";
import { Link, useRouterGlobalSettingsContext } from "../../libs/router";
import { EmptyView } from "../empty-view/empty-view";
import GridView, { GridData } from "../grid-view";
import PersonalInfoIcon, { IconSize, IconType } from "../personal-info-icon";
import {
  getIdentityItemFullName,
  getPhoneItemName,
  getViewedAddressSecondLine,
  getViewedIdentitySecondLine,
} from "./services";
import { CategoryKey, CategoryStates } from "./types";
import { SX_STYLES } from "../grid-view/styles";
import { PersonalInfoHeader } from "./personal-info-header";
import { BaseLayout } from "../layout/base-layout";
import { EmptyStateHeader } from "../empty-state/shared/empty-state-header";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { PersonalInfoEmptyState } from "./empty-state/personal-info-empty-state";
interface Props {
  categoryStates: CategoryStates;
  currentSpaceId: string | null;
  onToggleGrid: (key: CategoryKey) => void;
}
const I18N_KEYS = {
  TITLE: "webapp_personal_info_empty_view_title",
  DESCRIPTION: "webapp_personal_info_empty_view_description",
  IDENTITIES: "personal_info_grid_category_identities",
  EMAILS: "personal_info_grid_category_emails",
  PHONES: "personal_info_grid_category_phones",
  ADDRESSES: "personal_info_grid_category_addresses",
  COMPANIES: "personal_info_grid_category_companies",
  PERSONAL_WEBSITES: "personal_info_grid_category_personalWebsites",
  EMPTY_STATE_PAGE_TITLE: "webapp_personal_info_empty_state_page_title",
};
const getIcon = (iconType: IconType): JSX.Element => (
  <PersonalInfoIcon iconType={iconType} iconSize={IconSize.largeIcon} />
);
interface GridPersonalItemProps {
  id: string;
  icon: ReactNode;
  title: string;
  text: string;
  onClick: () => void;
  to: string;
}
const GridItemPersonalInfo = ({
  id,
  icon,
  title,
  text,
  onClick,
  to,
}: GridPersonalItemProps) => {
  return (
    <Link
      key={id}
      sx={{
        textDecoration: "none",
        outline: "none",
      }}
      to={to}
      onClick={onClick}
    >
      {icon}
      <div
        sx={{
          overflow: "hidden",
        }}
      >
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.catchy"
          sx={mergeSx([
            SX_STYLES.TEXT,
            {
              marginTop: "10px",
              alignItems: "center",
            },
          ])}
        >
          {title}
        </Paragraph>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
          sx={mergeSx([
            SX_STYLES.TEXT,
            {
              marginTop: "10px",
            },
          ])}
        >
          {text}
        </Paragraph>
      </div>
    </Link>
  );
};
const renderAddress = (
  routes: NamedRoutes,
  address: Address,
  translate: TranslatorInterface
) => (
  <GridItemPersonalInfo
    key={address.id}
    id={address.id}
    icon={getIcon(IconType.address)}
    text={getViewedAddressSecondLine(
      address.city,
      address.country,
      address.streetName,
      address.zipCode,
      translate
    )}
    title={address.itemName}
    onClick={() => {
      logSelectPersonalInfo(address.id, ItemType.Address);
    }}
    to={routes.userPersonalInfoAddress(address.id)}
  />
);
const renderCompany = (routes: NamedRoutes, company: Company) => (
  <GridItemPersonalInfo
    key={company.id}
    id={company.id}
    icon={getIcon(IconType.company)}
    text={company.jobTitle}
    title={company.companyName}
    onClick={() => {
      logSelectPersonalInfo(company.id, ItemType.Company);
    }}
    to={routes.userPersonalInfoCompany(company.id)}
  />
);
const renderEmail = (routes: NamedRoutes, email: Email) => (
  <GridItemPersonalInfo
    key={email.id}
    id={email.id}
    icon={getIcon(email.type === "PRO" ? IconType.emailPro : IconType.email)}
    text={email.emailAddress}
    title={email.itemName}
    onClick={() => {
      logSelectPersonalInfo(email.id, ItemType.Email);
    }}
    to={routes.userPersonalInfoEmail(email.id)}
  />
);
const renderIdentity = (
  routes: NamedRoutes,
  identity: Identity,
  translate: TranslatorInterface
) => (
  <GridItemPersonalInfo
    key={identity.id}
    id={identity.id}
    icon={getIcon(IconType.identity)}
    text={getViewedIdentitySecondLine(
      identity.birthDate,
      identity.birthPlace,
      translate
    )}
    title={getIdentityItemFullName(identity)}
    onClick={() => {
      logSelectPersonalInfo(identity.id, ItemType.Identity);
    }}
    to={routes.userPersonalInfoIdentity(identity.id)}
  />
);
const renderWebsite = (routes: NamedRoutes, website: Website) => (
  <GridItemPersonalInfo
    key={website.id}
    id={website.id}
    icon={getIcon(IconType.website)}
    text={website.URL}
    title={website.itemName}
    onClick={() => {
      logSelectPersonalInfo(website.id, ItemType.Website);
    }}
    to={routes.userPersonalInfoWebsite(website.id)}
  />
);
const renderPhone = (
  routes: NamedRoutes,
  phone: Phone,
  translate: TranslatorInterface
) => (
  <GridItemPersonalInfo
    key={phone.id}
    id={phone.id}
    icon={getIcon(IconType.phone)}
    text={phone.phoneNumber}
    title={getPhoneItemName(phone, translate)}
    onClick={() => {
      logSelectPersonalInfo(phone.id, ItemType.Phone);
    }}
    to={routes.userPersonalInfoPhone(phone.id)}
  />
);
type PersonalData = {
  addresses: Address[];
  companies: Company[];
  emails: Email[];
  identities: Identity[];
  phones: Phone[];
  websites: Website[];
};
const getData = (
  categoryStates: CategoryStates,
  personalItems: PersonalData,
  routes: NamedRoutes,
  translate: TranslatorInterface
): GridData<Address | Company | Email | Identity | Phone | Website>[] => {
  const { addresses, companies, emails, identities, websites, phones } =
    personalItems;
  return [
    {
      key: "identities",
      open: categoryStates["identities"].open,
      title: `${translate(I18N_KEYS.IDENTITIES)} (${identities.length})`,
      items: identities,
      render: (item: Identity) => renderIdentity(routes, item, translate),
      getKey: (item: Identity) => item.id,
    },
    {
      key: "emails",
      open: categoryStates["emails"].open,
      title: `${translate(I18N_KEYS.EMAILS)} (${emails.length})`,
      items: emails,
      render: (item: Email) => renderEmail(routes, item),
      getKey: (item: Email) => item.id,
    },
    {
      key: "phones",
      open: categoryStates["phones"].open,
      title: `${translate(I18N_KEYS.PHONES)} (${phones.length})`,
      items: phones,
      render: (item: Phone) => renderPhone(routes, item, translate),
      getKey: (item: Phone) => item.id,
    },
    {
      key: "addresses",
      open: categoryStates["addresses"].open,
      title: `${translate(I18N_KEYS.ADDRESSES)} (${addresses.length})`,
      items: addresses,
      render: (item: Address) => renderAddress(routes, item, translate),
      getKey: (item: Address) => item.id,
    },
    {
      key: "companies",
      open: categoryStates["companies"].open,
      title: `${translate(I18N_KEYS.COMPANIES)} (${companies.length})`,
      items: companies,
      render: (item: Company) => renderCompany(routes, item),
      getKey: (item: Company) => item.id,
    },
    {
      key: "personalWebsites",
      open: categoryStates["personalWebsites"].open,
      title: `${translate(I18N_KEYS.PERSONAL_WEBSITES)} (${websites.length})`,
      items: websites,
      render: (item: Website) => renderWebsite(routes, item),
      getKey: (item: Website) => item.id,
    },
  ].filter((c) => c.items.length > 0);
};
export const Content = ({
  onToggleGrid,
  categoryStates,
  currentSpaceId,
}: Props) => {
  const emptyStateBatch1FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch1
  );
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [
      VaultItemType.Address,
      VaultItemType.Company,
      VaultItemType.Email,
      VaultItemType.Identity,
      VaultItemType.Phone,
      VaultItemType.Website,
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
    },
  });
  if (
    status !== DataStatus.Success ||
    !Object.values(data).some((idDataResult) => idDataResult.matchCount > 0)
  ) {
    return (
      <BaseLayout
        header={
          emptyStateBatch1FeatureFlip ? (
            <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
          ) : (
            <PersonalInfoHeader />
          )
        }
      >
        {emptyStateBatch1FeatureFlip ? (
          <PersonalInfoEmptyState />
        ) : (
          <EmptyView
            icon={
              <Icon
                name="UsersOutlined"
                color="ds.text.neutral.standard"
                sx={{ width: "64px", minWidth: "64px", height: "64px" }}
              />
            }
            title={translate(I18N_KEYS.TITLE)}
          >
            <Paragraph color="ds.text.neutral.standard">
              {translate(I18N_KEYS.DESCRIPTION)}
            </Paragraph>
          </EmptyView>
        )}
      </BaseLayout>
    );
  }
  const gridData = getData(
    categoryStates,
    {
      addresses: data.addressesResult.items,
      companies: data.companiesResult.items,
      emails: data.emailsResult.items,
      identities: data.identitiesResult.items,
      phones: data.phonesResult.items,
      websites: data.websitesResult.items,
    },
    routes,
    translate
  );
  return (
    <BaseLayout header={<PersonalInfoHeader />}>
      <GridView
        data={gridData}
        onToggleGrid={onToggleGrid}
        sxProps={{
          width: "160px",
          padding: "32px 64px 32px 0",
          position: "relative",
          boxSizing: "content-box",
        }}
      />
    </BaseLayout>
  );
};
