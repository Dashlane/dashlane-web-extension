import {
  AnyAppDefinition,
  AnyModuleApi,
  ApisNamesOf,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { safeCast } from "@dashlane/framework-types";
import { ModuleImplementationDefinition } from "../dependency-injection/module.types";
import {
  LocallyImplementedApisOf,
  LocalSubscriptions,
  SubscriptionOfModule,
} from "./app.types";
export const getSubscriptionsFromMetadata = <
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>(
  modulesMetadata: Map<
    LocallyImplementedApisOf<TAppDefinition, TCurrentNode>,
    Partial<ModuleImplementationDefinition<AnyModuleApi>>
  >
): LocalSubscriptions<TAppDefinition, TCurrentNode> => {
  return [...modulesMetadata.entries()].reduce(
    (allSubscriptions, [subscriber, value]) => {
      const events = value.handlers?.events ?? {};
      allSubscriptions[subscriber] = Object.values(events).reduce(
        (moduleSubscription, subscription) => {
          if (!subscription.name) {
            return moduleSubscription;
          }
          const subscribedTo = subscription.name as ApisNamesOf<TAppDefinition>;
          moduleSubscription[subscribedTo] = Object.keys(subscription.events);
          return moduleSubscription;
        },
        safeCast<SubscriptionOfModule<TAppDefinition>>({})
      );
      return allSubscriptions;
    },
    safeCast<LocalSubscriptions<TAppDefinition, TCurrentNode>>({})
  );
};
