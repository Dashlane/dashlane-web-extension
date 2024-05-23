import { AddIcon, CheckIcon, FlexChild, FlexContainer, Heading, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import { Badge, Button, colors, Paragraph as DSParagraph, Infobox, jsx, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { PricingTileData } from '../types';
const BADGE_HEIGHT = '16px';
const I18N_KEYS = {
    CURRENT: 'team_account_teamplan_changeplan_plans_plan_current',
    LIMITED_OFFER: 'team_account_teamplan_changeplan_plans_plan_limited_offer',
    PREVIOUS_PRICE: 'team_account_teamplan_changeplan_plans_previous_price',
    SELECTED: 'team_account_teamplan_changeplan_plans_selected',
    SELECT: 'team_account_teamplan_changeplan_plans_select',
    LIMITED_PRICE_INFOBOX: 'team_account_teamplan_changeplan_plans_limited_price_infobox',
};
interface Props {
    plan: PricingTileData;
    handleSelectClick?: undefined | (() => void);
    selected?: boolean;
}
export const PricingTile = ({ plan, handleSelectClick, selected }: Props) => {
    const { translate } = useTranslate();
    const { currentPlan, limitedOffer, heading, price, equivalentPrice, planName, footer, priceDescription1, priceDescription2, features, } = plan;
    return (<FlexContainer flexDirection="column" sx={{
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px',
            border: `1px solid ${currentPlan
                ? 'transparent'
                : colors.lightTheme.ds.border.neutral.quiet.idle}`,
            flexGrow: '1',
            flexShrink: 0,
            width: '188px',
            backgroundColor: currentPlan
                ? colors.lightTheme.ds.container.expressive.neutral.supershy.hover
                : null,
            padding: '16px',
            gap: '24px',
        }}>
      <FlexContainer flexDirection="column" gap="16px">
        <FlexContainer flexDirection="column" gap="8px">
          <div sx={{ minHeight: BADGE_HEIGHT }}>
            {currentPlan ? (<Badge label={translate(I18N_KEYS.CURRENT)}/>) : null}
            {limitedOffer ? (<Badge mood="brand" intensity="catchy" label={translate(I18N_KEYS.LIMITED_OFFER)}/>) : null}
          </div>
          <Paragraph bold size="medium">
            {translate(heading.key)}
          </Paragraph>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <FlexContainer gap="4px">
            {price ? (<Heading as="p" size="large">
                {price}
              </Heading>) : (<LoadingIcon size={44} color={colors.lightTheme.ds.text.neutral.standard}/>)}
            {equivalentPrice ? (<DSParagraph textStyle="ds.title.block.medium" color="ds.text.neutral.quiet" sx={{ whiteSpace: 'break-spaces' }}>
                {translate(I18N_KEYS.PREVIOUS_PRICE)}
                <br />
                <span sx={{ textDecoration: 'line-through' }}>
                  {equivalentPrice}
                </span>
              </DSParagraph>) : null}
          </FlexContainer>

          <FlexContainer flexDirection="column" sx={{ height: '48px' }}>
            <Paragraph size="x-small" color={colors.lightTheme.ds.text.neutral.quiet}>
              {translate(priceDescription1.key, priceDescription1.variables)}
            </Paragraph>
            <Paragraph size="x-small" color={colors.lightTheme.ds.text.neutral.quiet}>
              {translate(priceDescription2.key, priceDescription2.variables)}
            </Paragraph>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>

      {selected ? (<Button disabled mood="brand" size="small" type="button" fullsize icon={<CheckIcon />}>
          {translate(I18N_KEYS.SELECTED)}
        </Button>) : handleSelectClick ? (<Button mood="brand" size="small" onClick={handleSelectClick} fullsize data-testid={`btn-${planName}-select`}>
          {translate(I18N_KEYS.SELECT)}
        </Button>) : (<div style={{ height: '32px', width: '100%' }}/>)}

      <FlexContainer flexDirection="column" gap="6px">
        {features.map(({ key, icon, variables, loading }) => (<FlexContainer key={key} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                flexWrap: 'nowrap',
                strong: {
                    color: !currentPlan
                        ? colors.lightTheme.ds.text.neutral.catchy
                        : null,
                },
            }}>
            <FlexChild sx={{ width: '10px' }}>
              {icon === 'check' ? (<CheckIcon size={14}/>) : icon === 'add' ? (<AddIcon size={12}/>) : null}
            </FlexChild>

            {loading ? (<FlexChild sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: '1',
                }}>
                <LoadingIcon size={32} color={colors.lightTheme.ds.text.neutral.catchy}/>
              </FlexChild>) : (<Paragraph color={colors.lightTheme.ds.text.neutral.quiet} size="x-small">
                {key.includes('markup')
                    ? translate.markup(key, variables)
                    : translate(key, variables)}
              </Paragraph>)}
          </FlexContainer>))}
      </FlexContainer>
      {limitedOffer ? (<Infobox mood="brand" title={translate(I18N_KEYS.LIMITED_PRICE_INFOBOX)}/>) : null}
      {footer ? (<FlexContainer alignItems="center" gap="9px" sx={{ paddingLeft: '20px' }}>
          <Paragraph color={colors.lightTheme.ds.text.neutral.quiet} size="x-small">
            {footer.key.includes('markup')
                ? translate.markup(footer.key)
                : translate(footer.key)}
          </Paragraph>
        </FlexContainer>) : null}
    </FlexContainer>);
};
