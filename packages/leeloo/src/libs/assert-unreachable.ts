export function assertUnreachable(_: never): never {
  throw new Error(`Didn't expect to reach this code ${_}.`);
}
