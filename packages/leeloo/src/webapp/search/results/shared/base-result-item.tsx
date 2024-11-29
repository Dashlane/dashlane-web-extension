import { ReactNode } from "react";
import { IconName, ItemHeader, ListItem } from "@dashlane/design-system";
import { useSearchContext } from "../../search-context";
interface BaseResultItemProps {
  id: string;
  title: string;
  description: string;
  thumbnail: JSX.Element;
  icons?: IconName[];
  actions?: ReactNode;
  onClick: () => void;
}
export const BaseResultItem = ({
  id,
  icons,
  title,
  onClick,
  description,
  thumbnail,
  actions,
}: BaseResultItemProps) => {
  const { searchValue } = useSearchContext();
  return (
    <ListItem aria-label={title ?? id} onClick={onClick} actions={actions}>
      <ItemHeader
        title={title}
        description={description}
        highlightedText={searchValue}
        thumbnail={thumbnail}
        icons={icons}
      />
    </ListItem>
  );
};
