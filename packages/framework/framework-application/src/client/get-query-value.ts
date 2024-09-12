import { firstValueFrom, isObservable, Observable, timeout } from "rxjs";
export async function getQueryValue<T>(
  query: Observable<T>,
  expireIn = 10000
): Promise<T> {
  if (!isObservable(query)) {
    throw new Error(
      "Error in getQueryValue: the argument is not an observable"
    );
  }
  try {
    return await firstValueFrom(query.pipe(timeout({ first: expireIn })));
  } catch (err) {
    throw new Error("Error in getQueryValue: " + err);
  }
}
