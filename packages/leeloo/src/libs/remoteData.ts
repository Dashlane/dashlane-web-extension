export interface NotAsked {
    type: 'NotAsked';
}
export interface Loading {
    type: 'Loading';
}
export interface Success<T> {
    type: 'Success';
    data: T;
}
export interface Err {
    type: 'Err';
    message: string;
}
export type RemoteData<T> = NotAsked | Loading | Success<T> | Err;
export type RemoteDataTypes = RemoteData<any>['type'];
export type RemoteDataEmptyTypes = NotAsked['type'] | Loading['type'];
export const getLoading = (): Loading => ({ type: 'Loading' });
export const getNotAsked = (): NotAsked => ({ type: 'NotAsked' });
export const getRemoteSuccess = <T>(data: T): RemoteData<T> => ({
    type: 'Success',
    data,
});
export const getRemoteError = <T>(err: any): RemoteData<T> => ({
    type: 'Err',
    message: String(err),
});
export const fromRemoteSuccess = <T>(remoteData: Success<T>): T => remoteData.data;
export type AsRemoteData<T extends Record<string, any>> = {
    [key in keyof T]: RemoteData<T[key]>;
};
