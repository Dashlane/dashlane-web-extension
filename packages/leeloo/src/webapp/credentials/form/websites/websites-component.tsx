import * as React from "react";
import { MainWebsiteField } from "./main-website-field";
interface Props {
  children: React.ReactElement;
  url: string;
  hasUrlError: boolean;
  editViewButtonEnabled: boolean;
  isWebsiteFieldReadonly: boolean;
  handleMainWebsiteChange: (
    eventOrValue: React.ChangeEvent<any> | any,
    key?: string
  ) => void;
  handleGoToWebsite: () => void;
}
export const WebsitesComponent = ({
  children,
  url,
  hasUrlError,
  isWebsiteFieldReadonly,
  editViewButtonEnabled,
  handleMainWebsiteChange,
  handleGoToWebsite,
}: Props) => {
  return (
    <div>
      <MainWebsiteField
        url={url}
        hasUrlError={hasUrlError}
        editViewButtonEnabled={editViewButtonEnabled}
        handleChange={handleMainWebsiteChange}
        handleGoToWebsite={handleGoToWebsite}
        isWebsiteFieldReadonly={isWebsiteFieldReadonly}
        isUsingNewDesign
      />
      {children}
    </div>
  );
};
