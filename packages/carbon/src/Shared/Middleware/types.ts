export type Next<Ctx> = (ctx: Ctx) => Ctx;
export type Middleware<Ctx> = (next: Next<Ctx>) => (context: Ctx) => Ctx;
