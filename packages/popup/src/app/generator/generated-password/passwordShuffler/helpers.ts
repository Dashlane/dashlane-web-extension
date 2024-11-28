const LETTERS = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
const LETTERS_DIGITS_SYMBOLS = LETTERS + "1234567890!@#$&?";
function getRandomNumber(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomChar() {
  return LETTERS_DIGITS_SYMBOLS.substr(
    getRandomNumber(0, LETTERS_DIGITS_SYMBOLS.length - 1),
    1
  );
}
export function getRandomPassword(length: number) {
  return LETTERS_DIGITS_SYMBOLS.substr(0, length)
    .split("")
    .map(() => {
      return getRandomChar();
    })
    .join("");
}
export function replaceCharInWord(
  value: string,
  position = getRandomNumber(0, value.length)
) {
  return (
    value.substr(0, position) + getRandomChar() + value.substr(position + 1)
  );
}
