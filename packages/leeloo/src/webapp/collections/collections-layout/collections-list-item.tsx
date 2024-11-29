export const LIST_ITEM_GAP = 16;
export const CollectionsListItem = ({ isVisible = true, ...rest }) => (
  <li
    sx={{
      flex: 0,
      maxWidth: "200px",
      ...(isVisible
        ? {
            visibility: "visible",
            transform: "scale3d(1,1,1)",
            width: "100%",
            marginRight: `${LIST_ITEM_GAP}px`,
          }
        : {
            visibility: "hidden",
            transform: "scale3d(0,0,1)",
            width: 0,
          }),
      transformOrigin: "top left",
      transition: "all 200ms",
    }}
    {...rest}
  />
);
