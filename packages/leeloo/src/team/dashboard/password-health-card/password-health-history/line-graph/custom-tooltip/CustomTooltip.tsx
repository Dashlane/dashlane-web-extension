import React from "react";
import { roundToFirstDecimalOrInt } from "../../../../../utils";
import styles from "./styles.css";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  GRAPH_SCORE_HOVER_LEGEND: "team_dashboard_graph_score_hover_legend",
};
export interface CustomTooltipProps {
  active: boolean;
  label: string;
  payload: [
    {
      value: number;
    }
  ];
}
export const CustomTooltip = ({
  active,
  label,
  payload,
}: CustomTooltipProps) => {
  const { translate } = useTranslate();
  if (!active) {
    return null;
  }
  const score = payload
    ? `${roundToFirstDecimalOrInt(payload[0]?.value)}%`
    : null;
  return (
    <div className={styles.customTooltipContainer}>
      <time className={styles.date}>{label}</time>
      <div className={styles.score}>
        <div className={styles.legendItem}>
          <div className={styles.legendIcon} />
          <p>{translate(I18N_KEYS.GRAPH_SCORE_HOVER_LEGEND)}</p>
        </div>
        <p>{score}</p>
      </div>
    </div>
  );
};
