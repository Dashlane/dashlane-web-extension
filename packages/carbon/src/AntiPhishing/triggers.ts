import { State } from "Store";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception";
import { fileContentStrSelector } from "RemoteFileUpdates/selectors";
import { updateAntiPhishingURLList } from "./actions";
import { REMOTE_PHISHING_FILE } from "AntiPhishing/constants";
type PhishingFile = {
  fileFormat: number;
  domains: string[];
};
type RemotePhishingDomains = {
  fileFormat: number;
  domains: Set<string>;
};
function isPhishingFile(file: PhishingFile | undefined): file is PhishingFile {
  return file.fileFormat === 1 && Array.isArray(file.domains);
}
const getRemotePhishingDomains = (state: State): RemotePhishingDomains => {
  const phishingFileText: string | undefined = fileContentStrSelector(
    state,
    REMOTE_PHISHING_FILE
  );
  const phishingURLFile: PhishingFile = phishingFileText
    ? JSON.parse(phishingFileText)
    : [];
  if (!isPhishingFile(phishingURLFile)) {
    const message = `[Anti-Phishing]: File format is invalid`;
    const augmentedError = new Error(message);
    sendExceptionLog(augmentedError);
    return null;
  }
  return {
    domains: new Set(phishingURLFile.domains),
    fileFormat: phishingURLFile.fileFormat,
  };
};
export function triggerUpdatePhishingURLFile(
  coreServices: CoreServices,
  fileName: string
) {
  const { storeService } = coreServices;
  const state = storeService.getState();
  if (fileName === REMOTE_PHISHING_FILE) {
    const phishingDomains = getRemotePhishingDomains(state);
    if (phishingDomains) {
      storeService.dispatch(updateAntiPhishingURLList(phishingDomains.domains));
    }
  }
}
