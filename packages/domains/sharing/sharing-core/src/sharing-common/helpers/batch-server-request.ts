import { ServerJsonSuccess } from "@dashlane/server-sdk";
export const batchServerRequest = async <T, U>(
  params: Array<T>,
  request: (params: Array<T>) => Promise<ServerJsonSuccess<U>>,
  defaultBatchSize = 5,
  maxBatchCount = 10
): Promise<ServerJsonSuccess<U>[]> => {
  const batchSize =
    params.length >= 20
      ? Math.ceil(params.length / maxBatchCount)
      : defaultBatchSize;
  const batchedParams: Array<T[]> = [];
  for (let i = 0; i < params.length; i += batchSize) {
    batchedParams.push(params.slice(i, i + batchSize));
  }
  const batchedPromises = batchedParams.map((batch) => request(batch));
  return Promise.all(batchedPromises);
};
