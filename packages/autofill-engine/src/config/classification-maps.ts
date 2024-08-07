import { FieldLabelToDataSource, FormLabelsType } from "./labels/labels";
import { BILLING_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/billing";
import { CHANGE_PASSWORD_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/change-password";
import { CONTACT_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/contact";
import { DEFAULT_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/default";
import { FORGOT_PASSWORD_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/forgot-password";
import { IDENTITY_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/identity";
import { LOGIN_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/login";
import { NEWSLETTER_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/newsletter";
import { OTHER_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/other";
import { PAYMENT_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/payment";
import { REGISTER_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/register";
import { SEARCH_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/search";
import { SHIPPING_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/shipping";
import { SHOPPING_BASKET_CLASSIFICATION_TO_DATA_SOURCE_MAPS } from "./classificationMaps/shopping-basket";
export const CLASSIFICATIONS_TO_DATA_SOURCE_MAPS: Record<
  FormLabelsType,
  Partial<FieldLabelToDataSource>
> = {
  billing: BILLING_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  change_password: CHANGE_PASSWORD_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  contact: CONTACT_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  default: DEFAULT_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  forgot_password: FORGOT_PASSWORD_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  identity: IDENTITY_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  login: LOGIN_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  newsletter: NEWSLETTER_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  other: OTHER_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  payment: PAYMENT_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  register: REGISTER_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  search: SEARCH_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  shipping: SHIPPING_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
  shopping_basket: SHOPPING_BASKET_CLASSIFICATION_TO_DATA_SOURCE_MAPS,
};
