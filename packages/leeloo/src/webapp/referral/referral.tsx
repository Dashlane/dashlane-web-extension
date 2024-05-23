import { Fragment, useEffect, useState } from 'react';
import { FlexContainer, LoadingIcon } from '@dashlane/ui-components';
import { Button, colors, Heading, Icon, Infobox, jsx, Paragraph, TextField, } from '@dashlane/design-system';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { accountReferralApi } from '@dashlane/account-contracts';
import { Button as ButtonClickEvent, PageView, UserClickEvent, } from '@dashlane/hermes';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Header } from 'webapp/components/header/header';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { FEEDBACK_TEXT_TIMEOUT, I18N_KEYS } from './constants';
import { ReferralForm } from './components/referral-form';
export const Referral = () => {
    const { translate } = useTranslate();
    const [isCopied, setIsCopied] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [xUrl, setXUrl] = useState('');
    const shareLinkInfo = useModuleQuery(accountReferralApi, 'getSharingLink');
    const isShareLinkSuccess = shareLinkInfo.status === DataStatus.Success;
    useEffect(() => {
        logPageView(PageView.Referral);
    }, []);
    useEffect(() => {
        const sharingBaseUrl = '*****';
        const xPostIntentUrl = '*****';
        const xPostText = translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SHARE_ON_X_INTENT_TEXT);
        if (!shareLink && isShareLinkSuccess) {
            setShareLink(`${sharingBaseUrl}${shareLinkInfo.data.sharingId}`);
        }
        if (!xUrl && isShareLinkSuccess) {
            setXUrl(`${xPostIntentUrl}?text=${xPostText}&url=${sharingBaseUrl}${shareLinkInfo.data.sharingId}`);
        }
    }, [shareLinkInfo]);
    return (<>
      {shareLinkInfo.status === DataStatus.Loading ? (<FlexContainer sx={{
                flexDirection: 'column',
                margin: 'auto ',
                textAlign: 'center',
                alignItems: 'center',
            }}>
          <LoadingIcon size={88} color={colors.lightTheme.ds.text.brand.quiet} strokeWidth={1}/>
        </FlexContainer>) : null}
      {isShareLinkSuccess ? (<>
          <Header startWidgets={() => (<Heading as="h1" color="ds.text.neutral.catchy" textStyle="ds.title.section.large">
                {translate(I18N_KEYS.REFERRAL_PAGE_TITLE)}
              </Heading>)} endWidget={<>
                <HeaderAccountMenu />
                <NotificationsDropdown />
              </>}/>
          <div sx={{
                height: '100%',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
            }}>
            <Infobox title={translate(I18N_KEYS.REFERRAL_PAGE_INFOBOX_TITLE)} description={<>
                  <Paragraph>
                    {translate(I18N_KEYS.REFERRAL_PAGE_INFOBOX_DESCRIPTION_1)}
                  </Paragraph>
                  <Paragraph>
                    {translate(I18N_KEYS.REFERRAL_PAGE_INFOBOX_DESCRIPTION_2)}
                  </Paragraph>
                </>} mood="brand" size="large"/>
            <div sx={{
                maxWidth: '732px',
                borderBottom: '1px solid ds.border.neutral.quiet.idle',
            }}>
              <Heading as="h2" color="ds.text.neutral.catchy" textStyle="ds.title.section.medium">
                {translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SUBTITLE)}
              </Heading>
              <div sx={{
                display: 'flex',
                gap: '16px',
            }}>
                <div sx={{
                width: '100%',
                padding: '24px 0 32px',
            }}>
                  <TextField actions={[
                <Button aria-label="copy" icon={<Icon name="ActionCopyOutlined"/>} intensity="supershy" key="copy" layout="iconTrailing" onClick={() => {
                        logEvent(new UserClickEvent({
                            button: ButtonClickEvent.CopyReferralLink,
                        }));
                        void navigator.clipboard.writeText(shareLink);
                        setIsCopied(true);
                        setTimeout(() => {
                            setIsCopied(false);
                        }, FEEDBACK_TEXT_TIMEOUT);
                    }}>
                        {translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_BUTTON_TEXT)}
                      </Button>,
            ]} feedback={isCopied
                ? {
                    text: translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SUCCESS_MESSAGE),
                }
                : undefined} label={translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_TEXT_FIELD_LABEL)} readOnly value={shareLink}/>
                </div>
                <Button aria-label="share" icon={<Icon name="SocialTwitterFilled"/>} intensity="quiet" key="share" layout="iconLeading" onClick={() => {
                logEvent(new UserClickEvent({
                    button: ButtonClickEvent.ShareReferralLinkOnX,
                }));
                openUrl(xUrl);
            }} size="large" sx={{
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
                marginTop: '28px',
            }}>
                  {translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SHARE_ON_X_TEXT)}
                </Button>
              </div>
            </div>
            <div sx={{
                maxWidth: '732px',
            }}>
              <Heading as="h2" color="ds.text.neutral.catchy" textStyle="ds.title.section.medium">
                {translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_SUBTITLE)}
              </Heading>
              <ReferralForm />
            </div>
          </div>
        </>) : null}
    </>);
};
