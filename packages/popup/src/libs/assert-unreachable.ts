export function assertUnreachable(_: never, errorMessage = "Didn't expect to reach this code."): never {
    throw new Error(errorMessage);
}
