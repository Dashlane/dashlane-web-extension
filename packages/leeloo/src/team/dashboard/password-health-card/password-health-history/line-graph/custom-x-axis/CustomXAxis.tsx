import React from "react";
import { XAxis } from "recharts";
import {
  GraphViewOptions,
  MINIMUM_MONTH_COUNT_TO_OMIT_DATE,
} from "../../../../../constants";
import { assertUnreachable } from "../../../../../../libs/assert-unreachable";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { TranslatorInterface } from "../../../../../../libs/i18n/types";
import { LocaleFormat } from "../../../../../../libs/i18n/helpers";
import { PasswordHealthHistory } from "@dashlane/team-admin-contracts";
const determineMonthCount = (firstHistoryEntryDateString: string) => {
  const currentDate = new Date();
  const firstHistoryEntryDate = new Date(firstHistoryEntryDateString);
  let monthCount =
    (currentDate.getFullYear() - firstHistoryEntryDate.getFullYear()) * 12;
  monthCount -= firstHistoryEntryDate.getMonth();
  monthCount += currentDate.getMonth();
  return monthCount + 1;
};
const determineTicks = (
  view: GraphViewOptions,
  historyToDisplay: PasswordHealthHistory[],
  monthCount: number
) => {
  const ticks: string[] = [];
  switch (view) {
    case GraphViewOptions.AllTime: {
      if (monthCount >= MINIMUM_MONTH_COUNT_TO_OMIT_DATE && monthCount <= 8) {
        historyToDisplay.forEach((historyEntry) => {
          const { date } = historyEntry;
          if (new Date(date).getDate() === 1) {
            ticks.push(date);
          }
        });
        break;
      }
      const { length } = historyToDisplay;
      if (length <= 7) {
        historyToDisplay.forEach((historyEntry) => {
          ticks.push(historyEntry.date);
        });
        break;
      }
      const dayInterval = length / 7;
      let floatingIndex = length - 1;
      while (floatingIndex >= 0) {
        ticks.push(historyToDisplay[Math.round(floatingIndex)]?.date);
        floatingIndex -= dayInterval;
      }
      break;
    }
    case GraphViewOptions.Last7Days:
      historyToDisplay.forEach((historyEntry) => {
        ticks.push(historyEntry.date);
      });
      break;
    case GraphViewOptions.Last30Days:
      historyToDisplay.forEach((historyEntry) => {
        const { date } = historyEntry;
        if (new Date(date).getDay() === 0) {
          ticks.push(date);
        }
      });
      break;
    default:
      assertUnreachable(view);
  }
  return ticks;
};
const formatDate = (
  date: string,
  view: GraphViewOptions,
  monthCount: number,
  translate: TranslatorInterface
) => {
  const minimumMonthsToOmitDateReached =
    view === GraphViewOptions.AllTime &&
    monthCount >= MINIMUM_MONTH_COUNT_TO_OMIT_DATE;
  const dateObj = new Date(date);
  const formattedDate = translate.shortDate(
    dateObj,
    minimumMonthsToOmitDateReached ? LocaleFormat.MMM_YYYY : LocaleFormat.L_M_D
  );
  const longMonth = translate.shortDate(dateObj, LocaleFormat.MMMM);
  if (minimumMonthsToOmitDateReached) {
    return formattedDate === longMonth || formattedDate.endsWith(".")
      ? formattedDate
      : `${formattedDate}.`;
  }
  const [month, day] = formattedDate.split(" ");
  return month === longMonth ? formattedDate : `${month}. ${day}`;
};
interface CustomXAxisProps {
  historyToDisplay: PasswordHealthHistory[];
  passwordHealthHistoryEmpty: boolean;
  view: GraphViewOptions;
}
export const CustomXAxis = ({
  historyToDisplay,
  passwordHealthHistoryEmpty,
  view,
}: CustomXAxisProps) => {
  const { translate } = useTranslate();
  const monthCount =
    historyToDisplay.length !== 0
      ? determineMonthCount(historyToDisplay[0].date)
      : 0;
  determineTicks(view, historyToDisplay, monthCount);
  return (
    <XAxis
      dataKey="date"
      ticks={
        passwordHealthHistoryEmpty
          ? []
          : determineTicks(view, historyToDisplay, monthCount)
      }
      tickSize={4}
      tickFormatter={
        passwordHealthHistoryEmpty
          ? () => ""
          : (date: string) => formatDate(date, view, monthCount, translate)
      }
      fontSize="small"
    />
  );
};
