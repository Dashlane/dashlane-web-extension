import * as React from 'react';
import { BreachDetailsDialogContext } from 'webapp/dark-web-monitoring/breach-details/breach-details-dialog-provider';
export function useBreachDetailsDialog() {
    return React.useContext(BreachDetailsDialogContext);
}
