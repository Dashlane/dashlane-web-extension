import { render } from '@testing-library/react';
export const renderWithModalRoot = (component: JSX.Element) => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal';
    return render(component, {
        container: document.body.appendChild(modalRoot),
    });
};
