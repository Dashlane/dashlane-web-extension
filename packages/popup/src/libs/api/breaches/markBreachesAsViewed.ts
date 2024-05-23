import { BreachItemView, BreachStatus } from '@dashlane/communication';
import { carbonConnector } from 'carbonConnector';
export const markBreachesAsViewed = (breaches: BreachItemView[]): void => {
    breaches.forEach((breach: BreachItemView) => {
        carbonConnector.updateBreachStatus({
            id: breach.id,
            status: BreachStatus.VIEWED,
        });
    });
};
