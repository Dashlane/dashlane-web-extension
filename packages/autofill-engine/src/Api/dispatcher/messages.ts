export enum DispatcherMessages {
  GetWebcardInitialData = "GetWebcardInitialData",
  UpdateWebcardGeometry = "UpdateWebcardGeometry",
  WebcardOpened = "WebcardOpened",
  WebcardClosed = "WebcardClosed",
  IframeEvent = "IframeEvent",
  KeyboardNavigationEvent = "KeyboardNavigationEvent",
  SubscribeKeyboardNavigationEvents = "SubscribeKeyboardNavigationEvents",
  RemoveSubscriptionsForClosedWebcard = "RemoveSubscriptionsForClosedWebcard",
  VisibilityCheckRequest = "VisibilityCheckRequest",
  GetAllowAttributeForIframe = "GetAllowAttributeForIframe",
}
