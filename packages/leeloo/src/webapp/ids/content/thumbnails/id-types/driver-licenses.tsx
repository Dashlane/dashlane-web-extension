import { Country } from '@dashlane/communication';
import { CountryZone, getCountryZone } from 'libs/countryHelper';
import { ThumbnailSize } from 'webapp/ids/types';
const regionMapping = {
    EU: 'eu',
    US: 'us',
    UNIVERSAL: 'row',
};
export const DriverLicenseThumbnail = (size: ThumbnailSize, country: string) => {
    let region = regionMapping[country] ?? regionMapping.UNIVERSAL;
    if (getCountryZone(Country[country]) === CountryZone.EUROPE) {
        region = regionMapping.EU;
    }
    return `/driver-licenses/${region}-${size}.svg`;
};
