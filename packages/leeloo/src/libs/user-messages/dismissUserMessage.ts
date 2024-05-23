import { carbonConnector } from 'libs/carbon/connector';
interface DismissUserMessageProps {
    type: string;
}
export const dismissUserMessage = ({ type }: DismissUserMessageProps) => carbonConnector.dismissUserMessages({
    type,
});
