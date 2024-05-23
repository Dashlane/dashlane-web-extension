import { jsx, Paragraph, Toggle } from '@dashlane/design-system';
import { AlertSeverity, FlexChild, FlexContainer, GridChild, } from '@dashlane/ui-components';
import { NoteCategoryDetailView, NoteType } from '@dashlane/communication';
import { getCategoriesAsOptions, getCategoryAsOption, getColorAsOption, getColorsAsOptions, noteColors, } from 'webapp/services';
import useTranslate from 'libs/i18n/useTranslate';
import { ChangeEventHandler, useState } from 'react';
import { ColorIcon } from '../color-icon';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
import DetailSelect from 'libs/dashlane-style/select-field/detail';
import { LockedItemType } from 'webapp/unlock-items/types';
import { logUserEventAskAuthentication, useProtectedItemsUnlocker, } from 'webapp/unlock-items';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useIsSSOUser } from 'webapp/account/security-settings/hooks/useIsSSOUser';
import { useIsMPlessUser } from 'webapp/account/security-settings/hooks/use-is-mpless-user';
import { DataStatus } from '@dashlane/framework-react';
const I18N_KEYS_ADDITION = {
    NO_CATEGORY: 'webapp_secure_notes_addition_no_category',
    CATEGORY_LABEL: 'webapp_secure_notes_addition_field_tab_option_category_label',
    COLOR_LABEL: 'webapp_secure_notes_addition_field_tab_option_color_label',
    SECURITY_LABEL: 'webapp_secure_notes_addition_field_tab_option_security_label',
    SECURITY_TITLE: 'webapp_secure_notes_addition_field_tab_option_security_title',
    SECURITY_DESCRIPTION: 'webapp_secure_notes_addition_field_tab_option_security_description',
    COLORS: {
        BLUE: 'webapp_secure_notes_addition_field_type_option_blue',
        BROWN: 'webapp_secure_notes_addition_field_type_option_brown',
        GRAY: 'webapp_secure_notes_addition_field_type_option_gray',
        GREEN: 'webapp_secure_notes_addition_field_type_option_green',
        ORANGE: 'webapp_secure_notes_addition_field_type_option_orange',
        PINK: 'webapp_secure_notes_addition_field_type_option_pink',
        PURPLE: 'webapp_secure_notes_addition_field_type_option_purple',
        RED: 'webapp_secure_notes_addition_field_type_option_red',
        YELLOW: 'webapp_secure_notes_addition_field_type_option_yellow',
    },
};
const I18N_KEYS_EDITION = {
    NO_CATEGORY: 'webapp_secure_notes_edition_no_category',
    CATEGORY_LABEL: 'webapp_secure_notes_edition_field_tab_option_category_label',
    COLOR_LABEL: 'webapp_secure_notes_edition_field_tab_option_color_label',
    SECURITY_LABEL: 'webapp_secure_notes_edition_field_tab_option_security_label',
    SECURITY_TITLE: 'webapp_secure_notes_edition_field_tab_option_security_title',
    SECURITY_DESCRIPTION: 'webapp_secure_notes_edition_field_tab_option_security_description',
    COLORS: {
        BLUE: 'webapp_secure_notes_edition_field_type_option_blue',
        BROWN: 'webapp_secure_notes_edition_field_type_option_brown',
        GRAY: 'webapp_secure_notes_edition_field_type_option_gray',
        GREEN: 'webapp_secure_notes_edition_field_type_option_green',
        ORANGE: 'webapp_secure_notes_edition_field_type_option_orange',
        PINK: 'webapp_secure_notes_edition_field_type_option_pink',
        PURPLE: 'webapp_secure_notes_edition_field_type_option_purple',
        RED: 'webapp_secure_notes_edition_field_type_option_red',
        YELLOW: 'webapp_secure_notes_edition_field_type_option_yellow',
    },
    CHANGE_SECURED_SETTING_ON: 'webapp_secure_notes_edition_unlocker_on_success',
    CHANGE_SECURED_SETTING_OFF: 'webapp_secure_notes_edition_unlocker_off_success',
};
const I18N_KEYS_SECURED_SETTING_ON = {
    title: 'webapp_secure_notes_edition_unlocker_title_on',
    subtitle: 'webapp_secure_notes_edition_unlocker_description_on',
};
const I18N_KEYS_SECURED_SETTING_OFF = {
    title: 'webapp_secure_notes_edition_unlocker_title_off',
    subtitle: 'webapp_secure_notes_edition_unlocker_description_off',
};
export interface SecureNoteOptions {
    category: string;
    type: NoteType;
    spaceId: string;
    secured: boolean;
}
interface Props {
    noteCategories: NoteCategoryDetailView[];
    isNewItem: boolean;
    data?: SecureNoteOptions;
    disabled?: boolean;
    saveSecureNoteOptions: (options: SecureNoteOptions) => void;
}
const mapCategories = (noteCategories: NoteCategoryDetailView[]) => noteCategories.map((c) => ({
    name: c.categoryName,
    id: c.id,
}));
export const SecureNotesOptionsForm = ({ noteCategories, disabled, data, isNewItem, saveSecureNoteOptions, }: Props) => {
    const { translate } = useTranslate();
    const alert = useAlert();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const isSSOUser = useIsSSOUser();
    const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
    const isSecurityOptionsAvailable = !isSSOUser && isMPLessUserStatus !== DataStatus.Success
        ? null
        : !isMPLessUser;
    const i18nKeys = isNewItem ? I18N_KEYS_ADDITION : I18N_KEYS_EDITION;
    const defaultCategory = translate(i18nKeys.NO_CATEGORY);
    const [category, setCategory] = useState(data?.category ?? defaultCategory);
    const [type, setType] = useState(data?.type ?? 'BLUE');
    const [spaceId, setSpaceId] = useState(data?.spaceId ?? '');
    const [secured, setSecured] = useState(data?.secured ?? false);
    const categoriesData = mapCategories(noteCategories);
    const categoryOptions = getCategoriesAsOptions('note', categoriesData, defaultCategory);
    const currentCategory = noteCategories.find((c: NoteCategoryDetailView) => c.id === category);
    const currentCategoryName = currentCategory
        ? currentCategory.categoryName
        : defaultCategory;
    const colorsMap = noteColors.reduce((map, color) => {
        map[color] = translate(i18nKeys.COLORS[color]);
        return map;
    }, {});
    const colorOptions = getColorsAsOptions(colorsMap, noteColors, ColorIcon(type as NoteType));
    const handleCategoryChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setCategory(event.currentTarget.value);
        saveSecureNoteOptions({
            category: event.currentTarget.value,
            type,
            spaceId,
            secured,
        });
    };
    const handleSpaceSelection = (newSpaceId: string) => {
        setSpaceId(newSpaceId);
        saveSecureNoteOptions({
            category,
            type,
            secured,
            spaceId: newSpaceId,
        });
    };
    const handleColorChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setType(event.currentTarget.value as NoteType);
        saveSecureNoteOptions({
            category,
            type: event.currentTarget.value as NoteType,
            spaceId,
            secured,
        });
    };
    const changeSecuredSetting = (newValue: boolean) => {
        setSecured(newValue);
        saveSecureNoteOptions({
            category,
            type,
            spaceId,
            secured: newValue,
        });
        alert.showAlert(translate(newValue
            ? I18N_KEYS_EDITION.CHANGE_SECURED_SETTING_ON
            : I18N_KEYS_EDITION.CHANGE_SECURED_SETTING_OFF), AlertSeverity.SUCCESS);
    };
    const handleAutoProtectedChange = () => {
        const newValue = !secured;
        if (!areProtectedItemsUnlocked && !isNewItem) {
            logUserEventAskAuthentication();
            openProtectedItemsUnlocker({
                itemType: LockedItemType.SecureNoteSetting,
                options: {
                    fieldsKeys: newValue
                        ? I18N_KEYS_SECURED_SETTING_ON
                        : I18N_KEYS_SECURED_SETTING_OFF,
                    translated: false,
                },
                successCallback: () => changeSecuredSetting(newValue),
            });
        }
        else {
            changeSecuredSetting(newValue);
        }
    };
    return (<FlexContainer flexDirection="column">
      
      {noteCategories && noteCategories.length > 1 ? (<DetailSelect key={currentCategoryName} disabled={disabled} label={translate(i18nKeys.CATEGORY_LABEL)} placeholder="" dataName="category" options={categoryOptions} defaultOption={getCategoryAsOption('note', categoryOptions, currentCategoryName, defaultCategory)} onChange={handleCategoryChange}/>) : null}
      <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={spaceId ?? ''} onChange={handleSpaceSelection} disabled={disabled}/>

      <DetailSelect key={type} disabled={disabled} label={translate(i18nKeys.COLOR_LABEL)} placeholder="" dataName="type" options={colorOptions} defaultOption={getColorAsOption(colorsMap, type)} onChange={handleColorChange}/>
      
      {isSecurityOptionsAvailable ? (<FlexContainer sx={{ mt: '12px' }} flexDirection="row" flexWrap="nowrap">
          <FlexChild sx={{
                fontWeight: '600',
                width: '173px',
                textAlign: 'right',
                fontSize: '16px',
                justifyContent: 'flex-end',
                pr: '24px',
            }} as={Paragraph} innerAs="label" htmlFor="securityToggle" size="medium">
            {translate(i18nKeys.SECURITY_LABEL)}
          </FlexChild>
          <FlexContainer flexDirection="row" gap="8px" flexWrap="nowrap">
            <FlexContainer as={GridChild} flexDirection="column">
              <Paragraph>{translate(i18nKeys.SECURITY_TITLE)}</Paragraph>
              <Paragraph color="ds.text.neutral.quiet">
                {translate(i18nKeys.SECURITY_DESCRIPTION)}
              </Paragraph>
            </FlexContainer>
            <Toggle id="securityToggle" disabled={disabled} checked={secured} onChange={handleAutoProtectedChange}/>
          </FlexContainer>
        </FlexContainer>) : null}
    </FlexContainer>);
};
