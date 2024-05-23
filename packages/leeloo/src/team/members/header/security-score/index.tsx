import * as React from 'react';
import { Maybe } from 'tsmonad';
import SecurityScoreBadge from 'team/members/security-score-badge';
import { roundToFirstDecimalOrInt } from 'team/utils';
import styles from './styles.css';
import useTranslate from 'libs/i18n/useTranslate';
import { Icon, jsx } from '@dashlane/design-system';
import { Tooltip } from '@dashlane/ui-components';
const I18N_KEYS = {
    SECURITY_SCORE_LABEL: 'team_members_team_security_score_label',
    SECURITY_SCORE_UPDATE_FREQUENCY: 'team_account_heading_security_score_update_frequency',
};
const SecurityScore = ({ score }: {
    score: Maybe<number>;
}) => {
    const { translate } = useTranslate();
    return (<div className={styles.separator}>
      <SecurityScoreBadge score={score} size="medium">
        <div sx={{
            color: 'ds.text.neutral.standard',
        }}>
          {translate(I18N_KEYS.SECURITY_SCORE_LABEL)}

          <Tooltip placement="left" content={translate(I18N_KEYS.SECURITY_SCORE_UPDATE_FREQUENCY)}>
            <span>
              <Icon name="FeedbackInfoOutlined" sx={{
            display: 'inline-block',
            marginLeft: '4px',
        }} size="xsmall" color="ds.text.neutral.standard"/>
            </span>
          </Tooltip>
        </div>
        <div className={styles.score}>
          {score
            .map((scoreValue) => `${roundToFirstDecimalOrInt(scoreValue)}%`)
            .valueOr('–')}
        </div>
      </SecurityScoreBadge>
    </div>);
};
export default SecurityScore;
