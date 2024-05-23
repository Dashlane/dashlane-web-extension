import * as React from 'react';
import { render } from '@testing-library/react';
import { ProtectedItemsUnlockerProvider } from './protected-items-unlocker-provider';
export function renderWithProtectedItemsUnlocker(Component: JSX.Element) {
    return render(<ProtectedItemsUnlockerProvider>
      {Component}
    </ProtectedItemsUnlockerProvider>);
}
