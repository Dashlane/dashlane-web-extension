import { ReactNode } from 'react';
import { NoteType } from '@dashlane/communication';
export interface SelectOption {
    icon?: ReactNode;
    label: string;
    value: string;
}
export type CategoryType = 'credential' | 'note';
function makeDefaultCategoryOption(type: CategoryType, label: string): SelectOption {
    const defaultValue = type === 'credential' ? '' : 'noCategory';
    return {
        label,
        value: defaultValue || '',
    };
}
type CategoryParams = {
    name: string;
    id: string;
};
export function getCategoriesAsOptions(type: CategoryType, categories: CategoryParams[], noCategoryLabel: string): SelectOption[] {
    const mapper = (category: CategoryParams) => ({
        label: category.name,
        value: category.id,
    });
    const options = categories.map(mapper);
    return [makeDefaultCategoryOption(type, noCategoryLabel)].concat(options);
}
export function getCategoryAsOption(type: CategoryType, categoryOptions: SelectOption[], nameToMatch: string, noCategoryLabel: string) {
    const matchingOption = categoryOptions.find((option) => {
        return option.label === nameToMatch;
    });
    return matchingOption ?? makeDefaultCategoryOption(type, noCategoryLabel);
}
export const noteColors: NoteType[] = [
    'BLUE',
    'GRAY',
    'PURPLE',
    'PINK',
    'RED',
    'BROWN',
    'GREEN',
    'ORANGE',
    'YELLOW',
];
export function getColorsAsOptions(colorMap: {
    [k: string]: string;
}, colors: NoteType[], icon: ReactNode): SelectOption[] {
    return colors
        .filter((color) => colorMap[color])
        .map((color) => {
        return {
            icon: icon,
            label: `${colorMap[color]}`,
            value: color,
        };
    });
}
export function getColorAsOption(colorMap: {
    [k: string]: string;
}, color: NoteType): SelectOption {
    const colorsAsOptions = getColorsAsOptions(colorMap, [color], null);
    return colorsAsOptions.length ? colorsAsOptions[0] : ({} as SelectOption);
}
