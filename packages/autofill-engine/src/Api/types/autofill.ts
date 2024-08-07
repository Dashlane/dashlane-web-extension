import {
  AutofillDataSourceType,
  isOtherSourceType,
  isVaultSourceType,
  OtherSourceType,
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import type {
  AutofillDataSource,
  OtherDataSource,
  VaultAutofillView,
  VaultDataSource,
} from "@dashlane/communication";
import {
  CredentialSecurityStatus,
  FieldsFilledByCount,
  FormType,
  MatchType,
} from "@dashlane/hermes";
import { AggregatedFieldContent } from "@dashlane/tiresias";
import { InputField } from "./analysis";
import { WebauthnGetConditionalUiRequest } from "./webauthn";
import { SrcElementDetails } from "./webcards/autofill-dropdown-webcard";
import { WebcardType } from "./webcards/webcard-data-base";
import { RiskType } from "@dashlane/password-security-contracts";
import {
  DateFormat,
  DateSeparator,
  ParsedDate,
} from "../../implementation/abstractions/formatting/formatters/Dates/types";
const isVaultDataSource = (
  dataSource: AutofillDataSource
): dataSource is VaultDataSource => isVaultSourceType(dataSource.type);
const isOtherDataSource = (
  dataSource: AutofillDataSource
): dataSource is OtherDataSource => isOtherSourceType(dataSource.type);
export type SomeVaultIngredient<T extends keyof VaultAutofillViewInterfaces> = {
  type: T;
  property: keyof VaultAutofillViewInterfaces[T];
  format?: FieldFormat;
};
type AllVaultIngredients<T> = T extends keyof VaultAutofillViewInterfaces
  ? SomeVaultIngredient<T>
  : never;
export type VaultIngredient = AllVaultIngredients<VaultSourceType>;
export type OtherSourceIngredient = {
  type: OtherSourceType;
};
export type AutofillIngredient = VaultIngredient | OtherSourceIngredient;
export const isVaultIngredient = (
  ingredient: AutofillIngredient
): ingredient is VaultIngredient => isVaultSourceType(ingredient.type);
export const isOtherSourceIngredient = (
  ingredient: AutofillIngredient
): ingredient is OtherSourceIngredient => isOtherSourceType(ingredient.type);
export type IngredientAndVaultItem = {
  ingredient: VaultIngredient;
  vaultItem: VaultAutofillView;
};
export interface AutofillRecipe {
  ingredients: {
    frameId: string;
    fieldClassification: string;
    srcElementId: string;
    ingredient: AutofillIngredient;
  }[];
  postfillRecipes?: AutofillRecipeBySourceType;
}
export type AutofillRecipeBySourceType = Partial<
  Record<AutofillDataSourceType, AutofillRecipe>
>;
export interface FieldDetails {
  fieldId: string;
  frameId: string;
  fieldClassification: string;
  fieldFormat: FieldFormat;
  persistentIdentifier: string;
}
export interface FieldFormat {
  dateFormat: AggregatedFieldContent["dateFormat"];
  dateSeparator: AggregatedFieldContent["dateSeparator"];
  partNumber?: number;
  optionLabels?: AggregatedFieldContent["optionLabels"];
  optionValues?: AggregatedFieldContent["optionValues"];
}
export interface AutofillRecipeForField extends FieldDetails {
  knownValue: boolean;
  recipesBySourceType: AutofillRecipeBySourceType;
}
export type AutofillRecipeByFieldId = {
  [srcElementId: string]: AutofillRecipeForField;
};
export interface FormDetails {
  formId: string;
  frameId: string;
  frameSandboxed?: boolean;
  formClassification: string;
}
export interface AutofillRecipeForForm extends FormDetails {
  recipesByField: AutofillRecipeByFieldId;
}
export type AutofillRecipesByFormId = {
  [srcFormId: string]: AutofillRecipeForForm;
};
export interface UnrecognizedField extends InputField {
  formId?: string;
  persistentIdentifier?: string;
}
export type UnrecognizedFieldsByElementId = {
  [srcEltId: string]: {
    formId: string;
    formClassification: string;
    iframeId: string;
    iframeSandboxed: boolean;
    fieldInfo: UnrecognizedField;
  };
};
export interface FocusInformations extends SrcElementDetails {
  formClassification: string;
  autofillRecipes: AutofillRecipeBySourceType;
  conditionalUiRequest?: WebauthnGetConditionalUiRequest;
}
export interface FormInformation {
  domain: string;
  manuallyFilledValues: string[];
}
export interface FormSubmitLogOptions {
  fieldsFilledBy: FieldsFilledByCount;
  formLoadedAtDateTime: string;
  formSubmittedAtDateTime: string;
  formType: FormType;
  hasModifiedInitiallyAutofilledValue: boolean;
  hasPasswordField: boolean;
  fieldsDetectedByAnalysisEngineCount: number;
  totalFormFieldsCount: number;
}
export enum AutofillOperationType {
  Fill = "fill",
  Click = "click",
}
interface AutofillOperationBase {
  operationType: AutofillOperationType;
  srcElementId: string;
  frameId: string;
}
export interface FillOperation extends AutofillOperationBase {
  operationType: AutofillOperationType.Fill;
  dataSource: FillOperationSource | FillDateOperation;
  forceAutofill: boolean;
  hasLimitedRights: boolean;
}
export interface FillOperationSource {
  type: VaultSourceType;
  value: string;
}
export interface FillDateOperation {
  type: VaultSourceType;
  date: ParsedDate;
  format: DateFormat;
  separator: DateSeparator;
}
export interface ClickOperation extends AutofillOperationBase {
  operationType: AutofillOperationType.Click;
}
export interface AutofillOperations {
  formClassification: string;
  requestOrigin: AutofillRequestOrigin;
  tabRootDomain: string;
  [AutofillOperationType.Fill]: FillOperation[];
  [AutofillOperationType.Click]: ClickOperation[];
  matchType: MatchType;
  passwordHealthStatus?: CredentialSecurityStatus;
  itemInfos?: AutofillPerformedInfos;
}
export enum AutofillRequestOriginType {
  Automatic = "automatic",
  Webcard = "webcard",
  UserAppliedAutofillCorrection = "autofillCorrection",
}
export type AutofillRequestOrigin =
  | AutofillRequestFromWebcard
  | AutofillRequestFromUserAppliedCorrection
  | AutofillRequestAutomatic;
type AutofillRequestFromWebcard = {
  readonly type: AutofillRequestOriginType.Webcard;
  readonly webcardType: WebcardType;
};
type AutofillRequestFromUserAppliedCorrection = {
  readonly type: AutofillRequestOriginType.UserAppliedAutofillCorrection;
};
type AutofillRequestAutomatic = {
  readonly type: AutofillRequestOriginType.Automatic;
};
interface AutofillDetailsBase {
  autofillRecipe: AutofillRecipe;
  formClassification: string;
  requestOrigin: AutofillRequestOrigin;
  focusedElement?: {
    elementId: string;
    frameId: string;
  };
}
export interface AutofillDetailsForOtherDataSource extends AutofillDetailsBase {
  dataSource: OtherDataSource;
}
export interface AutofillDetailsForVaultDataSource extends AutofillDetailsBase {
  dataSource: VaultDataSource;
}
export type AutofillDetails =
  | AutofillDetailsForOtherDataSource
  | AutofillDetailsForVaultDataSource;
export const isAutofillDetailsForVaultDataSource = (
  autofillDetails: AutofillDetails
): autofillDetails is AutofillDetailsForVaultDataSource =>
  isVaultDataSource(autofillDetails.dataSource);
export const isAutofillDetailsForOtherDataSource = (
  autofillDetails: AutofillDetails
): autofillDetails is AutofillDetailsForOtherDataSource =>
  isOtherDataSource(autofillDetails.dataSource);
export interface AutofillableElementValue {
  ingredients: AutofillIngredient[];
  value: string;
  hasLimitedRights?: boolean;
}
export interface AutofillableElementValues {
  [srcElementId: string]: AutofillableElementValue;
}
export interface AutofillableFormValues extends FormDetails {
  elementValues: AutofillableElementValues;
  preventDataCapture: boolean;
}
export interface AutofillableFormsValues {
  [srcFormId: string]: AutofillableFormValues;
}
export enum DisableDashlaneOnFieldOption {
  TemporarilyDisable = "temporarilyDisable",
  PermanentlyDisable = "permanentlyDisable",
}
export const isValidDataSourceTypeForRecipe = (type: AutofillDataSourceType) =>
  type !== OtherSourceType.SubmitButton;
export interface RightClickInformations extends SrcElementDetails {
  formClassification: string;
  elementHasImpala: boolean;
}
export interface UserPasteDecision {
  allowedByUser: boolean;
  urlOfCopiedItem: string;
  urlOfPasteDestination: string;
}
export type AutofillCredentialRisk = Exclude<RiskType, RiskType.Excluded>;
export type AutofillCredentialsAtRisk = Record<string, AutofillCredentialRisk>;
export interface AutofillPerformedCredential {
  type: VaultSourceType.Credential;
  id: string;
  login: string;
  domain: string;
}
export interface AutofillPerformedPayment {
  type: VaultSourceType.PaymentCard | VaultSourceType.BankAccount;
  item_name: string;
}
export type AutofillPerformedInfos =
  | AutofillPerformedCredential
  | AutofillPerformedPayment;
