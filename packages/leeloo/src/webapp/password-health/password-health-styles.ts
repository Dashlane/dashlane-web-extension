import { ThemeUIStyleObject } from '@dashlane/design-system';
const SIZE_VARIABLES = {
    fontSizWebappBigger: '32px',
    genericPadding: '32px',
    rootHeaderLineHeight: '1.25',
    scoreContainerHeight: '276px',
    zIndexContentOverlap: 2,
    zIndexPWHHeader: 2,
    zIndexPWHListHeader: 1,
};
const ROOT_HEADER_HEIGHT = parseFloat(SIZE_VARIABLES.genericPadding) * 2 +
    parseFloat(SIZE_VARIABLES.fontSizWebappBigger) *
        parseFloat(SIZE_VARIABLES.rootHeaderLineHeight);
const HEADER_PADDING_Y = 32;
export const passwordHealthStyles: Record<string, ThemeUIStyleObject> = {
    rootContainer: {
        height: '100%',
        backgroundColor: 'ds.background.alternate',
    },
    headerContainer: {
        top: 0,
        width: '100%',
        height: ROOT_HEADER_HEIGHT,
        padding: `${HEADER_PADDING_Y / 2}px 0px`,
        backgroundColor: 'ds.background.alternate',
        position: 'absolute',
        zIndex: SIZE_VARIABLES.zIndexPWHHeader,
    },
    listHeaderContainer: {},
    listHeader: {
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        top: 0,
        zIndex: SIZE_VARIABLES.zIndexPWHListHeader,
        borderColor: 'ds.border.neutral.quiet.idle',
        borderStyle: 'solid',
        padding: `${SIZE_VARIABLES.genericPadding} ${SIZE_VARIABLES.genericPadding} 20px`,
        borderWidth: '1px 1px 0',
        borderRadius: ' 4px 4px 0 0',
    },
    listContainer: {
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        borderColor: 'ds.border.neutral.quiet.idle',
        borderStyle: 'solid',
        borderWidth: '0 1px 0',
        padding: `0 ${SIZE_VARIABLES.genericPadding} ${SIZE_VARIABLES.genericPadding}`,
    },
    listStyle: {
        width: '100%',
        isolation: 'isolate',
    },
    passwordHealthGrid: {
        padding: `0 ${SIZE_VARIABLES.genericPadding} 0`,
        marginTop: ROOT_HEADER_HEIGHT,
        gridTemplateRows: `${SIZE_VARIABLES.scoreContainerHeight} 1fr`,
        overflow: 'auto',
        height: '100%',
        maxHeight: `calc(100% - ${ROOT_HEADER_HEIGHT - HEADER_PADDING_Y}px)`,
    },
    passwordHealthScore: {
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        border: '1px solid transparent',
        borderColor: 'ds.border.neutral.quiet.idle',
        borderRadius: '4px',
        marginBottom: '16px',
        padding: '32px 0px 40px 32px',
    },
    passwordHealthTips: {
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        border: '1px solid transparent',
        borderColor: 'ds.border.neutral.quiet.idle',
        borderRadius: '4px',
        width: '448px',
        marginLeft: '16px',
        marginBottom: '16px',
    },
};
