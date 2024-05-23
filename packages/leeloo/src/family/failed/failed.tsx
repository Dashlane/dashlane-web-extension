import * as React from 'react';
import { JoinFamilyError } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { JoinFamily } from 'family/join/join';
import sharedStyles from '../shared/styles.css';
interface FailedProps {
    errorCode: JoinFamilyError;
}
export const Failed = ({ errorCode }: FailedProps) => {
    const { translate } = useTranslate();
    const renderHeading = (errorCode: JoinFamilyError) => errorCode === 'FAMILY_FULL' || errorCode === 'JOIN_FAMILY_TOKEN_NOT_FOUND'
        ? translate('family_invitee_page_failed_heading_link_expired_plan_full')
        : translate('family_invitee_page_failed_heading');
    const renderDescription = (errorCode: JoinFamilyError) => errorCode === 'FAMILY_FULL' || errorCode === 'JOIN_FAMILY_TOKEN_NOT_FOUND'
        ? translate('family_invitee_page_failed_heading_link_expired_plan_full_description')
        : translate('family_invitee_page_failed_description');
    return (<JoinFamily>
      <div className={sharedStyles.joinFamilyRow}>
        <div className={sharedStyles.joinFamilyColumn}>
          <h1 className={sharedStyles.title}>{renderHeading(errorCode)}</h1>
          <p className={sharedStyles.description}>
            {renderDescription(errorCode)}
          </p>
        </div>
        <div className={sharedStyles.joinFamilyColumn}/>
      </div>
    </JoinFamily>);
};
