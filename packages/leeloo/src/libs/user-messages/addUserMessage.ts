import { carbonConnector } from "../carbon/connector";
interface AddUserMessageProps {
  type: string;
}
export const addUserMessage = ({ type }: AddUserMessageProps) =>
  carbonConnector.addUserMessage({
    type,
  });
