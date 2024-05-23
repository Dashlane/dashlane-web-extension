import { Fragment } from 'react';
import { FlexChild } from '@dashlane/ui-components';
import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { privacyItemList } from './resources/data';
const I18N_KEYS = {
    TITLE: 'webapp_privacy_settings_data_rights_title',
    DESCRIPTION: 'webapp_privacy_settings_data_rights_description',
};
export const DataRightsSection = () => {
    const { translate } = useTranslate();
    return (<>
      <FlexChild sx={{ marginTop: '32px' }}>
        <Heading as="h2" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
          {translate(I18N_KEYS.TITLE)}
        </Heading>
        <Paragraph sx={{ margin: '32px 0' }}>
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </FlexChild>

      {privacyItemList.map((privacyItem) => {
            return (<FlexChild key={privacyItem.title} sx={{ marginBottom: '16px', width: '100%' }}>
            <Heading as="h3" sx={{ margin: '8px 0' }}>
              {translate(privacyItem.title)}
            </Heading>
            <Paragraph sx={{ margin: '16px 0' }}>
              {translate(privacyItem.description)}
            </Paragraph>
            {privacyItem.cta ? (<Button intensity="quiet" role="link" onClick={() => {
                        window.open(privacyItem.cta.link);
                    }}>
                {translate(privacyItem.cta.label)}
              </Button>) : null}
            <hr sx={{
                    borderTop: '1px solid ds.border.neutral.standard.idle',
                    marginBottom: '0rem',
                    marginTop: '2rem',
                    width: '100%',
                }}/>
          </FlexChild>);
        })}
    </>);
};
