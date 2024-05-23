import { HorizontalNavButton, HorizontalNavMenu, jsx, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { PasswordHistoryFilter } from './list/helpers';
const MenuFiltersStyles: ThemeUIStyleObject = {
    marginLeft: 'auto',
    marginRight: '16px',
    paddingBottom: 0,
};
const I18N_KEYS = {
    FILTER_ALL: 'webapp_password_history_filter_all',
    FILTER_SAVED: 'webapp_password_history_filter_saved',
    FILTER_UNSAVED: 'webapp_password_history_filter_unsaved',
};
interface Props {
    activeFilter: PasswordHistoryFilter;
    onFilterChanged: (filter: PasswordHistoryFilter) => void;
}
export const PasswordHistoryQuickFilters = ({ activeFilter, onFilterChanged, }: Props) => {
    const { translate } = useTranslate();
    const getLabelForFilter = (filter: PasswordHistoryFilter) => {
        let label = '';
        switch (filter) {
            case PasswordHistoryFilter.All:
                label = I18N_KEYS.FILTER_ALL;
                break;
            case PasswordHistoryFilter.Saved:
                label = I18N_KEYS.FILTER_SAVED;
                break;
            case PasswordHistoryFilter.Unsaved:
                label = I18N_KEYS.FILTER_UNSAVED;
                break;
        }
        return translate(label);
    };
    return (<HorizontalNavMenu sx={MenuFiltersStyles}>
      {Object.keys(PasswordHistoryFilter).map((filter) => {
            return (<HorizontalNavButton key={filter} onClick={() => {
                    onFilterChanged(PasswordHistoryFilter[filter]);
                }} selected={activeFilter === PasswordHistoryFilter[filter]} size="small" label={getLabelForFilter(PasswordHistoryFilter[filter])}/>);
        })}
    </HorizontalNavMenu>);
};
