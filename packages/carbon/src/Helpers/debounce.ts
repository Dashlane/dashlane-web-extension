export type DebounceFunction = (
  options: {
    immediateCall?: boolean;
  },
  ...args: any[]
) => void;
export function debounce(func: Function, waitMs: number): DebounceFunction {
  let timeout: any;
  return function (options, ...args) {
    var context = this;
    clearTimeout(timeout);
    if (options.immediateCall) {
      timeout = null;
      func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, waitMs);
    }
  };
}
