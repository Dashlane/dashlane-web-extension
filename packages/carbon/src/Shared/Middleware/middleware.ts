import { Middleware, Next } from "Shared/Middleware/types";
export const buildMiddlewarePipeline =
  <Context>(...middlewares: Array<Middleware<Context>>) =>
  (req: Context): Context => {
    const runFinal = (context: Context) => context;
    const chain = middlewares.reduceRight(
      (next: Next<Context>, middleware) => middleware(next),
      runFinal
    );
    return chain(req);
  };
