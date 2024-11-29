import * as React from "react";
import ReactOutsideClickHandler, {
  Props as OutsideClickHandlerProps,
} from "react-outside-click-handler";
interface Props extends React.PropsWithChildren<OutsideClickHandlerProps> {
  ignoredClassName?: string;
}
export const OutsideClickHandler = (props: Props) => {
  const { ignoredClassName, onOutsideClick, ...rest } = props;
  const cb: Props["onOutsideClick"] = React.useCallback(
    (e) => {
      if (!ignoredClassName) {
        onOutsideClick(e);
        return;
      }
      let el: HTMLElement | null = e.target as HTMLElement;
      const ignoredClassNames = ignoredClassName.split(" ");
      while (el) {
        if (
          ignoredClassNames.find((className) =>
            el?.classList?.contains(className)
          )
        ) {
          return;
        }
        el = el.parentElement;
      }
      onOutsideClick(e);
    },
    [ignoredClassName, onOutsideClick]
  );
  return <ReactOutsideClickHandler onOutsideClick={cb} {...rest} />;
};
