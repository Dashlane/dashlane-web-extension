import { Heading, mergeSx, ThemeUIStyleObject } from '@dashlane/design-system';
import { CSSTransition } from 'react-transition-group';
import styleTransitions from './transition.css';
import styleVars from './variables.css';
type RenderItem<T> = (data: T) => React.ReactNode;
type GetItemKey<T> = (data: T) => React.Key;
const defaultGetItemKey = (gridIdx: number, itemIdx: number): React.Key => `${gridIdx}-${itemIdx}`;
export type GridData<T> = {
    key: string;
    open: boolean;
    title: string;
    items: T[];
    render?: RenderItem<T>;
    getKey?: GetItemKey<T>;
};
interface Props<T> {
    data: GridData<T>[];
    itemClassname?: string;
    innerSectionClassname?: string;
    onRenderItem?: RenderItem<T>;
    onToggleGrid?: (key: string) => void;
    sxProps?: Partial<ThemeUIStyleObject>;
}
const GridView = <T>({ data, onRenderItem, onToggleGrid, itemClassname, innerSectionClassname, sxProps = {}, }: Props<T>) => {
    const togglePanel = (key: string) => {
        if (!onToggleGrid) {
            return;
        }
        onToggleGrid(key);
    };
    const renderItem = (dataItem: T, render: RenderItem<T>, getKey: GetItemKey<T>) => {
        return (<li className={itemClassname} key={getKey(dataItem)} sx={mergeSx([
                {
                    position: 'relative',
                    boxSizing: 'content-box',
                },
                sxProps,
            ])}>
        {render(dataItem)}
      </li>);
    };
    const renderGrid = (gridData: GridData<T>, idx: number) => {
        const render = gridData.render ?? onRenderItem;
        if (!render) {
            throw new Error('No render function provided');
        }
        const getKey = gridData.getKey;
        const gridIdx = idx;
        const transitionTime = Number(styleVars['--dashlane-credentials-grid-collapsing-duration']);
        const handleKeyPress = (e: React.KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                togglePanel(gridData.key);
            }
        };
        return [
            <div key={`header-${gridData.key}`}>
        <div onClick={() => togglePanel(gridData.key)} tabIndex={0} aria-expanded={gridData.open} role="button" onKeyPress={handleKeyPress} sx={{
                    borderBottom: '1px solid transparent',
                    borderColor: 'ds.border.neutral.quiet.idle',
                    cursor: 'pointer',
                    height: '60px',
                    position: 'relative',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                }}>
          <Heading as="h2" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{
                    bottom: '12px',
                }}>
            {gridData.title}
          </Heading>
        </div>
      </div>,
            <CSSTransition key={`innerSection-${gridData.key}`} in={gridData.open} timeout={transitionTime} classNames={styleTransitions}>
        <section className={innerSectionClassname}>
          <ul sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                }}>
            {gridData.items.map((item, itemIdx) => renderItem(item, render, getKey ? getKey : () => defaultGetItemKey(gridIdx, itemIdx)))}
          </ul>
        </section>
      </CSSTransition>,
        ];
    };
    return (<div sx={{
            height: 'calc(100vh - 48px)',
            overflowY: 'auto',
            userSelect: 'none',
            '*': {
                userSelect: 'none',
            },
        }}>
      {data.map(renderGrid)}
    </div>);
};
export default GridView;
