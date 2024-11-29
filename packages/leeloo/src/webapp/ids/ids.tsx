import { Lee } from "../../lee";
import { getCurrentSpaceId } from "../../libs/webapp";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { IdsContent } from "./content/content";
import { PersonalDataSectionView } from "../personal-data-section-view/personal-data-section-view";
import { getCurrentCountry } from "./helpers";
interface IdsProps {
  lee: Lee;
}
export const Ids = ({ lee }: IdsProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <PersonalDataSectionView>
      <IdsContent
        userEditDocumentRoute={routes.userEditIdDocument}
        currentSpaceId={getCurrentSpaceId(lee.globalState)}
        currentCountry={getCurrentCountry(lee.carbon.currentLocation)}
        currentLocation={lee.carbon.currentLocation}
      />
    </PersonalDataSectionView>
  );
};
