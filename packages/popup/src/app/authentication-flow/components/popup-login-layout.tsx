import { jsx } from "@dashlane/design-system";
interface Props {
  children: React.ReactNode;
}
export const PopupLoginLayout = ({ children }: Props) => (
  <div
    sx={{
      flexGrow: "1",
      width: "100%",
    }}
  >
    {children}
  </div>
);
