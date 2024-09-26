import { PersonalData } from "Session/Store/personalData/types";
import { UrlFields } from "DataManagement/Credentials";
import { cleanUrlForPersonalData, getUpdatedTrustedUrlList } from "../url";
import { Credential } from "@dashlane/communication";
export const getCategoryIdByName = (
  personalData: PersonalData,
  category: string
) => {
  const categories = personalData.credentialCategories;
  if (!category) {
    return "";
  }
  const existingCategoryById = categories.find(
    (existingCategory) => existingCategory.Id === category
  );
  if (existingCategoryById) {
    return category;
  }
  const existingCategoryByName = categories.find(
    (existingCategory) => existingCategory.CategoryName === category
  );
  return existingCategoryByName?.Id;
};
export const getUrlFields = (
  credentialUrl: string,
  isUrlSelectedByUser: boolean,
  existingItem?: Credential
): UrlFields => {
  const urlHasBeenUpdated = existingItem?.Url !== credentialUrl;
  const newUrl = cleanUrlForPersonalData(credentialUrl, {
    keepQueryString: isUrlSelectedByUser,
  });
  const selectedUrlDetails =
    isUrlSelectedByUser && urlHasBeenUpdated
      ? {
          UserSelectedUrl: newUrl,
          UseFixedUrl: true,
        }
      : {
          UserSelectedUrl: existingItem?.UserSelectedUrl ?? "",
          UseFixedUrl: existingItem?.UseFixedUrl ?? false,
        };
  return {
    Url: newUrl,
    TrustedUrlGroup: getUpdatedTrustedUrlList(
      existingItem?.TrustedUrlGroup ?? [],
      newUrl
    ),
    ...selectedUrlDetails,
  };
};
