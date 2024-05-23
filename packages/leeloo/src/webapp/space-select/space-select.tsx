import React, { ReactNode, useRef } from 'react';
import { jsx, SelectField, SelectOption } from '@dashlane/design-system';
import { FlexContainer, SelectDropdownMenu, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
import { SpaceIcon } from 'webapp/components/space-and-sharing-icons/space-icon';
import { useIsPersonalSpaceDisabled } from '../../libs/hooks/use-is-personal-space-disabled';
const I18N_KEYS = {
    FIELD_SPACE: 'webapp_form_field_space',
    SPACE_SELECT_PLACEHOLDER: 'webapp_form_field_space_placeholder',
    PERSONAL_SPACE: 'webapp_form_field_personal_space',
};
export type SpaceSelectOption = {
    value: string;
    label: ReactNode;
};
type NewSpaceSelectOption = {
    value: string;
    label: string;
};
interface SpaceSelectProps extends Partial<Omit<HTMLFormElement, 'options'>> {
    onChange: (spaceId: string) => void;
    spaceId?: string;
    hideLabel?: boolean;
    portalTarget?: HTMLElement;
    labelSx?: ThemeUIStyleObject;
    wrapperSx?: ThemeUIStyleObject;
    defaultSpaceId?: string;
    disabled?: boolean;
    isUsingNewDesign?: boolean;
}
export const spaceSelectFormLabelSx: ThemeUIStyleObject = {
    width: '173px',
    textAlign: 'right',
    paddingRight: '24px',
    justifyContent: 'flex-end',
    lineHeight: '20px',
    fontWeight: '600',
};
const SpaceSelectComponent = ({ spaceId, onChange, hideLabel, portalTarget, labelSx = {}, wrapperSx = {}, defaultSpaceId, disabled = false, isUsingNewDesign = false, ...rest }: SpaceSelectProps) => {
    const selectFieldContainerRef = useRef(null);
    const { translate } = useTranslate();
    const spaces = useSpaces();
    const personalSpaceTranslation = translate(I18N_KEYS.PERSONAL_SPACE);
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const currentSpaceId = spaces.status === DataStatus.Success
        ? spaces.data.find((space) => space.teamId === spaceId)?.teamId ?? ''
        : '';
    const getSpaceOptions = (): SpaceSelectOption[] => {
        const personalSpace = {
            id: '',
            name: personalSpaceTranslation,
            letter: personalSpaceTranslation[0],
        };
        const personalOption = {
            value: personalSpace.id,
            label: (<FlexContainer alignItems="center">
          <SpaceIcon space={personalSpace}/>
          <span sx={{ marginLeft: 2 }}>{personalSpace.name}</span>
        </FlexContainer>),
        };
        const businessOption = [];
        if (spaces.status === DataStatus.Success && spaces.data.length > 0) {
            const businessSpace = {
                ...spaces.data[0],
                id: spaces.data[0].teamId,
                name: spaces.data[0].teamName,
            };
            businessOption.push({
                value: businessSpace.teamId,
                label: (<FlexContainer alignItems="center">
            <SpaceIcon space={businessSpace}/>
            <span sx={{ marginLeft: 2 }}>{businessSpace.name}</span>
          </FlexContainer>),
            });
        }
        return [personalOption, ...businessOption];
    };
    const getNewSpaceOptions = (): NewSpaceSelectOption[] => {
        const personalOption = {
            value: 'personal',
            label: personalSpaceTranslation,
        };
        const businessOption = [];
        if (spaces.status === DataStatus.Success && spaces.data.length > 0) {
            businessOption.push({
                value: spaces.data[0].teamId,
                label: spaces.data[0].teamName,
            });
        }
        return [personalOption, ...businessOption];
    };
    const spaceOptions = isUsingNewDesign
        ? getNewSpaceOptions()
        : getSpaceOptions();
    const shouldDisplaySpaceSelector = spaceOptions.length > 1 &&
        isPersonalSpaceDisabled.status === DataStatus.Success &&
        !isPersonalSpaceDisabled.isDisabled;
    if (!shouldDisplaySpaceSelector) {
        return null;
    }
    if (isUsingNewDesign) {
        let currentValue = undefined;
        const defaultValue = spaceOptions.find((option) => option.value === defaultSpaceId)?.value;
        const selectedValue = spaceOptions.find((option) => option.value === currentSpaceId)?.value ??
            spaceOptions[0].value;
        if (defaultValue || selectedValue) {
            currentValue = defaultValue ?? selectedValue;
        }
        return (<div ref={selectFieldContainerRef} sx={wrapperSx}>
        <SelectField portal={selectFieldContainerRef.current} data-name="spaceSelect" id={rest.id ?? 'spaceSelect'} key={rest.key ?? 'spaceSelect'} label={translate(I18N_KEYS.FIELD_SPACE)} disabled={isPersonalSpaceDisabled.isDisabled || disabled} onChange={(value) => {
                const nextSpaceId = value === 'personal' ? '' : value;
                onChange(nextSpaceId);
            }} value={currentValue}>
          {spaceOptions.map((option) => (<SelectOption key={option.value} value={option.value}>
              {option.label}
            </SelectOption>))}
        </SelectField>
      </div>);
    }
    return (<FlexContainer alignItems="center" sx={wrapperSx}>
      {hideLabel ? null : (<label sx={labelSx} htmlFor={rest.id ?? 'spaceSelect'}>
          {translate(I18N_KEYS.FIELD_SPACE)}
        </label>)}
      <SelectDropdownMenu {...rest} name="spaceSelect" menuPortalTarget={portalTarget} isSearchable={false} id={rest.id ?? 'spaceSelect'} key={rest.key ?? 'spaceSelect'} placeholder={translate(I18N_KEYS.SPACE_SELECT_PLACEHOLDER)} options={spaceOptions} value={defaultSpaceId
            ? spaceOptions.find((option) => option.value === defaultSpaceId)
            : spaceId !== undefined
                ? spaceOptions.find((option) => option.value === currentSpaceId) ??
                    spaceOptions[0]
                : undefined} onChange={(option: SpaceSelectOption) => {
            onChange(option.value);
        }} isDisabled={disabled}/>
    </FlexContainer>);
};
export const SpaceSelect = React.memo(SpaceSelectComponent);
