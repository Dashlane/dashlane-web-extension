import {
  AggregatedFieldContent,
  AggregatedFormContent,
} from "@dashlane/tiresias";
export interface InputField {
  classification: string;
  predictedClassification?: string;
  deepestFormContainer: boolean;
  iframeId: string;
  iframeUrl: string;
  iframeSandboxed?: boolean;
  precededByTextContent: boolean;
  context: AggregatedFieldContent;
}
export interface InputForm {
  classification: string;
  predictedClassification?: string;
  iframeId: string;
  iframeUrl: string;
  sandboxed?: boolean;
  fields: InputField[];
  hasCaptcha: boolean;
  context: AggregatedFormContent;
}
export interface AnalysisResults {
  url: string;
  lang: string;
  formElements: InputForm[];
  timeSpent: number;
  iframeId: string;
}
