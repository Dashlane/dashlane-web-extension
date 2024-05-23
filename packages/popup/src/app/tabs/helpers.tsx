import * as React from 'react';
import { Icon, IconName } from '@dashlane/design-system';
export interface ConfigItem {
    disabledIcon: JSX.Element;
    icon: JSX.Element;
    selectedIcon: JSX.Element;
    titleKey: string;
}
type IconParameter = Omit<ConfigItem, 'disabledIcon' | 'icon' | 'selectedIcon'> & {
    iconName: IconName;
};
interface IconDefinition {
    iconName: IconName;
    titleKey: string;
}
const ICON_SIZE = 'large';
const ADMIN_INDEX = 1;
const ICONS: IconDefinition[] = [
    {
        iconName: 'VaultOutlined',
        titleKey: 'tab/all_items/title_vault',
    },
    {
        iconName: 'ConfigureOutlined',
        titleKey: 'tab/autofill_settings/title',
    },
    {
        iconName: 'FeaturePasswordGeneratorOutlined',
        titleKey: 'tab/generate/title',
    },
    {
        iconName: 'ActionMoreOutlined',
        titleKey: 'tab/more/title',
    },
];
const getIcon = ({ iconName, titleKey }: IconParameter): ConfigItem => {
    return {
        titleKey,
        icon: (<Icon name={iconName} size={ICON_SIZE} color="ds.text.neutral.standard"/>),
        selectedIcon: (<Icon name={iconName} size={ICON_SIZE} color="ds.text.brand.standard"/>),
        disabledIcon: (<Icon name={iconName} size={ICON_SIZE} color="ds.text.oddity.disabled"/>),
    };
};
const adminIcon: IconDefinition = {
    iconName: 'AccountSettingsOutlined',
    titleKey: 'Admin',
};
export function getTabConfig(isBusinessAdmin: boolean, isAdminTabEnabled: boolean): ConfigItem[] {
    const result = [...ICONS];
    if (isBusinessAdmin && isAdminTabEnabled) {
        result.splice(ADMIN_INDEX, 0, adminIcon);
    }
    return result.map(getIcon);
}
interface GetTabIconParams {
    isDisabledTab: boolean;
    isSelectedTab: boolean;
    tabConfigItem: ConfigItem;
}
export function getTabIcon({ isDisabledTab, isSelectedTab, tabConfigItem, }: GetTabIconParams) {
    if (isDisabledTab) {
        return tabConfigItem.disabledIcon;
    }
    if (isSelectedTab) {
        return tabConfigItem.selectedIcon;
    }
    return tabConfigItem.icon;
}
