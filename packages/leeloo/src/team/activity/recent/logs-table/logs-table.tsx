import { PropsWithChildren } from 'react';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { TableHeader } from 'team/page/table-header';
import styles from './styles.css';
const SX_STYLES = {
    TABLE_BODY: {
        tr: {
            boxShadow: 'inset 0 -1px 0 0 ds.border.neutral.quiet.idle',
            height: '60px',
            td: {
                padding: '16px',
                verticalAlign: 'middle',
                variant: 'text.ds.body.reduced.regular',
                color: 'ds.text.neutral.standard',
            },
        },
    },
};
export const I18N_KEYS = {
    ADMIN: 'team_activity_list_head_admin',
    ACTION: 'team_activity_list_head_action',
    TIME: 'team_activity_list_head_time',
};
export const LogsTable = ({ children }: PropsWithChildren<unknown>) => {
    const { translate } = useTranslate();
    const columns = [
        { headerLabel: translate(I18N_KEYS.ADMIN), headerKey: 'admin' },
        { headerLabel: translate(I18N_KEYS.ACTION), headerKey: 'action' },
        { headerLabel: translate(I18N_KEYS.TIME), headerKey: 'time' },
    ];
    return (<table className={styles.table}>
      <TableHeader columns={columns}/>
      <tbody key={'table-body'} sx={SX_STYLES.TABLE_BODY}>
        {children}
      </tbody>
    </table>);
};
