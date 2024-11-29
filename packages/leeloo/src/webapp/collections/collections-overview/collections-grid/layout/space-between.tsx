export const SpaceBetween = ({ ...props }) => (
  <div
    sx={{
      display: "flex",
      flex: "1 0 100%",
      alignItems: "center",
      justifyContent: "space-between",
    }}
    {...props}
  />
);
