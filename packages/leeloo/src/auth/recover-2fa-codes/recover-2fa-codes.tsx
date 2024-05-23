import React, { useState } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { DLogo, FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Recover2faCodesRequestComponent } from './request-2fa-codes';
import { RecoverOtpCodesSuccessComponent } from './success-2fa-codes';
const I18N_KEYS = {
    HEADER: {
        TITLE: 'webapp_recover_otp_codes_header_title',
        SUBTITLE: 'webapp_recover_otp_codes_header_subtitle',
    },
};
export const Recover2FaCodes = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const { translate } = useTranslate();
    return (<div sx={{
            height: '100vh',
            width: '100%',
            bg: 'ds.background.alternate',
        }}>
      <FlexContainer flexDirection={'column'}>
        <FlexContainer sx={{
            bg: 'ds.container.agnostic.neutral.standard',
            padding: '32px',
            alignSelf: 'stretch',
            justifyContent: 'center',
            gap: '8px',
        }}>
          <FlexContainer sx={{
            maxWidth: '800px',
            alignItems: 'center',
            gap: '16px',
            flex: '1 0 0',
        }}>
            <DLogo size={48} color="ds.oddity.brand"/>
            <Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
              {translate(I18N_KEYS.HEADER.TITLE)}
            </Heading>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer flexDirection={'column'} alignItems={'center'} gap={'24px'} sx={{
            marginLeft: 'auto',
            marginRight: 'auto',
            flexDirection: 'column',
            padding: '24px 24px 160px 24px',
            maxWidth: '848px',
            alignItems: 'center',
            alignSelf: 'stretch',
        }}>
          <FlexContainer gap={'16px'} sx={{
            padding: '24px',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
            borderRadius: '8px',
            border: '1px solid transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            bg: 'ds.container.agnostic.neutral.supershy',
        }}>
            {isSuccess ? (<RecoverOtpCodesSuccessComponent />) : (<Recover2faCodesRequestComponent onSuccess={() => setIsSuccess(true)}/>)}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </div>);
};
