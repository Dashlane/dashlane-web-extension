import { Fragment, useState } from 'react';
import classnames from 'classnames';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, YAxis, } from 'recharts';
import { addDays, differenceInDays, isSameDay, parseISO } from 'date-fns';
import { PasswordHealthHistory } from '@dashlane/team-admin-contracts';
import { HorizontalNavLink, HorizontalNavMenu } from '@dashlane/ui-components';
import { jsx, Paragraph } from '@dashlane/design-system';
import { GraphViewOptions } from 'team/constants';
import { assertUnreachable } from 'libs/assert-unreachable';
import useTranslate from 'libs/i18n/useTranslate';
import { CustomXAxis } from './custom-x-axis/CustomXAxis';
import { CustomTooltip, CustomTooltipProps, } from './custom-tooltip/CustomTooltip';
import tooltipStyles from './custom-tooltip/styles.css';
import lineGraphStyles from './styles.css';
const fillGapsInHistory = (history: PasswordHealthHistory[]) => {
    const { length } = history;
    if (length <= 2) {
        return history;
    }
    const firstDate = parseISO(history[0].date);
    const lastDate = parseISO(history[length - 1].date);
    const daysFromFirstToLastDate = differenceInDays(lastDate, firstDate);
    if (daysFromFirstToLastDate === length - 1) {
        return history;
    }
    const filledHistory: PasswordHealthHistory[] = [];
    let historyIndex = 0;
    let lastValidSecurityIndex = history[historyIndex].securityIndex;
    let dateAtHistoryIndex = firstDate;
    let currentDate = firstDate;
    for (let i = 0; i <= daysFromFirstToLastDate; i++) {
        if (isSameDay(currentDate, dateAtHistoryIndex)) {
            filledHistory.push(history[historyIndex]);
            lastValidSecurityIndex = history[historyIndex].securityIndex;
            historyIndex++;
            dateAtHistoryIndex = parseISO(history[historyIndex]?.date);
        }
        else {
            filledHistory.push({
                date: currentDate.toISOString().slice(0, 10),
                securityIndex: lastValidSecurityIndex,
            });
        }
        currentDate = addDays(currentDate, 1);
    }
    return filledHistory;
};
const determineHistoryToDisplay = (view: GraphViewOptions, filledHistory: PasswordHealthHistory[]) => {
    switch (view) {
        case GraphViewOptions.AllTime:
            return filledHistory;
        case GraphViewOptions.Last7Days:
            return filledHistory.slice(filledHistory.length - 7, filledHistory.length);
        case GraphViewOptions.Last30Days:
            return filledHistory.slice(filledHistory.length - 30, filledHistory.length);
        default:
            assertUnreachable(view);
    }
};
const I18N_KEYS = {
    GRAPH_SCORE_LEGEND: 'team_dashboard_graph_score_legend',
    GRAPH_7_DAYS_BUTTON: 'team_dashboard_graph_7_days_button',
    GRAPH_30_DAYS_BUTTON: 'team_dashboard_graph_30_days_button',
    GRAPH_ALL_TIME_BUTTON: 'team_dashboard_graph_all_time_button',
};
interface LineGraphProps {
    history: PasswordHealthHistory[];
    passwordHealthHistoryEmpty: boolean;
}
export const LineGraph = ({ history, passwordHealthHistoryEmpty, }: LineGraphProps) => {
    const [view, setView] = useState(GraphViewOptions.AllTime);
    const filledHistory = fillGapsInHistory(history);
    const historyToDisplay = determineHistoryToDisplay(view, filledHistory);
    const dataKey: keyof PasswordHealthHistory = 'securityIndex';
    const { translate } = useTranslate();
    return (<>
      <section className={classnames(lineGraphStyles.topSection, {
            [lineGraphStyles.addMarginTop]: passwordHealthHistoryEmpty,
        })}>
        <div className={tooltipStyles.legendItem}>
          <div className={tooltipStyles.legendIcon}/>
          <Paragraph textStyle="ds.body.helper.regular" color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.GRAPH_SCORE_LEGEND)}
          </Paragraph>
        </div>
        <HorizontalNavMenu>
          {filledHistory.length > 7 ? (<HorizontalNavLink label={translate(I18N_KEYS.GRAPH_7_DAYS_BUTTON)} selected={view === GraphViewOptions.Last7Days} onClick={() => {
                setView(GraphViewOptions.Last7Days);
            }} size="small"/>) : null}
          {filledHistory.length > 30 ? (<HorizontalNavLink label={translate(I18N_KEYS.GRAPH_30_DAYS_BUTTON)} selected={view === GraphViewOptions.Last30Days} onClick={() => {
                setView(GraphViewOptions.Last30Days);
            }} size="small"/>) : null}
          <HorizontalNavLink label={translate(I18N_KEYS.GRAPH_ALL_TIME_BUTTON)} selected={view === GraphViewOptions.AllTime} onClick={() => {
            if (filledHistory.length <= 7) {
                return;
            }
            setView(GraphViewOptions.AllTime);
        }} size="small"/>
        </HorizontalNavMenu>
      </section>
      <section sx={{
            width: '100%',
            height: '100px',
            flexGrow: 1,
        }}>
        <ResponsiveContainer sx={{ height: '100%', width: '100%' }}>
          <LineChart data={passwordHealthHistoryEmpty ? [] : historyToDisplay} sx={{ position: 'relative', right: '18px' }}>
            <CartesianGrid vertical={false}/>
            <YAxis domain={[0, 100]} tickFormatter={(percentage: number) => `${percentage}%`} fontSize="small"/>
            
            {CustomXAxis({
            historyToDisplay,
            passwordHealthHistoryEmpty,
            view,
        })}
            <Tooltip content={(props: CustomTooltipProps) => {
            const date = translate.shortDate(parseISO(props.label), {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
            });
            return <CustomTooltip {...props} label={date}/>;
        }} animationDuration={500} animationEasing="ease-out" cursor={!passwordHealthHistoryEmpty}/>
            <Line dataKey={dataKey} stroke={lineGraphStyles.lineColor} strokeWidth="2" dot={false} activeDot={{ strokeWidth: 0, r: 4 }} animationDuration={500} isAnimationActive/>
          </LineChart>
        </ResponsiveContainer>
      </section>
    </>);
};
