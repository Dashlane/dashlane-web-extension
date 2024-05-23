import { ChangeEvent, useEffect, useState } from 'react';
import { ascend, descend, prop, sortWith } from 'ramda';
import { TeamMemberInfo } from '@dashlane/communication';
import { Button, Checkbox, Icon, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { getAuth } from 'user';
import { LeeWithStorage } from 'lee';
import SecondaryButton from 'libs/dashlane-style/buttons/modern/secondary';
import Pagination from 'libs/dashlane-style/pagination/modern';
import { TextField } from 'libs/dashlane-style/text-field/text-field';
import useTranslate from 'libs/i18n/useTranslate';
import { State as MembersState } from 'team/members';
import { Role } from 'team/members/member-actions/role-assignment/role-assignment-dialog';
import { MemberAction, MemberData, MemberStatusFilter, SortableMemberProps, } from 'team/members/types';
import { TableHeader } from 'team/page/table-header';
import { GlobalActionMenu } from './global-action-menu';
import { MultipleAssignMenu } from './multiple-assign-menu';
import { mapMember } from './helpers';
import { Rows } from './rows';
import searchIcon from './search-icon.svg';
import styles from './styles.css';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    TOP: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '90px',
        marginBottom: '16px',
        color: 'ds.text.neutral.quiet',
    },
    TOP_PAGINATION_TEXT: {
        whiteSpace: 'nowrap',
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
        maxHeight: '42px',
        overflowY: 'hidden',
        marginRight: '16px',
    },
};
const I18N_KEYS = {
    FILTER_CONTROL_SEARCH_PLACEHOLDER: 'team_members_filter_control_search_placeholder',
    FILTER_CONTROL_INCLUDE_ACTIVE: 'team_members_filter_control_include_active',
    FILTER_CONTROL_INCLUDE_INVITED: 'team_members_filter_control_include_invited',
    FILTER_CONTROL_INCLUDE_REVOKED: 'team_members_filter_control_include_revoked',
    REVOKE_MULTIPLE_LABEL: 'team_members_revoke_multiple_label',
    FILTER_PAGINATION_TOP_COUNT: 'team_members_filter_pagination_top_count',
    FILTER_PAGINATION_TOP_TOTAL: 'team_members_filter_pagination_top_total',
    QUOTA_PROGRESS_ADD: 'team_members_quota_progress_add',
    HEADING_NAME: 'team_members_heading_name',
    HEADING_SECURITY_SCORE: 'team_members_heading_security_score',
    HEADING_PASSWORD_COUNT: 'team_members_heading_password_count',
    HEADING_SAFE_TOOLTIP: 'team_members_heading_safe_tooltip',
    HEADING_SAFE: 'team_members_heading_safe',
    HEADING_WEAK_TOOLTIP: 'team_members_heading_weak_tooltip',
    HEADING_WEAK: 'team_members_heading_weak',
    HEADING_REUSED_TOOLTIP: 'team_members_heading_reused_tooltip',
    HEADING_REUSED: 'team_members_heading_reused',
    HEADING_COMPROMISED_TOOLTIP: 'team_members_heading_compromised_tooltip',
    HEADING_COMPROMISED: 'team_members_heading_compromised',
    HEADING_LAST_LOGIN: 'team_members_heading_last_login',
    HEADING_RIGHTS: 'team_members_heading_rights',
    HEADING_RIGHTS_TOOLTIP: 'team_members_heading_rights_tooltip_markup',
};
const icons = {
    search: searchIcon,
};
const ROWS_PER_PAGE = 24;
interface SortState {
    sortBy: SortableMemberProps;
    sortOrder: 'asc' | 'desc';
}
interface Props {
    lee: LeeWithStorage<MembersState>;
    members: TeamMemberInfo[];
    onMembersActionSelect: (actionName: MemberAction, members: MemberData[], newRole?: Role) => void;
    onMembersInvite: () => void;
}
export const List = ({ lee, members, onMembersActionSelect, onMembersInvite, }: Props) => {
    const { translate } = useTranslate();
    const auth = getAuth(lee.globalState);
    const currentLoggedLogin = auth?.login ?? '';
    const [mappedMembers, setMappedMembers] = useState<MemberData[]>(mapMember(members));
    const [checkedMembers, setCheckedMembers] = useState<Set<MemberData>>(new Set());
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [statusFilters, setStatusFilters] = useState<MemberStatusFilter[]>([
        'accepted',
        'pending',
        'removed',
    ]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortState, setSortState] = useState<SortState>({
        sortBy: 'sortableRights',
        sortOrder: 'asc',
    });
    useEffect(() => {
        setCheckedMembers(new Set<MemberData>());
        setMappedMembers(mapMember(members));
    }, [members]);
    const getFilteredAndSortedMembers = (): MemberData[] => {
        const upperCaseQuery = searchQuery?.toLocaleUpperCase();
        const comparator = sortState.sortOrder === 'asc' ? ascend : descend;
        return sortWith([comparator(prop(sortState.sortBy))])(mappedMembers
            .filter((member: MemberData) => member.filterableStatus &&
            statusFilters.includes(member.filterableStatus))
            .filter((member: MemberData) => searchQuery
            ? member.login.toLocaleUpperCase().includes(upperCaseQuery)
            : true));
    };
    const goToPage = (pageIndex: number) => {
        setCurrentPageIndex(pageIndex);
    };
    const sortBy = (property: SortableMemberProps): void => {
        const sortOrder = property === sortState.sortBy && sortState.sortOrder === 'asc'
            ? 'desc'
            : 'asc';
        setSortState({ sortBy: property, sortOrder });
    };
    const toggleStatusFilter = (status: MemberStatusFilter): void => {
        setCurrentPageIndex(0);
        setStatusFilters((currFilters) => currFilters.includes(status)
            ? currFilters.filter((currentStatus) => currentStatus !== status)
            : currFilters.concat([status]));
    };
    const onToggleStatusAccepted = () => toggleStatusFilter('accepted');
    const onToggleStatusPending = () => toggleStatusFilter('pending');
    const onToggleStatusRemoved = () => toggleStatusFilter('removed');
    const sortByLogin = () => sortBy('login');
    const sortBySecurityScore = () => sortBy('sortableSecurityScore');
    const sortByPasswords = () => sortBy('sortablePasswords');
    const sortBySafePasswords = () => sortBy('sortableSafePasswords');
    const sortByWeakPasswords = () => sortBy('sortableWeakPasswords');
    const sortByReusedPasswords = () => sortBy('sortableReused');
    const sortByCompromisedPasswords = () => sortBy('sortableCompromisedPasswords');
    const sortByLastActivity = () => sortBy('sortableLastActivity');
    const sortByRights = () => sortBy('sortableRights');
    const searchFor = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentPageIndex(0);
        setSearchQuery(event.currentTarget.value);
    };
    const isRevokable = (member: MemberData): boolean => {
        return (!member.isBillingAdmin &&
            ['accepted', 'pending', 'proposed'].includes(member.status));
    };
    const hasRevokableMemberChecked = (): boolean => {
        return [...checkedMembers].some(isRevokable);
    };
    const onMemberActionSelect = (memberAction: MemberAction, member: MemberData): void => {
        onMembersActionSelect(memberAction, [member]);
    };
    const onMultipleReassignActionSelect = (selectedRole: Role): void => {
        let members = [...checkedMembers];
        switch (selectedRole) {
            case 'member':
                members = members.filter((member: MemberData) => member.isTeamCaptain || member.isGroupManager);
                break;
            case 'teamCaptain':
                members = members.filter((member: MemberData) => !member.isTeamCaptain && member.status === 'accepted');
                break;
            case 'groupManager':
                members = members.filter((member: MemberData) => !member.isGroupManager && member.status === 'accepted');
        }
        onMembersActionSelect('reassign', members, selectedRole);
    };
    const onRevokeSelect = () => {
        let members = [...checkedMembers];
        members = members.filter(isRevokable);
        onMembersActionSelect('revoke', members);
    };
    const toggleCheckFor = (member: MemberData): void => {
        setCheckedMembers((prevCheckedMembers) => {
            const isCheckedMember = Array.from(prevCheckedMembers).find((checkedMember) => checkedMember.login === member.login);
            const nextCheckedMembers = new Set(prevCheckedMembers);
            if (isCheckedMember) {
                nextCheckedMembers.delete(isCheckedMember);
            }
            else {
                nextCheckedMembers.add({ ...member });
            }
            return nextCheckedMembers;
        });
    };
    const uncheckAll = () => {
        setCheckedMembers(new Set<MemberData>());
    };
    const checkAll = () => {
        const startIndex = currentPageIndex * ROWS_PER_PAGE;
        const newCheckedMembers = new Set<MemberData>();
        getFilteredAndSortedMembers()
            .slice(startIndex, startIndex + ROWS_PER_PAGE)
            .reduce((set: Set<MemberData>, member: MemberData) => {
            if (currentLoggedLogin === member.login) {
                return set;
            }
            set.add({ ...member });
            return set;
        }, newCheckedMembers);
        Array.from(checkedMembers).forEach((checkedMember) => newCheckedMembers.add({ ...checkedMember }));
        setCheckedMembers(newCheckedMembers);
    };
    const headerCheckbox = (membersToDisplay: Array<MemberData>) => {
        const numberOfCheckedMembers = membersToDisplay.filter((member) => Array.from(checkedMembers).find((checkedMember) => checkedMember.login === member.login)).length;
        const isLoggedInUserDisplayed = membersToDisplay.find((member) => member.login === currentLoggedLogin);
        const numberOfDisplayedMembers = isLoggedInUserDisplayed
            ? membersToDisplay.length - 1
            : membersToDisplay.length;
        let onClickHandler;
        if (numberOfCheckedMembers === 0) {
            onClickHandler = checkAll;
        }
        else if (numberOfDisplayedMembers > 0 &&
            numberOfCheckedMembers === numberOfDisplayedMembers) {
            onClickHandler = uncheckAll;
        }
        else {
            onClickHandler = uncheckAll;
        }
        return <Checkbox onChange={onClickHandler} aria-label="select-all"/>;
    };
    const startIndex = currentPageIndex * ROWS_PER_PAGE;
    const filteredAndSortedMembers = getFilteredAndSortedMembers();
    const paginationTopCount = {
        first: filteredAndSortedMembers.length ? startIndex + 1 : 0,
        last: Math.min(filteredAndSortedMembers.length, startIndex + ROWS_PER_PAGE),
    };
    const membersToDisplay = filteredAndSortedMembers.slice(startIndex, startIndex + ROWS_PER_PAGE);
    const HeaderCheckbox = headerCheckbox(membersToDisplay);
    const columns = [
        { headerLabel: '', headerElement: HeaderCheckbox, headerKey: 'checkbox' },
        {
            headerLabel: translate(I18N_KEYS.HEADING_NAME),
            tooltipLabel: translate(I18N_KEYS.HEADING_NAME),
            onClick: () => sortByLogin(),
            sortOrder: sortState.sortBy !== 'login' ? undefined : sortState.sortOrder,
            headerKey: 'login',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_SECURITY_SCORE),
            tooltipLabel: translate(I18N_KEYS.HEADING_SECURITY_SCORE),
            onClick: () => sortBySecurityScore(),
            sortOrder: sortState.sortBy !== 'sortableSecurityScore'
                ? undefined
                : sortState.sortOrder,
            headerKey: 'security-score',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_PASSWORD_COUNT),
            tooltipLabel: translate(I18N_KEYS.HEADING_PASSWORD_COUNT),
            onClick: () => sortByPasswords(),
            sortOrder: sortState.sortBy !== 'sortablePasswords'
                ? undefined
                : sortState.sortOrder,
            headerKey: 'num-passwords',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_SAFE),
            tooltipLabel: translate(I18N_KEYS.HEADING_SAFE_TOOLTIP),
            onClick: () => sortBySafePasswords(),
            sortOrder: sortState.sortBy !== 'sortableSafePasswords'
                ? undefined
                : sortState.sortOrder,
            headerKey: 'safe-passwords',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_WEAK),
            tooltipLabel: translate(I18N_KEYS.HEADING_WEAK_TOOLTIP),
            onClick: () => sortByWeakPasswords(),
            sortOrder: sortState.sortBy !== 'sortableWeakPasswords'
                ? undefined
                : sortState.sortOrder,
            headerKey: 'weak-passwords',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_REUSED),
            tooltipLabel: translate(I18N_KEYS.HEADING_REUSED_TOOLTIP),
            onClick: () => sortByReusedPasswords(),
            sortOrder: sortState.sortBy !== 'sortableReused' ? undefined : sortState.sortOrder,
            headerKey: 'reused-passwords',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_COMPROMISED),
            tooltipLabel: translate(I18N_KEYS.HEADING_COMPROMISED_TOOLTIP),
            onClick: () => sortByCompromisedPasswords(),
            sortOrder: sortState.sortBy !== 'sortableCompromisedPasswords'
                ? undefined
                : sortState.sortOrder,
            headerKey: 'compromised-passwords',
        },
        {
            headerLabel: translate(I18N_KEYS.HEADING_LAST_LOGIN),
            tooltipLabel: translate(I18N_KEYS.HEADING_LAST_LOGIN),
            onClick: () => sortByLastActivity(),
            sortOrder: sortState.sortBy !== 'sortableLastActivity'
                ? undefined
                : sortState.sortOrder,
            headerKey: 'last-login',
        },
        {
            headerLabel: (<span sx={{ display: 'flex', alignItems: 'center' }}>
          {translate(I18N_KEYS.HEADING_RIGHTS)}{' '}
          <Icon color="ds.text.neutral.quiet" name="FeedbackInfoOutlined" sx={{ display: 'inline-block', marginLeft: '4px' }} size="small"/>
        </span>),
            tooltipLabel: (<div sx={{
                    '& > * > p:not(:last-child)': { marginBottom: '10px' },
                }}>
          {translate.markup(I18N_KEYS.HEADING_RIGHTS_TOOLTIP)}
        </div>),
            onClick: () => sortByRights(),
            sortOrder: sortState.sortBy !== 'sortableRights' ? undefined : sortState.sortOrder,
            headerKey: 'permissions',
        },
        {
            headerLabel: '',
            headerKey: 'actions',
        },
    ];
    return (<div className={styles.container}>
      <div sx={SX_STYLES.TOP}>
        <div className={styles.tableHeaderContainer}>
          <TextField type="search" containerStyle={{
            flexGrow: 1,
            maxWidth: '300px',
            marginBottom: '15px',
        }} onChange={searchFor} placeholder={translate(I18N_KEYS.FILTER_CONTROL_SEARCH_PLACEHOLDER)} placeholderIcon={icons.search}/>
          <div className={styles.topContainer}>
            <div className={styles.topLeft}>
              <div className={styles.statusFilters}>
                <Checkbox label={translate(I18N_KEYS.FILTER_CONTROL_INCLUDE_ACTIVE)} onChange={onToggleStatusAccepted} checked={statusFilters.includes('accepted')}/>
                <Checkbox label={translate(I18N_KEYS.FILTER_CONTROL_INCLUDE_INVITED)} onChange={onToggleStatusPending} checked={statusFilters.includes('pending')}/>
                <Checkbox label={translate(I18N_KEYS.FILTER_CONTROL_INCLUDE_REVOKED)} onChange={onToggleStatusRemoved} checked={statusFilters.includes('removed')}/>
              </div>
            </div>
            {checkedMembers.size > 0 && [
            <MultipleAssignMenu key="dropdown" onMultipleReassignActionSelect={onMultipleReassignActionSelect}/>,
            <SecondaryButton key="button" classNames={[styles.revokeButton]} label={translate(I18N_KEYS.REVOKE_MULTIPLE_LABEL)} disabled={!hasRevokableMemberChecked()} onClick={onRevokeSelect}/>,
        ]}
            <div className={styles.topRight}>
              <div className={styles.topPagination}>
                <div sx={SX_STYLES.TOP_PAGINATION_TEXT}>
                  <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.catchy">
                    {translate(I18N_KEYS.FILTER_PAGINATION_TOP_COUNT, {
            first: paginationTopCount.first,
            last: paginationTopCount.last,
        })}
                  </Paragraph>
                  <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
                    {translate(I18N_KEYS.FILTER_PAGINATION_TOP_TOTAL, {
            total: filteredAndSortedMembers.length,
        })}
                  </Paragraph>
                </div>
                <Pagination currentPageIndex={currentPageIndex} isShort={true} itemsLength={filteredAndSortedMembers.length} itemsPerPage={ROWS_PER_PAGE} onChange={goToPage}/>
              </div>
              <Button icon="ActionAddOutlined" layout="iconLeading" onClick={onMembersInvite}>
                {translate(I18N_KEYS.QUOTA_PROGRESS_ADD)}
              </Button>
              
              {members.length > 1 && (<GlobalActionMenu members={members} onMembersActionSelect={onMembersActionSelect}/>)}
            </div>
          </div>
        </div>
      </div>
      <table className={styles.table}>
        <TableHeader columns={columns}/>

        <Rows checkedMembers={checkedMembers} currentLoggedLogin={currentLoggedLogin} members={membersToDisplay} onMemberActionSelect={onMemberActionSelect} onMemberToggleCheck={toggleCheckFor}/>
      </table>
      <div className={styles.bottom}>
        <Pagination currentPageIndex={currentPageIndex} itemsLength={filteredAndSortedMembers.length} itemsPerPage={ROWS_PER_PAGE} onChange={goToPage}/>
      </div>
    </div>);
};
