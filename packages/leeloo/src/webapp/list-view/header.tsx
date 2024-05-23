import { Icon, jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { OrderDir } from 'libs/sortHelper';
import { HeaderCell, SortingOptions } from './types';
import webappVariables from 'webapp/variables.css';
import { SX_STYLES } from './styles';
export interface Props {
    containerClassName?: string;
    header: HeaderCell[];
    options?: SortingOptions;
    onSort?: (options: SortingOptions) => void;
    sxProps?: Partial<ThemeUIStyleObject>;
}
export const Header = ({ containerClassName, header, options, onSort, sxProps = {}, }: Props): JSX.Element => {
    const sort = (key: string, logSubaction?: string, sortable?: boolean) => {
        if (!options || !onSort || !sortable) {
            return;
        }
        const sortingOptions: SortingOptions = {
            field: key,
            direction: options.field === key
                ? options.direction === OrderDir.ascending
                    ? OrderDir.descending
                    : OrderDir.ascending
                : OrderDir.ascending,
        };
        if (logSubaction) {
            sortingOptions.logSubaction = `${logSubaction}${sortingOptions.direction === OrderDir.descending ? 'Reversed' : ''}`;
        }
        onSort(sortingOptions);
    };
    const renderHeaderCell = (item: HeaderCell) => {
        let indicator = null;
        if (options) {
            const direction = options.direction;
            indicator =
                item.key === options.field ? (<Icon size="xsmall" color="ds.text.neutral.quiet" name={direction === OrderDir.descending
                        ? 'CaretDownOutlined'
                        : 'CaretUpOutlined'} sx={{ marginLeft: '8px' }}/>) : null;
        }
        return (<div key={item.key} className={item.className} data-testid={item.key} onClick={() => sort(item.key, item.logSubaction, item.sortable)} sx={mergeSx([
                SX_STYLES.CELL,
                item.sxProps ?? {},
                item.sortable
                    ? {
                        cursor: 'pointer',
                        userSelect: 'none',
                    }
                    : {},
            ])}>
        <Paragraph textStyle="ds.title.supporting.small" sx={{
                color: 'ds.text.neutral.quiet',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'uppercase',
            }}>
          {item.content}
        </Paragraph>
        {indicator}
      </div>);
    };
    return (<div className={containerClassName} sx={mergeSx([
            SX_STYLES.ROW,
            sxProps,
            {
                height: webappVariables['--dashlane-credentials-table-header-height'],
            },
        ])}>
      <div sx={mergeSx([SX_STYLES.CELLS_WRAPPER, SX_STYLES.BORDER])}>
        {header.map((item: HeaderCell) => renderHeaderCell(item))}
      </div>
    </div>);
};
