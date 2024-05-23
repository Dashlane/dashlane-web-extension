import { jsx } from '@dashlane/design-system';
import { useEffect } from 'react';
import { FlexContainer, Heading, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useLocation } from 'libs/router';
import { BaseMarketingContainer } from 'auth/base-marketing-container/base-marketing-container';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import queryString from 'query-string';
const I18N_KEYS = {
    TITLE_NO_COMPANY: 'webapp_auth_panel_tsup_generic',
    TITLE_COMPANY: 'webapp_auth_panel_tsup_company_markup',
    SUBTITLE: 'webapp_auth_panel_tsup_subtitle',
};
export const TeamSignUpContainer = () => {
    const { translate } = useTranslate();
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const { getInviteLinkData, inviteLinkData } = useInviteLinkData();
    const prefilledTeamKey = queryParams.team ?? '';
    useEffect(() => {
        if (prefilledTeamKey) {
            getInviteLinkData(prefilledTeamKey);
        }
    }, [getInviteLinkData, prefilledTeamKey]);
    const teamName = inviteLinkData?.displayName;
    return (<BaseMarketingContainer>
      <div sx={{
            paddingLeft: '80px',
            paddingRight: '80px',
            width: '100%',
        }}>
        <FlexContainer gap={4} sx={{
            paddingTop: '240px',
            maxWidth: '66%',
            minWidth: '320px',
        }}>
          <Heading color="ds.text.neutral.catchy" size="large" sx={{
            textTransform: 'uppercase',
            em: { color: 'ds.text.brand.standard', fontStyle: 'inherit' },
        }}>
            {teamName ? (<div>
                {translate.markup(I18N_KEYS.TITLE_COMPANY, {
                companyName: `*${teamName}*`,
            })}
              </div>) : (<div>{translate(I18N_KEYS.TITLE_NO_COMPANY)}</div>)}
          </Heading>
          <Paragraph color="ds.text.neutral.quiet" size="large">
            {translate(I18N_KEYS.SUBTITLE)}
          </Paragraph>
        </FlexContainer>
      </div>
    </BaseMarketingContainer>);
};
