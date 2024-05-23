import { Offer } from '@dashlane/team-admin-contracts';
import { AddIcon, Button, colors, FlexChild, FlexContainer, Heading, Link, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import { Badge, Infobox, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useLimitedBusinessOfferData } from 'team/limited-business-offer/use-limited-business-offer-data';
import { getMonthlySeatPrice } from '../utils';
const SSO_URL = '*****';
const SCIM_URL = '*****';
const FAMILY_PLAN_URL = '*****';
const I18N_KEYS = {
    PLAN_RECOMMENDED: 'team_account_teamplan_changeplan_plans_plan_recommended',
    PLAN_LIMITED_OFFER: 'team_account_teamplan_changeplan_plans_plan_limited_offer',
    BUSINESS_HEADER: 'team_account_teamplan_changeplan_plans_business_header',
    BUSINESS_NAME: 'team_account_teamplan_changeplan_plans_business_name',
    PLAN_SEATS: 'team_account_teamplan_changeplan_plans_seat',
    BILLED_ANNUALLY: 'team_account_teamplan_changeplan_plans_billed_anually',
    SAML: 'team_account_teamplan_changeplan_plans_business_saml_markup',
    SCIM_PROVISIONING: 'team_account_teamplan_changeplan_plans_business_scim_provisioning',
    FAMILY_PLAN: 'team_account_teamplan_changeplan_plans_business_free_family_plan_markup',
    PLANS_SELECTED: 'team_account_teamplan_changeplan_plans_selected',
    PLANS_SELECT: 'team_account_teamplan_changeplan_plans_select',
    PREVIOUS_PRICE: 'team_account_teamplan_changeplan_plans_previous_price',
    LIMITED_PRICE_INFOBOX: 'team_account_teamplan_changeplan_plans_limited_price_infobox',
};
interface BusinessCardProps {
    handleSelectClick: undefined | (() => void);
    selected: boolean;
    businessOffer: Offer | undefined;
}
export const BusinessCard = ({ handleSelectClick, selected, businessOffer, }: BusinessCardProps) => {
    const { translate } = useTranslate();
    const limitedBusinessOfferData = useLimitedBusinessOfferData();
    const monthlySeatPrice = businessOffer
        ? getMonthlySeatPrice({
            offer: businessOffer,
        })
        : null;
    return (<FlexContainer flexDirection="column" sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '367px',
            padding: '18px 28px 32px',
            border: `1px solid ${colors.dashGreen05}`,
            borderRadius: '4px',
            gap: '18px',
        }}>
      {limitedBusinessOfferData.hasLimitedOffer ? (<Badge mood="brand" intensity="catchy" label={translate(I18N_KEYS.PLAN_LIMITED_OFFER)}/>) : (<Badge mood="brand" intensity="quiet" label={translate(I18N_KEYS.PLAN_RECOMMENDED)}/>)}
      <FlexContainer fullWidth gap="12px">
        <FlexContainer fullWidth>
          <FlexContainer sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Heading size="x-small">
              {translate(I18N_KEYS.BUSINESS_NAME)}
            </Heading>
          </FlexContainer>
          <FlexChild>
            {businessOffer?.currency && monthlySeatPrice ? (<FlexContainer flexDirection="column" alignItems="flex-end">
                <FlexContainer alignItems="flex-end" gap="0" flexDirection="column">
                  <Paragraph size="small">
                    {translate.price(businessOffer.currency, monthlySeatPrice / 100, {
                notation: 'compact',
            })}{' '}
                    {translate(I18N_KEYS.PLAN_SEATS)}
                  </Paragraph>
                  {limitedBusinessOfferData.hasLimitedOffer ? (<Paragraph size="small" color="ds.text.neutral.quiet">
                      {translate(I18N_KEYS.PREVIOUS_PRICE)}{' '}
                      <span sx={{ textDecoration: 'line-through' }}>
                        {limitedBusinessOfferData.translatedEquivalentPrice}
                      </span>
                    </Paragraph>) : null}
                </FlexContainer>
                <Paragraph color="ds.text.neutral.quiet" size="x-small">
                  {translate(I18N_KEYS.BILLED_ANNUALLY)}
                </Paragraph>
              </FlexContainer>) : (<LoadingIcon size={16} color={colors.black}/>)}
          </FlexChild>
        </FlexContainer>
        <hr style={{
            width: '100%',
            borderTop: `1px solid ${colors.grey02}`,
            borderBottom: '0',
            margin: '0',
        }}/>
      </FlexContainer>
      <FlexChild flex="1">
        <FlexContainer flexDirection="column" gap="6px">
          <Paragraph color={colors.grey00} size="x-small">
            {translate(I18N_KEYS.BUSINESS_HEADER)}
          </Paragraph>
          <FlexContainer alignItems="center" gap="9px" sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            marginTop: '10px',
        }}>
            <AddIcon size={8}/>
            <Paragraph size="x-small" color={colors.black}>
              {translate.markup(I18N_KEYS.SAML, { ssoUrl: SSO_URL }, { linkTarget: '_blank' }, { color: colors.black })}
            </Paragraph>
          </FlexContainer>
          <FlexContainer alignItems="center" gap="9px">
            <AddIcon size={8}/>
            <Paragraph size="x-small">
              <Link rel="noopener noreferrer" href={SCIM_URL} target="_blank">
                {translate(I18N_KEYS.SCIM_PROVISIONING)}
              </Link>
            </Paragraph>
          </FlexContainer>
          <FlexContainer alignItems="center" gap="9px">
            <AddIcon size={8}/>
            <Paragraph size="x-small" color={colors.black}>
              {translate.markup(I18N_KEYS.FAMILY_PLAN, { familyPlanUrl: FAMILY_PLAN_URL }, { linkTarget: '_blank' }, { color: colors.black })}
            </Paragraph>
          </FlexContainer>
        </FlexContainer>
      </FlexChild>
      {limitedBusinessOfferData.hasLimitedOffer ? (<Infobox title={translate(I18N_KEYS.LIMITED_PRICE_INFOBOX)} mood="brand"/>) : null}
      {businessOffer ? (selected ? (<Button sx={{ width: '100%' }} disabled nature="secondary" size="small" type="button">
            {translate(I18N_KEYS.PLANS_SELECTED)}
          </Button>) : (<Button data-testid="btn-business-select" sx={{ width: '100%' }} size="small" type="button" onClick={handleSelectClick}>
            {translate(I18N_KEYS.PLANS_SELECT)}
          </Button>)) : (<FlexContainer justifyContent="center" fullWidth>
          <LoadingIcon size={30} color={colors.black}/>
        </FlexContainer>)}
    </FlexContainer>);
};
