export enum CancellationStep {
  SUBSCRIPTION = "subscription",
  CANCEL_CONFIRM = "cancelConfirm",
  CANCEL_COMPLETE = "cancelComplete",
  CANCEL_FAILURE = "cancelFailure",
  CANCEL_PENDING = "cancelPending",
  REFUND_COMPLETE = "refundComplete",
  REFUND_FAILURE = "refundFailure",
  REFUND_PENDING = "refundPending",
  INVOICE_LIST = "invoiceList",
  LOSS_AVERSION = "lossAversion",
}
export enum SurveyAnswer {
  AUTOFILL_DOESNT_WORK = "autofillDoesntWork",
  TECHNICAL_ISSUES = "technicalIssues",
  TOO_EXPENSIVE = "tooExpensive",
  MISSING_FEATURES = "missingFeatures",
  OTHER = "other",
}
