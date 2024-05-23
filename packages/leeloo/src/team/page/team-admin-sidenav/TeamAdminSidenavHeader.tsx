import { jsx } from '@dashlane/design-system';
import { DLogo, Lockup, LockupColor, LockupSize, Sidenav, SidenavHeader, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
export interface TeamAdminSidenavHeaderProps {
    isCollapsed?: boolean;
}
const I18N_KEYS = {
    DASHLANE_LOGO_TITLE: '_common_dashlane_logo_title',
};
export const TeamAdminSidenavHeader = ({ isCollapsed, }: TeamAdminSidenavHeaderProps) => {
    const { translate } = useTranslate();
    const defaultedIsCollapsed = isCollapsed || false;
    return (<Sidenav collapsed={defaultedIsCollapsed}>
      <SidenavHeader data-testid="logo-header" sx={{
            height: '80px !important',
            borderBottomColor: 'ds.border.neutral.quiet.idle !important',
        }}>
        {defaultedIsCollapsed ? (<div className={styles.collapsedLogo}>
            <DLogo color={'ds.text.inverse.catchy'} height={39} width={39}/>
          </div>) : (<Lockup color={LockupColor.White} size={LockupSize.Size39} title={translate(I18N_KEYS.DASHLANE_LOGO_TITLE)}/>)}
      </SidenavHeader>
    </Sidenav>);
};
