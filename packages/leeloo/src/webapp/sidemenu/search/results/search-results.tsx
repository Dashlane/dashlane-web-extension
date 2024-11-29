import {
  Address,
  BankAccount,
  Company,
  Credential,
  DriversLicense,
  Email,
  FiscalId,
  IdCard,
  Identity,
  Passport,
  PaymentCard,
  Phone,
  SecureNote,
  SocialSecurityId,
  VaultItem,
  VaultItemType,
  Website,
} from "@dashlane/vault-contracts";
import { ItemType } from "@dashlane/hermes";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { Lee } from "../../../../lee";
import useTranslate from "../../../../libs/i18n/useTranslate";
import SearchEventLogger from "../search-event-logger";
import { useItemSearchData } from "./use-item-search-data";
import {
  idToItemType,
  logSelectBankAccount,
  logSelectCredential,
  logSelectCreditCard,
  logSelectId,
  logSelectPersonalInfo,
  logSelectSecureNote,
} from "../../../../libs/logs/events/vault/select-item";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
import {
  getIdentityItemFullName,
  getPhoneItemName,
  getViewedAddressSecondLine,
  getViewedIdentitySecondLine,
} from "../../../personal-info/services";
import {
  BankAccountSearchItem,
  CredentialSearchItem,
  IdSearchItem,
  NoteSearchItem,
  PaymentCardSearchItem,
  PersonalInfoSearchItem,
} from "../items";
import PersonalInfoIcon, {
  IconSize,
  IconType,
} from "../../../personal-info-icon";
import { LoadMore } from "./load-more";
import styles from "../styles.css";
import {
  getPrimaryDisplayDataForIdDocument,
  getSecondaryDisplayDataForIdDocument,
} from "./sections/identity-documents/id-document";
import { useFeatureFlip } from "@dashlane/framework-react";
import { Credentials } from "./sections/credentials";
import { Notes } from "./sections/notes";
import { Identities } from "./sections/identities";
import { Emails } from "./sections/emails";
import { Phones } from "./sections/phones";
import { Addresses } from "./sections/addresses";
import { Companies } from "./sections/companies";
import { BankAccounts } from "./sections/bank-accounts";
import { IdDocuments } from "./sections/identity-documents";
import { PaymentCards } from "./sections/payment-cards";
import { PersonalWebsites } from "./sections/personal-websites";
export interface Props {
  lee: Lee;
  query: string;
}
export interface ItemProps {
  item: VaultItem;
  lee: Lee;
  index: number;
  matchCount: number;
}
const Item = (props: ItemProps) => {
  const { item, lee, index, matchCount } = props;
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  if (item.kwType === VaultItemType.Address) {
    const address = item as Address;
    <PersonalInfoSearchItem
      icon={
        <PersonalInfoIcon
          iconType={IconType.address}
          iconSize={IconSize.smallIcon}
        />
      }
      key={address.id}
      text={getViewedAddressSecondLine(
        address.city,
        address.country,
        address.streetName,
        address.zipCode,
        translate
      )}
      title={address.itemName}
      detailRoute={routes.userPersonalInfoAddress(address.id)}
      onSelectPersonalInfo={() => {
        SearchEventLogger.logSearchEvent();
        logSelectPersonalInfo(
          address.id,
          ItemType.Address,
          index + 1,
          matchCount
        );
      }}
    />;
  }
  if (item.kwType === VaultItemType.BankAccount) {
    const bankAccount = item as BankAccount;
    <BankAccountSearchItem
      key={bankAccount.id}
      bankAccount={bankAccount}
      getRoute={routes.userBankAccount}
      onSelectBankAccount={() => {
        SearchEventLogger.logSearchEvent();
        logSelectBankAccount(bankAccount.id, index + 1, matchCount);
      }}
    />;
  }
  if (item.kwType === VaultItemType.Company) {
    const company = item as Company;
    <PersonalInfoSearchItem
      icon={
        <PersonalInfoIcon
          iconType={IconType.company}
          iconSize={IconSize.smallIcon}
        />
      }
      key={company.id}
      text={company.jobTitle}
      title={company.companyName}
      detailRoute={routes.userPersonalInfoCompany(company.id)}
      onSelectPersonalInfo={() => {
        SearchEventLogger.logSearchEvent();
        logSelectPersonalInfo(
          company.id,
          ItemType.Company,
          index + 1,
          matchCount
        );
      }}
    />;
  }
  if (item.kwType === VaultItemType.Credential) {
    const credential = item as Credential;
    return (
      <CredentialSearchItem
        lee={lee}
        credential={credential}
        key={credential.id}
        onSelectCredential={() => {
          SearchEventLogger.logSearchEvent();
          logSelectCredential(credential.id, index + 1, matchCount);
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.DriversLicense) {
    const driversLicense = item as DriversLicense;
    return (
      <IdSearchItem
        key={driversLicense.id}
        itemId={driversLicense.id}
        type={VaultItemType.DriversLicense}
        country={driversLicense.country}
        primaryDisplayData={getPrimaryDisplayDataForIdDocument(
          VaultItemType.DriversLicense,
          driversLicense,
          translate
        )}
        secondaryDisplayData={getSecondaryDisplayDataForIdDocument(
          VaultItemType.DriversLicense,
          driversLicense,
          translate
        )}
        idNumber={driversLicense["idNumber"]}
        route={routes.userEditIdDocument(
          VaultItemType.DriversLicense,
          driversLicense.id
        )}
        onSelectId={() => {
          SearchEventLogger.logSearchEvent();
          logSelectId(
            driversLicense.id,
            idToItemType[VaultItemType.DriversLicense],
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.Email) {
    const email = item as Email;
    return (
      <PersonalInfoSearchItem
        icon={
          <PersonalInfoIcon
            iconType={email.type === "PRO" ? IconType.emailPro : IconType.email}
            iconSize={IconSize.smallIcon}
          />
        }
        key={email.id}
        text={email.emailAddress}
        title={email.itemName}
        detailRoute={routes.userPersonalInfoEmail(email.id)}
        onSelectPersonalInfo={() => {
          SearchEventLogger.logSearchEvent();
          logSelectPersonalInfo(
            email.id,
            ItemType.Email,
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.IdCard) {
    const idCard = item as IdCard;
    return (
      <IdSearchItem
        key={idCard.id}
        itemId={idCard.id}
        type={VaultItemType.IdCard}
        country={idCard.country}
        primaryDisplayData={getPrimaryDisplayDataForIdDocument(
          VaultItemType.IdCard,
          idCard,
          translate
        )}
        secondaryDisplayData={getSecondaryDisplayDataForIdDocument(
          VaultItemType.IdCard,
          idCard,
          translate
        )}
        idNumber={idCard["idNumber"]}
        route={routes.userEditIdDocument(VaultItemType.IdCard, idCard.id)}
        onSelectId={() => {
          SearchEventLogger.logSearchEvent();
          logSelectId(
            idCard.id,
            idToItemType[VaultItemType.IdCard],
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.Identity) {
    const identity = item as Identity;
    <PersonalInfoSearchItem
      icon={
        <PersonalInfoIcon
          iconType={IconType.identity}
          iconSize={IconSize.smallIcon}
        />
      }
      key={identity.id}
      text={getViewedIdentitySecondLine(
        identity.birthDate,
        identity.birthPlace,
        translate
      )}
      title={getIdentityItemFullName(identity)}
      detailRoute={routes.userPersonalInfoIdentity(identity.id)}
      onSelectPersonalInfo={() => {
        SearchEventLogger.logSearchEvent();
        logSelectPersonalInfo(
          identity.id,
          ItemType.Identity,
          index + 1,
          matchCount
        );
      }}
    />;
  }
  if (item.kwType === VaultItemType.Passkey) {
  }
  if (item.kwType === VaultItemType.Passport) {
    const passport = item as Passport;
    return (
      <IdSearchItem
        key={passport.id}
        itemId={passport.id}
        type={VaultItemType.Passport}
        country={passport.country}
        primaryDisplayData={getPrimaryDisplayDataForIdDocument(
          VaultItemType.Passport,
          passport,
          translate
        )}
        secondaryDisplayData={getSecondaryDisplayDataForIdDocument(
          VaultItemType.Passport,
          passport,
          translate
        )}
        idNumber={passport["idNumber"]}
        route={routes.userEditIdDocument(VaultItemType.Passport, passport.id)}
        onSelectId={() => {
          SearchEventLogger.logSearchEvent();
          logSelectId(
            passport.id,
            idToItemType[VaultItemType.Passport],
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.PaymentCard) {
    const paymentCard = item as PaymentCard;
    <PaymentCardSearchItem
      key={paymentCard.id}
      paymentCard={paymentCard}
      getRoute={routes.userPaymentCard}
      onSelectPaymentCard={() => {
        SearchEventLogger.logSearchEvent();
        logSelectCreditCard(paymentCard.id, index + 1, matchCount);
      }}
    />;
  }
  if (item.kwType === VaultItemType.Phone) {
    const phone = item as Phone;
    return (
      <PersonalInfoSearchItem
        icon={
          <PersonalInfoIcon
            iconType={IconType.phone}
            iconSize={IconSize.smallIcon}
          />
        }
        key={phone.id}
        text={phone.phoneNumber}
        title={getPhoneItemName(phone, translate)}
        detailRoute={routes.userPersonalInfoPhone(phone.id)}
        onSelectPersonalInfo={() => {
          SearchEventLogger.logSearchEvent();
          logSelectPersonalInfo(
            phone.id,
            ItemType.Phone,
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.FiscalId) {
    const fiscalId = item as FiscalId;
    return (
      <IdSearchItem
        key={fiscalId.id}
        itemId={fiscalId.id}
        type={VaultItemType.FiscalId}
        country={fiscalId.country}
        primaryDisplayData={getPrimaryDisplayDataForIdDocument(
          VaultItemType.FiscalId,
          fiscalId,
          translate
        )}
        secondaryDisplayData={getSecondaryDisplayDataForIdDocument(
          VaultItemType.FiscalId,
          fiscalId,
          translate
        )}
        idNumber={fiscalId["fiscalNumber"]}
        route={routes.userEditIdDocument(VaultItemType.FiscalId, fiscalId.id)}
        onSelectId={() => {
          SearchEventLogger.logSearchEvent();
          logSelectId(
            fiscalId.id,
            idToItemType[VaultItemType.FiscalId],
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.SecureNote) {
    const note = item as SecureNote;
    <NoteSearchItem
      detailRoute={routes.userSecureNote(note.id)}
      key={note.id}
      note={note}
      onSelectNote={() => {
        SearchEventLogger.logSearchEvent();
        logSelectSecureNote(note.id, index + 1, matchCount);
      }}
    />;
  }
  if (item.kwType === VaultItemType.Secret) {
  }
  if (item.kwType === VaultItemType.SocialSecurityId) {
    const socialSecurityId = item as SocialSecurityId;
    return (
      <IdSearchItem
        key={socialSecurityId.id}
        itemId={socialSecurityId.id}
        type={VaultItemType.SocialSecurityId}
        country={socialSecurityId.country}
        primaryDisplayData={getPrimaryDisplayDataForIdDocument(
          VaultItemType.SocialSecurityId,
          socialSecurityId,
          translate
        )}
        secondaryDisplayData={getSecondaryDisplayDataForIdDocument(
          VaultItemType.SocialSecurityId,
          socialSecurityId,
          translate
        )}
        idNumber={socialSecurityId["idNumber"]}
        route={routes.userEditIdDocument(
          VaultItemType.SocialSecurityId,
          socialSecurityId.id
        )}
        onSelectId={() => {
          SearchEventLogger.logSearchEvent();
          logSelectId(
            socialSecurityId.id,
            idToItemType[VaultItemType.SocialSecurityId],
            index + 1,
            matchCount
          );
        }}
      />
    );
  }
  if (item.kwType === VaultItemType.Website) {
    const website = item as Website;
    <PersonalInfoSearchItem
      icon={
        <PersonalInfoIcon
          iconType={IconType.website}
          iconSize={IconSize.smallIcon}
        />
      }
      key={website.id}
      text={website.URL}
      title={website.itemName}
      detailRoute={routes.userPersonalInfoWebsite(website.id)}
      onSelectPersonalInfo={() => {
        SearchEventLogger.logSearchEvent();
        logSelectPersonalInfo(
          website.id,
          ItemType.Website,
          index + 1,
          matchCount
        );
      }}
    />;
  }
  return null;
};
export const SearchResults = (props: Props) => {
  const { lee, query } = props;
  const { translate } = useTranslate();
  const hasSearchRevampFF = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.SearchRevamp
  );
  const { loadMore, result } = useItemSearchData<Credential>(
    query,
    VaultItemType.Credential
  );
  if (!result?.matchCount && !!hasSearchRevampFF) {
    return (
      <div className={styles.noResults}>
        {translate("webapp_sidemenu_search_results_empty")}
      </div>
    );
  }
  if (hasSearchRevampFF && result) {
    const { items, matchCount } = result;
    return (
      <>
        <div className={styles.searchResultsList} id="search-results">
          {items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              lee={lee}
              index={index}
              matchCount={matchCount}
            />
          ))}
        </div>
        <LoadMore loadMore={loadMore} remaining={matchCount - items.length} />
      </>
    );
  }
  return (
    <>
      <div className={styles.searchResultsList} id="search-results">
        <Credentials lee={lee} query={query} />
        <Notes query={query} />
        <Identities query={query} />
        <Emails query={query} />
        <Phones query={query} />
        <Addresses query={query} />
        <Companies query={query} />
        <PersonalWebsites query={query} />
        <PaymentCards query={query} />
        <BankAccounts query={query} />
        <IdDocuments query={query} />
      </div>

      <div className={styles.noResults}>
        {translate("webapp_sidemenu_search_results_empty")}
      </div>
    </>
  );
};
