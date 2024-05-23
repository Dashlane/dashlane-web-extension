import classnames from 'classnames';
import { Fragment, useEffect, useState } from 'react';
import { descend, prop, sortWith } from 'ramda';
import { Button, Heading, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { AlertSeverity, FlexContainer } from '@dashlane/ui-components';
import { Lee, LEE_INCORRECT_AUTHENTICATION } from 'lee';
import { getAuth } from 'user';
import TeamPlans from 'libs/api/TeamPlans';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { getTeamMembers } from 'libs/carbon/triggers';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import setupStyles from 'team/account/setup/style/index.css';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { MemberData } from 'team/members/types';
import { ConfirmDialog } from './confirm-dialog';
import styles from './billing-admin.css';
export interface Props {
    lee: Lee;
}
export const BillingAdmin = ({ lee }: Props) => {
    const { globalState } = lee;
    const [billingAdminLogin, setBillingAdminLogin] = useState('');
    const [allMembersCount, setAllMembersCount] = useState(0);
    const [acceptedMembers, setAcceptedMembers] = useState<MemberData[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const auth = getAuth(globalState);
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const alert = useAlert();
    const showSuccessAlert = () => {
        alert.showAlert(translate('team_account_billing_admin_notification_success'), AlertSeverity.SUCCESS);
    };
    const showFailedAlert = () => {
        alert.showAlert(translate('team_account_billing_admin_notification_something_wrong'), AlertSeverity.ERROR);
    };
    useEffect(() => {
        const fetchMembers = async () => {
            if (!auth?.teamId) {
                return;
            }
            const members = await getTeamMembers({ teamId: auth.teamId });
            const filteredMembers = members.filter((member) => member.status === 'accepted');
            const orderedMembers = sortWith([
                descend(prop('isBillingAdmin')),
                descend(prop('isTeamCaptain')),
            ])(filteredMembers);
            setAcceptedMembers(orderedMembers);
            setAllMembersCount(members.length);
            const admin = orderedMembers[0].login;
            setBillingAdminLogin(admin);
        };
        fetchMembers().catch(reportTACError);
    }, [auth?.teamId]);
    const handleDialogConfirmChange = async (newVal: string) => {
        if (billingAdminLogin === newVal) {
            return;
        }
        setShowConfirm(false);
        logPageView(PageView.TacAccount);
        const latestAuth = getAuth(globalState);
        if (!latestAuth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        try {
            await new TeamPlans().updateBillingAdmin({
                auth: latestAuth,
                newAdminLogin: newVal,
                oldAdminLogin: billingAdminLogin,
            });
            showSuccessAlert();
            setBillingAdminLogin(newVal);
        }
        catch {
            showFailedAlert();
        }
    };
    if (!auth) {
        reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
        return null;
    }
    return (<>
      <FlexContainer gap="16px">
        <Heading color="ds.text.neutral.catchy" as="h2" textStyle="ds.title.section.medium">
          {translate('team_account_heading_billing_admin')}
        </Heading>
        <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
          {translate('team_account_billing_admin_access_information')}
        </Paragraph>
      </FlexContainer>
      <div className={styles.container}>
        <div className={setupStyles.col1}>
          
          <span className={classnames(styles.text, {
            [styles.emptyText]: !billingAdminLogin,
        }, 'automation-tests-tac-billing')}>
            {billingAdminLogin || '████████████████'}
          </span>
        </div>
        <div className={setupStyles.col2}>
          {lee.permission.adminAccess.hasFullAccess ? (<div className={styles.editContainer}>
              <Button mood="neutral" intensity="quiet" icon={<Icon name="ActionEditOutlined"/>} layout="iconLeading" disabled={!acceptedMembers.length} onClick={() => {
                setShowConfirm(true);
                logPageView(PageView.TacAccountBillingInfo);
            }}>
                {translate('team_account_billing_admin_edit_contact_info')}
              </Button>
              {showConfirm ? (<ConfirmDialog defaultSelected={billingAdminLogin} handleConfirmClick={handleDialogConfirmChange} handleClose={() => {
                    setShowConfirm(false);
                    logPageView(PageView.TacAccount);
                }} membersList={acceptedMembers} allMembersCount={allMembersCount}/>) : null}
            </div>) : null}
        </div>
      </div>
    </>);
};
