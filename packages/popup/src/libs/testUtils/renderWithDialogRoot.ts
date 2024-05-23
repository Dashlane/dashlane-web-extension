import { render } from '@testing-library/react';
export const renderWithDialogRoot = (component: JSX.Element) => {
    const dialogRoot = document.createElement('div');
    dialogRoot.id = 'dialog';
    return render(component, {
        container: document.body.appendChild(dialogRoot),
    });
};
