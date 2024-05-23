import { jsx } from '@dashlane/ui-components';
interface Props {
    width?: number;
    height?: number;
}
export const FieldSpacer = ({ width = 0, height = 0 }: Props) => {
    return <div sx={{ width, height }}/>;
};
