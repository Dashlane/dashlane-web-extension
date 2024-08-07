import {
  FIELD_EXTRA_VALUES,
  FIELD_MAIN_LABELS,
  FieldLabel,
  FieldMainLabelsType,
  FORM_LABELS,
  FormLabelsType,
} from "../labels/labels";
export const parseFieldClassifications = (
  classification: string
): FieldLabel<FieldMainLabelsType>[] => {
  const labels: readonly string[] = classification.toLowerCase().split(",");
  const mainLabels = labels.filter((label) =>
    FIELD_MAIN_LABELS.includes(label as FieldMainLabelsType)
  ) as FieldMainLabelsType[];
  const extraValues = labels.filter(
    (label) => !FIELD_MAIN_LABELS.includes(label as FieldMainLabelsType)
  );
  return mainLabels.map(
    (label) =>
      ({
        main: label,
        extra: extraValues.filter((extra) =>
          FIELD_EXTRA_VALUES[label].includes(extra as never)
        ),
      } as FieldLabel<typeof label>)
  );
};
export const parseFormClassifications = (
  classification: string
): FormLabelsType[] =>
  classification
    .toLowerCase()
    .split(",")
    .filter((label) =>
      FORM_LABELS.includes(label as FormLabelsType)
    ) as FormLabelsType[];
