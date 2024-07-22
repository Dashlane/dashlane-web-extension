import { jsx, TextColorToken } from "@dashlane/design-system";
const SYMBOLS = "&@$!#?";
const NUMBERS = "0123456789";
const ColorfulPassword = ({ password }: { password: string }) => {
  const getColorName = (char: string): TextColorToken => {
    if (NUMBERS.includes(char)) {
      return "ds.text.oddity.password-digits";
    }
    if (SYMBOLS.includes(char)) {
      return "ds.text.oddity.password-symbols";
    }
    return "ds.text.neutral.catchy";
  };
  return (
    <div>
      {password.split("").map((char, i) => (
        <span key={i} sx={{ color: getColorName(char) }}>
          {char}
        </span>
      ))}
    </div>
  );
};
export default ColorfulPassword;
