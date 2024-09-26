import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { PasswordHistoryItemView } from "@dashlane/communication";
import { getViewedPasswordHistoryBatchSelector } from "DataManagement/PasswordHistory/selectors";
import { parseToken } from "Libs/Query";
import { StateOperator } from "Shared/Live";
import { sameBatch } from "Libs/Pagination/same-batch";
export const passwordHistoryBatch$ = (
  stringToken: string
): StateOperator<PasswordHistoryItemView[]> => {
  const token = parseToken(stringToken);
  const selector = getViewedPasswordHistoryBatchSelector(token);
  return pipe(map(selector), distinctUntilChanged(sameBatch));
};
