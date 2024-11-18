export default function generateRandomSessionId() {
  return Math.ceil(Math.random() * 2e9);
}
