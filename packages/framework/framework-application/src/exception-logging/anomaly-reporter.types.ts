import {
  AnomalyCriticality,
  ExceptionReportInfo,
  MiscAnomalyReportInfo,
} from "@dashlane/framework-contracts";
export type ReportAnomalyParams = {
  readonly criticality: AnomalyCriticality;
  readonly message: string;
  readonly additionalInfo: string;
  readonly moduleNameOverride?: string;
  readonly useCaseIdOverride?: string;
  readonly useCaseNameOverride?: string;
  readonly useCaseStacktrace?: string[];
} & (ExceptionReportInfo | MiscAnomalyReportInfo);
