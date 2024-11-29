import { CursorAction, LocalReducer } from "redux-cursor";
import { Cursor } from "../../store/types";
import makeLee, { Lee, Options } from "./makeLee";
interface MakeChild {
  (): Lee;
  <ChildLocalState extends Record<string, any>>(
    reducer: LocalReducer<ChildLocalState>,
    childKey?: string
  ): LeeWithStorage<ChildLocalState>;
}
export interface LeeWithStorage<LocalState> extends Lee {
  child: MakeChild;
  dispatch: (action: CursorAction<any>) => void;
  state: LocalState;
}
interface OptionsWithStorage<LocalState extends Record<string, any>>
  extends Options {
  cursor: Cursor<LocalState>;
}
function makeChild<LocalState extends Record<string, any>>(
  lee: Lee,
  options: OptionsWithStorage<LocalState>
): MakeChild {
  return function <ChildLocalState extends Record<string, any>>(
    reducer?: LocalReducer<ChildLocalState>,
    childKey?: string
  ) {
    if (reducer) {
      return makeLeeWithStorage<ChildLocalState>(
        Object.assign({}, options, {
          cursor: options.cursor.child(reducer, childKey),
        })
      );
    } else {
      return lee;
    }
  } as MakeChild;
}
export default function makeLeeWithStorage<
  LocalState extends Record<string, any>
>(options: OptionsWithStorage<LocalState>): LeeWithStorage<LocalState> {
  const lee = makeLee(options);
  const leeWithStorage: LeeWithStorage<LocalState> = Object.assign({}, lee, {
    child: makeChild(lee, options),
    dispatch: options.cursor.dispatch,
    state: options.cursor.state,
  });
  return leeWithStorage;
}
