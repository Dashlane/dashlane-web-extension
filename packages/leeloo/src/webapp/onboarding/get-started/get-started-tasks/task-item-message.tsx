import { jsx, Paragraph, TextColorToken, ThemeUIStyleObject, } from '@dashlane/design-system';
import { BodyTypographyToken, SpecialtyTypographyToken, TitleTypographyToken, } from '@dashlane/design-system/dist/types/design-tokens';
import useTranslate from 'libs/i18n/useTranslate';
import { TaskStatus } from '../types';
export const TaskItemMessage = ({ status, title, }: {
    status: TaskStatus;
    title: string;
}) => {
    const { translate } = useTranslate();
    const getStyles = (): {
        textStyle: BodyTypographyToken | SpecialtyTypographyToken | TitleTypographyToken;
        color: TextColorToken;
        sx?: Record<string, Partial<ThemeUIStyleObject>>;
    } => {
        const textStyle = 'ds.title.block.medium';
        switch (status) {
            case TaskStatus.DISABLED:
                return {
                    textStyle,
                    color: 'ds.text.oddity.disabled',
                };
            case TaskStatus.COMPLETED:
                return {
                    textStyle,
                    color: 'ds.text.neutral.quiet',
                    sx: { textDecoration: 'line-through' },
                };
            default:
                return {
                    textStyle,
                    color: 'ds.text.neutral.catchy',
                };
        }
    };
    return <Paragraph {...getStyles()}>{translate(title)}</Paragraph>;
};
