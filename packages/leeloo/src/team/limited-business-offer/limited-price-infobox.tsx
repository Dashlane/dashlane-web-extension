import { Fragment } from 'react';
import { Heading, Infobox, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamOffers } from 'team/hooks/use-team-offers';
import { useLimitedBusinessOfferData } from './use-limited-business-offer-data';
const I18N_KEYS = {
    TITLE: 'team_dashboard_upgrade_tile_infobox_title',
    PRICE: 'team_dashboard_upgrade_tile_infobox_price',
    DESCRIPTION: 'team_dashboard_upgrade_tile_infobox_description',
};
export const LimitedPriceInfobox = () => {
    const { translate } = useTranslate();
    const teamOffers = useTeamOffers();
    const limitedBusinessOfferData = useLimitedBusinessOfferData();
    if (!teamOffers || !limitedBusinessOfferData.hasLimitedOffer) {
        return null;
    }
    const { translatedEquivalentPrice, translatedPrice } = limitedBusinessOfferData;
    return (<Infobox title={translate(I18N_KEYS.TITLE)} description={<>
          <Heading as="h5" textStyle="ds.title.block.small" color="ds.text.brand.standard" sx={{ marginBottom: '4px' }}>
            <span sx={{ textDecoration: 'line-through' }}>
              {translatedEquivalentPrice}
            </span>{' '}
            {translatedPrice} {translate(I18N_KEYS.PRICE)}
          </Heading>
          <Paragraph textStyle="ds.body.helper.regular" color="ds.text.brand.standard">
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>
        </>} mood="brand"/>);
};
