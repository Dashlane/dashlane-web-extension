import { ButtonProps, IconProps } from '@dashlane/design-system';
export enum Task {
    INSTALL_EXTENSION = 'install-extension',
    ADD_PASSWORD = 'add-password',
    TRY_AUTOFILL = 'try-autofill',
    OPEN_ADMIN_CONSOLE = 'open-admin-console'
}
export enum TaskStatus {
    COMPLETED = 'completed',
    DISABLED = 'disabled',
    IDLE = 'idle'
}
export type TaskDefinition = {
    title: string;
    icon: IconProps['name'];
    action: TaskAction;
};
export type TaskAction = {
    label: string;
    handler: () => void;
    layout?: ButtonProps['layout'];
    icon?: IconProps['name'];
};
