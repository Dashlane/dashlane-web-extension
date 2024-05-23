import React from 'react';
import { Lee } from 'lee';
import { getCurrentSpaceId } from 'libs/webapp';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { IdsContent } from 'webapp/ids/content/content';
import { IdsHeader } from 'webapp/ids/ids-header';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { getCurrentCountry } from './helpers';
interface IdsProps {
    lee: Lee;
}
export const Ids = ({ lee }: IdsProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    return (<PersonalDataSectionView>
      <IdsHeader currentLocation={lee.carbon.currentLocation}/>
      <IdsContent userEditDocumentRoute={routes.userEditIdDocument} currentSpaceId={getCurrentSpaceId(lee.globalState)} currentCountry={getCurrentCountry(lee.carbon.currentLocation)}/>
    </PersonalDataSectionView>);
};
