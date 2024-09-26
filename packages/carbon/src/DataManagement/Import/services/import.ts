import {
  BaseDataModelObject,
  Country,
  ImportFormats,
  ImportPersonalDataItemsResponse,
  ImportPersonalDataState,
  ImportPersonalDataStateType,
  PreviewPersonalDataErrorType,
  PreviewPersonalDataRequest,
  PreviewPersonalDataResult,
} from "@dashlane/communication";
import { platformInfoSelector } from "Authentication/selectors";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { first } from "rxjs/operators";
import { CoreServices } from "Services";
import { StoreService } from "Store";
import { importPersonalDataState$ } from "../live";
import { isImportPersonalDataAvailableSelector } from "../selectors";
import { notifyNewImportPersonalDataStateAction } from "../state/actions";
import { importPersonalDataItems } from "./import-data/import-items";
import { getImportablePersonalData } from "./parse-data/parse-csv";
import {
  checkPassword,
  getSaveEventsFromDash,
  parseDashData,
} from "./parse-data/parse-dash";
export interface ImportInfrastructure {
  previewPersonalDataArchive: (
    command: PreviewPersonalDataRequest
  ) => Promise<PreviewPersonalDataResult>;
  canDoImport: () => boolean;
  onNewState: (newState: ImportPersonalDataState) => void;
  importPersonalDataItems: (
    items: BaseDataModelObject[]
  ) => Promise<ImportPersonalDataItemsResponse>;
  waitReady: () => Promise<void>;
}
const previewPersonalDataArchive = async (
  storeService: StoreService,
  command: PreviewPersonalDataRequest
): Promise<PreviewPersonalDataResult> => {
  const platformInfo = platformInfoSelector(storeService.getState());
  switch (command.format) {
    case ImportFormats.Csv: {
      const imported = getImportablePersonalData(
        command.content,
        Country[platformInfo.country]
      );
      if (imported.items.length === 0) {
        return {
          success: false,
          error: PreviewPersonalDataErrorType.InvalidFormat,
        };
      }
      return {
        success: true,
        data: {
          items: imported.items,
          headers: imported.headers,
        },
      };
    }
    case ImportFormats.Dash: {
      const data = parseDashData(command.content.data);
      const valid = await checkPassword(storeService, data, command.password);
      if (!valid) {
        return {
          success: false,
          error: PreviewPersonalDataErrorType.BadPassword,
        };
      }
      const parsedData = await getSaveEventsFromDash(
        storeService,
        data,
        command.password
      );
      return {
        success: true,
        data: {
          items: parsedData.map((e) => ({
            baseDataModel: e,
            rawData: {},
          })),
          headers: [],
        },
      };
    }
  }
  assertUnreachable(command);
};
export const makeImportService = (
  coreServices: CoreServices
): ImportInfrastructure => {
  const { storeService } = coreServices;
  return {
    previewPersonalDataArchive: (command) =>
      previewPersonalDataArchive(storeService, command),
    canDoImport: () =>
      isImportPersonalDataAvailableSelector(storeService.getState()),
    importPersonalDataItems: (items) =>
      importPersonalDataItems(coreServices, items),
    onNewState: (state) =>
      storeService.dispatch(notifyNewImportPersonalDataStateAction(state)),
    waitReady: async () => {
      await importPersonalDataState$()(storeService.getState$())
        .pipe(first((x) => x.status !== ImportPersonalDataStateType.Processing))
        .toPromise();
    },
  };
};
