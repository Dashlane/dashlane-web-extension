import { jsx } from "@dashlane/design-system";
import { Fragment } from "react";
interface Props {
  text: string;
  search?: string;
}
export const HighlightedSearchValue = ({ text, search }: Props) => {
  if (!search || !text) {
    return <span>{text}</span>;
  }
  const index = text.toLowerCase().indexOf(search.toLowerCase());
  if (index < 0) {
    return <span>{text}</span>;
  }
  return (
    <Fragment>
      <span>{text.substring(0, index)}</span>
      <span sx={{ color: "ds.text.brand.standard" }}>
        {text.substring(index, index + search.length)}
      </span>
      <span>{text.substring(index + search.length)}</span>
    </Fragment>
  );
};
