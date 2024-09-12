import {
  AnyModuleApi,
  ApplicationDefinitionBuilder,
  exceptionLoggingApi,
  ModuleAddition,
  ModuleDistribution,
  requestContextApi,
} from "@dashlane/framework-contracts";
const _defineApplication = <
  TNodeIdentifiers extends string
>(): ApplicationDefinitionBuilder<TNodeIdentifiers, never, {}, {}> => {
  const makeAppDefinitionBuilder = <
    TKeys extends string,
    TModuleApis extends {
      [k in TKeys]: AnyModuleApi;
    },
    TModuleStrategy extends {
      [k in TKeys]: ModuleDistribution<
        AnyModuleApi,
        TNodeIdentifiers,
        TNodeIdentifiers,
        TNodeIdentifiers
      >;
    }
  >(
    strategy: TModuleStrategy
  ): ApplicationDefinitionBuilder<
    TNodeIdentifiers,
    TKeys,
    TModuleApis,
    TModuleStrategy
  > => {
    return {
      define: () => strategy,
      with: <
        TModuleApi extends AnyModuleApi,
        TMain extends TNodeIdentifiers,
        TQueryOnly extends Exclude<TNodeIdentifiers, TMain> = never
      >(
        moduleDef: ModuleAddition<
          TModuleApi,
          TMain,
          TNodeIdentifiers,
          TQueryOnly
        >
      ) => {
        const mapping: ModuleDistribution<
          TModuleApi,
          TNodeIdentifiers,
          TMain,
          TQueryOnly
        > = {
          api: moduleDef.module,
          main: moduleDef.on,
          queryOnly: moduleDef.queryOnly ?? [],
        };
        const key: TModuleApi["name"] = moduleDef.module.name;
        const declaration = { [key]: mapping } as {
          [k in TModuleApi["name"]]: ModuleDistribution<
            TModuleApi,
            TNodeIdentifiers,
            TMain,
            TQueryOnly
          >;
        };
        return makeAppDefinitionBuilder<
          TKeys | TModuleApi["name"],
          TModuleApis & {
            [k in TModuleApi["name"]]: TModuleApi;
          },
          TModuleStrategy & {
            [k in TModuleApi["name"]]: ModuleDistribution<
              TModuleApi,
              TNodeIdentifiers,
              TMain,
              TQueryOnly
            >;
          }
        >({
          ...strategy,
          ...declaration,
        });
      },
    };
  };
  return makeAppDefinitionBuilder<never, {}, {}>({});
};
export const defineApplication = <
  TMain extends string,
  TOthers extends string & Exclude<string, TMain> = never
>(
  main: TMain,
  _others: TOthers[]
) => {
  return _defineApplication<TMain | TOthers>()
    .with({
      module: requestContextApi,
      on: main,
    })
    .with({
      module: exceptionLoggingApi,
      on: main,
    });
};
export const SingleNodeAppBuilder = defineApplication("node", []);
