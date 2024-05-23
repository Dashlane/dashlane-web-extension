import { Icon, jsx } from '@dashlane/design-system';
export enum MarkdownToolType {
    BOLD = 'bold',
    CODE = 'code',
    ITALIC = 'italic',
    LINK = 'link',
    SUBSUBTITLE = 'subsubtitle',
    SUBTITLE = 'subtitle',
    TITLE = 'title'
}
export type MarkdownFormatter = (text: string, selection: MarkdownContentSelection) => FormatterResult;
export type MarkdownContentSelection = {
    start: number;
    end: number;
};
export type FormatterResult = {
    updatedContent: string;
    updatedSelectionRange: MarkdownContentSelection;
};
const textIsFormatted = (textToFormat: string, formatPrefix: string, formatSuffix: string): boolean => {
    const hasSuffix = formatSuffix ? textToFormat.endsWith(formatSuffix) : true;
    return textToFormat.startsWith(formatPrefix) && hasSuffix;
};
const basicSelectionRangeUpdate = (selection: MarkdownContentSelection, isFormatted: boolean, cursorOffsetStart: number, cursorOffsetEnd: number): MarkdownContentSelection => {
    if (selection.start === selection.end) {
        selection.start = selection.start + cursorOffsetStart;
        selection.end = selection.end + cursorOffsetStart;
        return selection;
    }
    if (isFormatted) {
        selection.end = selection.end - cursorOffsetStart - cursorOffsetEnd;
    }
    else {
        selection.end = selection.end + cursorOffsetStart + cursorOffsetEnd;
    }
    return selection;
};
const linkSelectionRangeUpdate = (selection: MarkdownContentSelection, cursorOffsetStart: number, cursorOffsetEnd: number): MarkdownContentSelection => {
    if (selection.start === selection.end) {
        selection.start = selection.start + 1;
        selection.end = selection.end + 1;
    }
    else {
        selection.start = selection.end + cursorOffsetStart;
        selection.end = selection.end + cursorOffsetEnd;
    }
    return selection;
};
const basicFormatter = (tool: {
    formatPrefix: string;
    formatSuffix?: string;
    cursorOffsetStart: number;
    cursorOffsetEnd: number;
}) => (text: string, selection: MarkdownContentSelection): FormatterResult => {
    const { formatPrefix, cursorOffsetStart, cursorOffsetEnd } = tool;
    const formatSuffix = tool.formatSuffix ?? '';
    const { start, end } = selection;
    const textToFormat = text.slice(start, end);
    const isFormatted = textIsFormatted(textToFormat, formatPrefix, formatSuffix);
    const selectionRangeUpdate = basicSelectionRangeUpdate(selection, isFormatted, cursorOffsetStart, cursorOffsetEnd);
    if (isFormatted) {
        return {
            updatedContent: [
                text.slice(0, start),
                text.slice(start + formatPrefix.length, end - formatSuffix.length),
                text.slice(end),
            ].join(''),
            updatedSelectionRange: selectionRangeUpdate,
        };
    }
    return {
        updatedContent: [
            text.slice(0, start),
            formatPrefix,
            textToFormat,
            formatSuffix,
            text.slice(end),
        ].join(''),
        updatedSelectionRange: selectionRangeUpdate,
    };
};
const linkFormatter = (text: string, selection: MarkdownContentSelection): FormatterResult => {
    const { start, end } = selection;
    const textToFormat = text.slice(start, end);
    const selectionRangeUpdate = linkSelectionRangeUpdate(selection, 3, 6);
    return {
        updatedContent: [
            text.slice(0, start),
            '[',
            textToFormat,
            '](url)',
            text.slice(end),
        ].join(''),
        updatedSelectionRange: selectionRangeUpdate,
    };
};
export const markdownTools: {
    [key: string]: {
        icon: jsx.JSX.Element;
        label: string;
        format: MarkdownFormatter;
    };
} = {
    [MarkdownToolType.TITLE]: {
        icon: <Icon name="FormattingHeading1Outlined"/>,
        label: 'Heading',
        format: basicFormatter({
            formatPrefix: '# ',
            cursorOffsetStart: 2,
            cursorOffsetEnd: 0,
        }),
    },
    [MarkdownToolType.SUBTITLE]: {
        icon: <Icon name="FormattingHeading2Outlined"/>,
        label: 'Subheading',
        format: basicFormatter({
            formatPrefix: '## ',
            cursorOffsetStart: 3,
            cursorOffsetEnd: 0,
        }),
    },
    [MarkdownToolType.SUBSUBTITLE]: {
        icon: <Icon name="FormattingHeading3Outlined"/>,
        label: 'Subsubheading',
        format: basicFormatter({
            formatPrefix: '### ',
            cursorOffsetStart: 4,
            cursorOffsetEnd: 0,
        }),
    },
    [MarkdownToolType.BOLD]: {
        icon: <Icon name="FormattingBoldOutlined"/>,
        label: 'Bold',
        format: basicFormatter({
            formatPrefix: '**',
            formatSuffix: '**',
            cursorOffsetStart: 2,
            cursorOffsetEnd: 2,
        }),
    },
    [MarkdownToolType.ITALIC]: {
        icon: <Icon name="FormattingItalicOutlined"/>,
        label: 'Italic',
        format: basicFormatter({
            formatPrefix: '_',
            formatSuffix: '_',
            cursorOffsetStart: 1,
            cursorOffsetEnd: 1,
        }),
    },
    [MarkdownToolType.CODE]: {
        icon: <Icon name="FormattingCodeOutlined"/>,
        label: 'Code',
        format: basicFormatter({
            formatPrefix: '`',
            formatSuffix: '`',
            cursorOffsetStart: 1,
            cursorOffsetEnd: 1,
        }),
    },
    [MarkdownToolType.LINK]: {
        icon: <Icon name="LinkOutlined"/>,
        label: 'Link',
        format: linkFormatter,
    },
};
