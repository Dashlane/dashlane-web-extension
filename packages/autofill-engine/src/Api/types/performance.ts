export interface UserFocusMetrics {
  sendingTime: number;
  receivingTime: number;
  processingEndTime: number;
}
export interface WebcardPerformanceMetrics {
  userFocus?: UserFocusMetrics;
}
