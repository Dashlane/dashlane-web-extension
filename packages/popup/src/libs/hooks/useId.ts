import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
export default function useID(): string {
  const { current: randomId } = useRef(uuidv4());
  return randomId;
}
