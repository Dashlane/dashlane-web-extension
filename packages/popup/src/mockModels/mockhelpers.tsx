import * as React from 'react';
import { render } from '@testing-library/react';
export function renderWithDialog(Component: JSX.Element) {
    return render(<>
      <div id="dialog"/>
      {Component}
    </>);
}
