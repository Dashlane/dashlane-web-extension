import {
  AutofillableDataModel,
  AutofillDataSourceRef,
  AutofillDataSourceType,
  isDashlaneDisabledPermanently,
  isOtherSourceType,
  isVaultSourceType,
  OtherSourceType,
  UserAutofillCorrection,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import {
  DataModelType,
  GetLoginStatus,
  vaultSourceTypeToDataModelTypeMap,
} from "@dashlane/communication";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { ParsedURL } from "@dashlane/url-parser";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AnalysisResults,
  InputField,
  InputForm,
} from "../../../Api/types/analysis";
import {
  AutofillIngredient,
  AutofillRecipe,
  AutofillRecipeByFieldId,
  AutofillRecipeBySourceType,
  AutofillRecipeForField,
  AutofillRecipeForForm,
  AutofillRecipesByFormId,
  FieldFormat,
  isVaultIngredient,
  UnrecognizedField,
} from "../../../Api/types/autofill";
import { CLASSIFICATIONS_TO_DATA_SOURCE_MAPS } from "../../../config/classification-maps";
import {
  parseFieldClassifications,
  parseFormClassifications,
} from "../../../config/helpers/parser";
import {
  ExtraValuesAndDataSource,
  FieldLabel,
  FieldLabelToDataSource,
  FieldMainLabelsType,
  FormLabelsType,
  SomeFieldExtraLabel,
} from "../../../config/labels/labels";
import {
  getAllAutofillDataFromVault,
  getDashlaneDefinedLinkedWebsites,
} from "../../abstractions/vault/get";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import {
  findAndApplyAutologinRecipe,
  isAutologinAllowedOnTheTab,
} from "../autofill/autologin";
import {
  isExtraLabelInFieldClassification,
  isLabelInFormClassification,
} from "../autofill/utils";
import { checkHasOneClickFormFill } from "../../../config/feature-flips";
import { forgetDataCaptureStepData } from "../dataCapture/credential-capture-helpers";
import { getUserAutofillCorrections } from "./user-autofill-correction";
import { isAnalyisEnabledOnUrl } from "./utils";
import { fetchAutofillableVaultViewsForIngredient } from "../autofill/user-focus-on-element-handler";
const extractMatchingAndNonMatchingExtraValues = <
  T extends FieldMainLabelsType
>(
  fieldLabel: FieldLabel<T>,
  extraValues: SomeFieldExtraLabel<T>[]
) => ({
  matching: fieldLabel.extra.filter((value) => extraValues.includes(value))
    .length,
  nonMatching:
    fieldLabel.extra.filter((value) => !extraValues.includes(value)).length +
    extraValues.filter((value) => !fieldLabel.extra.includes(value)).length,
});
const isBetterDataSourcesMatch = (
  currentBestDataSources: AutofillDataSourceRef,
  matching: number,
  nonMatching: number,
  highestMatching: number,
  lowestNonMatching: number
) =>
  matching > highestMatching ||
  (matching === highestMatching && nonMatching < lowestNonMatching) ||
  (matching === highestMatching &&
    nonMatching === lowestNonMatching &&
    Object.keys(currentBestDataSources).length === 0);
const findBestDataSourcesForLabels = <T extends FieldMainLabelsType>(
  formLabel: FormLabelsType,
  fieldLabel: FieldLabel<T>
): ExtraValuesAndDataSource<T> | undefined => {
  let bestSource: ExtraValuesAndDataSource<T> | undefined = undefined;
  let nMatch = 0;
  let nDontMatch = 1000;
  const dataSourcesForForm: ExtraValuesAndDataSource<T>[] =
    CLASSIFICATIONS_TO_DATA_SOURCE_MAPS[formLabel][
      fieldLabel.main as keyof FieldLabelToDataSource
    ];
  if (!dataSourcesForForm) {
    return;
  }
  for (const possibleSource of dataSourcesForForm) {
    const { matching, nonMatching } = extractMatchingAndNonMatchingExtraValues(
      fieldLabel,
      possibleSource.extraValues
    );
    if (
      !bestSource ||
      isBetterDataSourcesMatch(
        bestSource.source,
        matching,
        nonMatching,
        nMatch,
        nDontMatch
      )
    ) {
      bestSource = possibleSource;
      nMatch = matching;
      nDontMatch = nonMatching;
    }
  }
  return bestSource;
};
export const insertIngredientInRecipesBySourceType = (
  ingredient: AutofillIngredient,
  iframeId: string,
  fieldId: string,
  fieldClassification: string,
  recipesBySourceType: AutofillRecipeBySourceType
): AutofillRecipe => {
  const sourceType =
    ingredient.type === OtherSourceType.SubmitButton
      ? VaultSourceType.Credential
      : ingredient.type;
  const recipe = recipesBySourceType[sourceType] ?? {
    ingredients: [],
  };
  recipesBySourceType[sourceType] = recipe;
  recipe.ingredients.push({
    frameId: iframeId,
    srcElementId: fieldId,
    fieldClassification,
    ingredient,
  });
  return recipe;
};
const insertRecipeInRecipesByFieldId = (
  recipe: AutofillRecipe,
  type: AutofillDataSourceType,
  field: InputField,
  fieldFormat: FieldFormat,
  persistentIdentifier: string,
  recipesByFieldId: AutofillRecipeByFieldId
): void => {
  const fieldId = field.context.rId;
  const recipesForField: AutofillRecipeForField = recipesByFieldId[fieldId] ?? {
    fieldId,
    frameId: field.iframeId,
    fieldClassification: field.classification,
    fieldFormat,
    persistentIdentifier,
    knownValue: false,
    recipesBySourceType: {},
  };
  recipesByFieldId[fieldId] = recipesForField;
  const recipeForField = recipesForField.recipesBySourceType[type] ?? recipe;
  recipesForField.recipesBySourceType[type] = recipeForField;
};
export const buildIngredientsFromDataSources = (
  dataSources?: AutofillDataSourceRef,
  fieldFormat?: FieldFormat
): AutofillIngredient[] => {
  const ingredients: AutofillIngredient[] = [];
  if (dataSources) {
    (Object.keys(dataSources) as Array<keyof AutofillDataSourceRef>).forEach(
      (key) => {
        ingredients.push({
          type: key,
          property: dataSources[key],
          format: fieldFormat,
        });
      }
    );
  }
  return ingredients;
};
const getFieldPersistentValue = (
  form: InputForm,
  field: InputField
): string => {
  const formIdForUserDefined = `form-${form.context.attributes}`;
  const elementIdForUserDefined = `${field.context.type.toLowerCase()}-${
    field.context.attributes
  }`;
  return `ML@${formIdForUserDefined}@${elementIdForUserDefined}`;
};
const pushIngredientsFromUserAutofillCorrection = (
  ingredients: AutofillIngredient[],
  userAutofillCorrection: UserAutofillCorrection,
  fieldFormat: FieldFormat
) => {
  if (!isDashlaneDisabledPermanently(userAutofillCorrection)) {
    ingredients.push(
      ...buildIngredientsFromDataSources(
        userAutofillCorrection.correctedDataSource as AutofillDataSourceRef,
        fieldFormat
      )
    );
  }
};
const pushIngredientsFromFieldAndFormClassification = (
  ingredients: AutofillIngredient[],
  fieldClassification: string,
  formClassification: string,
  fieldFormat: FieldFormat,
  disabledSourceTypes: string[]
) => {
  const formLabels = parseFormClassifications(formClassification);
  const fieldLabels = parseFieldClassifications(fieldClassification);
  let bestDataSources: AutofillDataSourceRef | undefined = undefined;
  let nMatch = 0;
  let nDontMatch = 1000;
  for (const formLabel of formLabels) {
    for (const fieldLabel of fieldLabels) {
      const possibleSources =
        findBestDataSourcesForLabels(formLabel, fieldLabel) ??
        findBestDataSourcesForLabels("default", fieldLabel);
      if (!possibleSources) {
        continue;
      }
      const { matching, nonMatching } =
        extractMatchingAndNonMatchingExtraValues(
          fieldLabel,
          possibleSources.extraValues
        );
      if (
        !bestDataSources ||
        isBetterDataSourcesMatch(
          bestDataSources,
          matching,
          nonMatching,
          nMatch,
          nDontMatch
        )
      ) {
        bestDataSources = possibleSources.source;
        nMatch = matching;
        nDontMatch = nonMatching;
      }
    }
  }
  const allowedDataSources = (
    Object.keys(bestDataSources ?? {}) as Array<keyof AutofillDataSourceRef>
  )
    .filter((dataSource) => {
      if (isVaultSourceType(dataSource)) {
        return !disabledSourceTypes.includes(
          vaultSourceTypeToDataModelTypeMap[dataSource]
        );
      }
      if (isOtherSourceType(dataSource)) {
        return !disabledSourceTypes.includes(DataModelType.KWAuthentifiant);
      }
      return true;
    })
    .reduce((obj, key) => {
      obj[key] = (bestDataSources ?? {})[key];
      return obj;
    }, {} as AutofillDataSourceRef);
  ingredients.push(
    ...buildIngredientsFromDataSources(allowedDataSources, fieldFormat)
  );
  if (
    fieldLabels.some(({ main }) => main === "webauthn") &&
    !Object.keys(allowedDataSources).includes(
      OtherSourceType.WebauthnConditionalUI
    )
  ) {
    ingredients.push(
      ...buildIngredientsFromDataSources({
        [OtherSourceType.WebauthnConditionalUI]:
          OtherSourceType.WebauthnConditionalUI,
      })
    );
  }
};
const addPostfillRecipes = (
  autofillRecipesByFieldId: AutofillRecipeByFieldId,
  autofillRecipesBySourceType: AutofillRecipeBySourceType
) => {
  const candidatesRecipesEntries = Object.entries(
    autofillRecipesBySourceType
  ) as [AutofillDataSourceType, AutofillRecipe][];
  const invalidSourcesForPostfill: AutofillDataSourceType[] = [
    OtherSourceType.NewPassword,
    VaultSourceType.Credential,
    VaultSourceType.GeneratedPassword,
    VaultSourceType.PaymentCard,
    VaultSourceType.SocialSecurityId,
  ];
  Object.values(autofillRecipesByFieldId).forEach((recipesForField) => {
    const sourceTypesToFillElement = Object.keys(
      recipesForField.recipesBySourceType
    );
    if (sourceTypesToFillElement.includes(OtherSourceType.NewPassword)) {
      return;
    }
    const postfillRecipes: AutofillRecipeBySourceType = {};
    candidatesRecipesEntries.forEach(([sourceType, recipe]) => {
      if (
        !sourceTypesToFillElement.includes(sourceType) &&
        !invalidSourcesForPostfill.includes(sourceType)
      ) {
        postfillRecipes[sourceType] = { ingredients: recipe.ingredients };
      }
    });
    if (Object.keys(postfillRecipes).length > 0) {
      Object.values(recipesForField.recipesBySourceType).forEach(
        (recipeForField) => {
          recipeForField.postfillRecipes = postfillRecipes;
        }
      );
    }
  });
};
const getPartNumberBasedOnCurrentAndPreviousField = (
  currentField: InputField,
  previousField?: InputField,
  previousPartNumber?: number
): number | undefined => {
  const currentFieldIsPart = isExtraLabelInFieldClassification(
    currentField.classification,
    "part"
  );
  if (!currentFieldIsPart) {
    return undefined;
  }
  if (
    typeof previousPartNumber === "number" &&
    currentField.classification === previousField?.classification &&
    currentField.context.type === previousField.context.type
  ) {
    return previousPartNumber + 1;
  }
  return 0;
};
const createAutofillRecipesForForm = (
  form: InputForm,
  userAutofillCorrections: UserAutofillCorrection[],
  hasOneClickFormFillFeature: boolean,
  disabledSourceTypes: string[]
): AutofillRecipeByFieldId => {
  const autofillRecipesByFieldId: AutofillRecipeByFieldId = {};
  const autofillRecipesBySourceType: AutofillRecipeBySourceType = {};
  let previousPartNumber: number | undefined;
  form.fields.forEach((field, index) => {
    const currentPartNumber = getPartNumberBasedOnCurrentAndPreviousField(
      field,
      form.fields[index - 1],
      previousPartNumber
    );
    const ingredients: AutofillIngredient[] = [];
    const fieldFormat: FieldFormat = {
      dateFormat: field.context.dateFormat,
      dateSeparator: field.context.dateSeparator,
      partNumber: currentPartNumber,
      optionLabels: field.context.optionLabels,
      optionValues: field.context.optionValues,
    };
    previousPartNumber = currentPartNumber;
    const validUserAutofillCorrection = userAutofillCorrections.find(
      (correction) =>
        correction.fieldIdentifier === getFieldPersistentValue(form, field)
    );
    if (validUserAutofillCorrection) {
      pushIngredientsFromUserAutofillCorrection(
        ingredients,
        validUserAutofillCorrection,
        fieldFormat
      );
    } else {
      pushIngredientsFromFieldAndFormClassification(
        ingredients,
        field.classification,
        form.classification,
        fieldFormat,
        disabledSourceTypes
      );
    }
    for (const ingredient of ingredients) {
      const recipe = insertIngredientInRecipesBySourceType(
        ingredient,
        field.iframeId,
        field.context.rId,
        field.classification,
        autofillRecipesBySourceType
      );
      insertRecipeInRecipesByFieldId(
        recipe,
        ingredient.type,
        field,
        fieldFormat,
        getFieldPersistentValue(form, field),
        autofillRecipesByFieldId
      );
    }
  });
  if (
    !isLabelInFormClassification(form.classification, "login") &&
    hasOneClickFormFillFeature
  ) {
    addPostfillRecipes(autofillRecipesByFieldId, autofillRecipesBySourceType);
  }
  return autofillRecipesByFieldId;
};
const isFieldDisabledPermanently = (
  field: InputField,
  form: InputForm,
  userAutofillCorrections: UserAutofillCorrection[]
) =>
  userAutofillCorrections.some(
    (correction) =>
      correction.fieldIdentifier === getFieldPersistentValue(form, field) &&
      isDashlaneDisabledPermanently(correction)
  );
const createUnrecognizedFields = (
  results: AnalysisResults,
  userAutofillCorrections: UserAutofillCorrection[]
): UnrecognizedField[] => {
  const unrecognizedFields: UnrecognizedField[] = [];
  for (const form of results.formElements) {
    const otherFields = form.fields.filter(
      (field) =>
        field.classification === "other" ||
        isFieldDisabledPermanently(field, form, userAutofillCorrections)
    );
    if (otherFields.length > 0) {
      unrecognizedFields.push(
        ...otherFields.map((field) => ({
          ...field,
          persistentIdentifier: getFieldPersistentValue(form, field),
          formId: form.context.rId,
        }))
      );
    }
  }
  return unrecognizedFields;
};
const createAutofillRecipes = (
  results: AnalysisResults,
  userAutofillCorrections: UserAutofillCorrection[],
  hasOneClickFormFillFeature: boolean,
  disabledSourceTypes: string[]
): AutofillRecipesByFormId => {
  const recipesByForm: AutofillRecipesByFormId = {};
  for (const form of results.formElements) {
    const formId = form.context.rId;
    recipesByForm[formId] = {
      formId,
      frameId: form.iframeId,
      frameSandboxed: form.sandboxed,
      formClassification: form.classification,
      recipesByField: createAutofillRecipesForForm(
        form,
        userAutofillCorrections,
        hasOneClickFormFillFeature,
        disabledSourceTypes
      ),
    };
  }
  return recipesByForm;
};
const insertDataAvailabilityInRecipe = async (
  context: AutofillEngineContext,
  tabUrl: string,
  autofillRecipeForField: AutofillRecipeForField
) => {
  const recipeEntries = Object.entries(
    autofillRecipeForField.recipesBySourceType
  ) as [AutofillDataSourceType, AutofillRecipe][];
  for (const [sourceType, autofillRecipe] of recipeEntries) {
    if (autofillRecipeForField.knownValue) {
      return;
    }
    const ingredientInRecipe = autofillRecipe.ingredients.find(
      ({ frameId, srcElementId }) =>
        frameId === autofillRecipeForField.frameId &&
        srcElementId === autofillRecipeForField.fieldId
    );
    if (!ingredientInRecipe) {
      continue;
    }
    const autofillIngredient = ingredientInRecipe.ingredient;
    autofillRecipeForField.knownValue =
      !isVaultSourceType(sourceType) ||
      (autofillIngredient.type === sourceType &&
        isVaultIngredient(autofillIngredient) &&
        (
          await fetchAutofillableVaultViewsForIngredient(
            context,
            tabUrl,
            autofillIngredient
          )
        ).length > 0);
  }
};
const populateAutofillRecipesWithDataAvailability = async (
  context: AutofillEngineContext,
  tabUrl: string,
  autofillRecipes: AutofillRecipesByFormId
) => {
  for (const formId in autofillRecipes) {
    for (const fieldId in autofillRecipes[formId].recipesByField) {
      await insertDataAvailabilityInRecipe(
        context,
        tabUrl,
        autofillRecipes[formId].recipesByField[fieldId]
      );
    }
  }
};
export const analysisResultsAvailableHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  results: AnalysisResults
): Promise<void> => {
  if (!sender.tab?.url) {
    return;
  }
  const tabUrl = sender.tab.url;
  if (
    !(await isAnalyisEnabledOnUrl(
      context.connectors,
      context.grapheneClient,
      tabUrl
    ))
  ) {
    actions.updateAutofillRecipes(AutofillEngineActionTarget.AllFrames, {});
    return;
  }
  const tabRootDomain = new ParsedURL(tabUrl).getRootDomain();
  const tabFullDomain = new ParsedURL(tabUrl).getHostname();
  let hasOneClickFormFillFeature = false;
  const { loggedIn }: GetLoginStatus =
    await context.connectors.carbon.getUserLoginStatus();
  let userAutofillCorrectionsOnDomain: UserAutofillCorrection[] = [];
  let disabledSourceTypes: AutofillableDataModel[] = [];
  if (loggedIn) {
    hasOneClickFormFillFeature = await checkHasOneClickFormFill(
      context.connectors
    );
    const autofillSettings = await getQueryValue(
      context.grapheneClient.autofillSettings.queries.getAutofillSettings()
    );
    disabledSourceTypes = isSuccess(autofillSettings)
      ? autofillSettings.data.disabledSourceTypes
      : [];
    userAutofillCorrectionsOnDomain = (
      await getUserAutofillCorrections(context)
    ).filter((correction) => correction.domain === tabFullDomain);
  }
  const autofillRecipes = createAutofillRecipes(
    results,
    userAutofillCorrectionsOnDomain,
    hasOneClickFormFillFeature,
    disabledSourceTypes
  );
  const unrecognizedFields = createUnrecognizedFields(
    results,
    userAutofillCorrectionsOnDomain
  );
  const isConditionalUIFormPresent = Object.values(autofillRecipes).some(
    (formRecipe: AutofillRecipeForForm) => {
      return Object.values(formRecipe.recipesByField).some(
        (fieldRecipe: AutofillRecipeForField) => {
          return (
            OtherSourceType.WebauthnConditionalUI in
            fieldRecipe.recipesBySourceType
          );
        }
      );
    }
  );
  const state = await context.state.tab.get();
  if (tabRootDomain !== state.lastAutologin?.domain) {
    await context.state.tab.set({
      ...state,
      lastAutologin: undefined,
    });
  }
  if (
    state.dataCaptureStepData &&
    tabRootDomain !== state.dataCaptureStepData.domain &&
    !(await getDashlaneDefinedLinkedWebsites(context, tabUrl)).includes(
      state.dataCaptureStepData.domain
    )
  ) {
    await forgetDataCaptureStepData(context);
  }
  if (loggedIn) {
    await populateAutofillRecipesWithDataAvailability(
      context,
      tabUrl,
      autofillRecipes
    );
  }
  actions.updateAutofillRecipes(
    AutofillEngineActionTarget.AllFrames,
    autofillRecipes
  );
  actions.updateUnrecognizedElements(
    AutofillEngineActionTarget.AllFrames,
    unrecognizedFields
  );
  const isConditionalUIFormWithMatchingPasskeysInVault =
    loggedIn &&
    isConditionalUIFormPresent &&
    (
      await getAllAutofillDataFromVault({
        context,
        url: results.url,
        vaultType: VaultSourceType.Passkey,
        queryOptions: {
          sortCriteria: [{ field: "lastUse", direction: "descend" }],
          filterCriteria: [],
        },
      })
    ).length > 0;
  if (
    !isConditionalUIFormWithMatchingPasskeysInVault &&
    (await isAutologinAllowedOnTheTab(tabUrl, results, context))
  ) {
    await findAndApplyAutologinRecipe(
      context,
      actions,
      sender,
      autofillRecipes
    );
  }
};
