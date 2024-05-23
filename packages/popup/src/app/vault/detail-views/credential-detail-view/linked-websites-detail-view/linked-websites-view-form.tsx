import React, { memo } from 'react';
import classNames from 'classnames';
import { colors, LockIcon } from '@dashlane/ui-components';
import { Credential } from '@dashlane/vault-contracts';
import { ParsedURL } from '@dashlane/url-parser';
import { openExternalUrl } from 'src/libs/externalUrls';
import useTranslate from 'libs/i18n/useTranslate';
import { OpenWebsiteIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/open-website-icon-button';
import { openCredentialWebsite } from 'src/app/vault/detail-views/helpers';
import styles from 'src/app/vault/detail-views/credential-detail-view/linked-websites-detail-view/linked-websites-view.css';
export const I18N_KEYS = {
    PRIMARY: 'tab/all_items/credential/linked_websites_view/label/primary',
    ADDED_BY_YOU: 'tab/all_items/credential/linked_websites_view/label/added_by_user',
    ADDED_BY_DASHLANE: 'tab/all_items/credential/linked_websites_view/label/added_by_dashlane',
    WEBSITE_OPEN: 'tab/all_items/credential/view/action/go_to_website',
    WEBSITE_OPEN_A11Y: 'tab/all_items/credential/view/action/go_to_website_a11y',
};
interface LinkedWebsitesViewFormProps {
    credential: Credential;
    dashlaneDefinedLinkedWebsites: string[];
}
const LinkedWebsitesViewFormComponent = ({ credential, dashlaneDefinedLinkedWebsites, }: LinkedWebsitesViewFormProps) => {
    const { translate } = useTranslate();
    const rootDomainOfPrimaryWebsite = new ParsedURL(credential.URL).getRootDomain();
    const labelPrimary = translate(I18N_KEYS.PRIMARY).toLocaleUpperCase();
    const labelAddedByYou = translate(I18N_KEYS.ADDED_BY_YOU).toLocaleUpperCase();
    const labelAddedByDashlane = translate(I18N_KEYS.ADDED_BY_DASHLANE).toLocaleUpperCase();
    return (<div className={styles.viewContainer} data-testid="linked_websites_view">
      <div className={styles.container}>
        <label className={styles.inputContainer}>
          <span className={styles.label}>{labelPrimary}</span>
          <input aria-label={translate(I18N_KEYS.PRIMARY)} className={styles.text} value={rootDomainOfPrimaryWebsite} readOnly={true}/>
        </label>
        <div className={styles.button}>
          <OpenWebsiteIconButton text={translate(I18N_KEYS.WEBSITE_OPEN)} onClick={() => {
            void openCredentialWebsite(credential.id, credential.URL);
        }} ariaLabel={translate(I18N_KEYS.WEBSITE_OPEN_A11Y, {
            value: rootDomainOfPrimaryWebsite,
        })}/>
        </div>
      </div>

      {credential.linkedURLs.length > 0 ? (<div className={styles.container}>
          <label className={styles.inputContainer}>
            <span className={styles.label}>{labelAddedByYou}</span>
            {credential.linkedURLs.map((website: string, index: number) => {
                const parsedUrl = new ParsedURL(website);
                const rootDomain = parsedUrl.getRootDomain();
                return (<div key={index} className={styles.website}>
                  <input aria-label={translate(I18N_KEYS.ADDED_BY_YOU)} className={classNames([styles.text, styles.editableItem])} value={rootDomain} readOnly={true}/>
                  <div className={styles.button} data-testid={'open_linked_website'}>
                    <OpenWebsiteIconButton text={translate(I18N_KEYS.WEBSITE_OPEN)} onClick={() => {
                        void openExternalUrl(parsedUrl.getUrlWithFallbackHttpsProtocol());
                    }} ariaLabel={translate(I18N_KEYS.WEBSITE_OPEN_A11Y, {
                        value: rootDomain,
                    })}/>
                  </div>
                </div>);
            })}
          </label>
        </div>) : null}

      {dashlaneDefinedLinkedWebsites.length > 1 ? (<div className={styles.container}>
          <label className={styles.inputContainer}>
            <div className={styles.labelContainer}>
              <LockIcon size={15} color={colors.grey00} className={styles.lockIcon}/>
              <span className={styles.label}>{labelAddedByDashlane}</span>
            </div>
            {dashlaneDefinedLinkedWebsites.map((website: string, index: number) => {
                const parsedUrl = new ParsedURL(website);
                return (<div key={index} className={styles.website}>
                    <input aria-label={translate(I18N_KEYS.ADDED_BY_DASHLANE)} className={classNames([styles.text, styles.lockedItem])} value={website} readOnly={true}/>
                    <div className={styles.button}>
                      <OpenWebsiteIconButton text={translate(I18N_KEYS.WEBSITE_OPEN)} onClick={() => {
                        void openExternalUrl(parsedUrl.getUrlWithFallbackHttpsProtocol());
                    }} ariaLabel={translate(I18N_KEYS.WEBSITE_OPEN_A11Y, {
                        value: website,
                    })}/>
                    </div>
                  </div>);
            })}
          </label>
        </div>) : null}
    </div>);
};
export const LinkedWebsitesFormView = memo(LinkedWebsitesViewFormComponent);
