import { colors, jsx, Paragraph, Thumbnail } from '@dashlane/ui-components';
import { Leaks } from '@dashlane/communication';
import { LocalizedDateTime } from 'libs/i18n/localizedDateTime';
import { LocaleFormat } from 'libs/i18n/helpers';
import { BREACH_DATA_TYPES_I18N_KEYS } from './table-accordion-row';
import useTranslate from 'libs/i18n/useTranslate';
import { fromUnixTime } from 'date-fns';
interface ReportTableProps {
    breach: Leaks;
    opened: boolean;
    id: string;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}
export const TableAccordionDetailRow = ({ breach, id, isFirstInGroup = false, isLastInGroup = false, opened = false, }: ReportTableProps) => {
    const { translate } = useTranslate();
    const affectedData = (breachTypes: string[]) => {
        const uniqueData = breachTypes
            .map((type) => {
            return translate(BREACH_DATA_TYPES_I18N_KEYS[type]);
        })
            .join(', ');
        return uniqueData;
    };
    return (<tr id={id} sx={{
            backgroundColor: colors.grey06,
            borderLeft: `3px solid ${colors.dashGreen00}`,
            display: opened ? 'table-row' : 'none',
            height: '44px',
            '> td': {
                verticalAlign: 'middle',
                padding: '5px 16px',
                paddingTop: isFirstInGroup ? '18px' : undefined,
                paddingBottom: isLastInGroup ? '18px' : undefined,
            },
        }}>
      
      
      <td colSpan={2}>
        <Paragraph size="small" as="div" sx={{
            fontWeight: 'light',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        }}>
          <div sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        }}>
            {breach.domain && breach.domain !== '' ? (<Thumbnail size="small" text={breach.domain} backgroundColor={colors.dashGreen00}/>) : null}
            <div title={breach.domain} sx={{
            paddingLeft: '8px',
            width: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}>
              {breach.domain}
            </div>
          </div>
        </Paragraph>
      </td>
      
      <td>
        <Paragraph sx={{
            '::first-letter': {
                textTransform: 'uppercase',
            },
            textTransform: 'lowercase',
        }} size="x-small" color={colors.grey00}>
          {affectedData(breach.types)}
        </Paragraph>
      </td>
      
      <td colSpan={3}>
        <Paragraph size="x-small" as="span" color={colors.grey00}>
          <LocalizedDateTime date={fromUnixTime(breach.breachDateUnix)} format={LocaleFormat.ll}/>
        </Paragraph>
      </td>
    </tr>);
};
