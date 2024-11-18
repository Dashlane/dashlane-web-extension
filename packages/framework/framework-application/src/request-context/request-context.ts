export const FrameworkRequestContextValues = {
  UseCaseId: "USE_CASE_ID",
  UserName: "USER_NAME",
};
export class RequestContext {
  private readonly entries: Record<string, unknown> = {};
  public get<T>(key: string): T | undefined {
    return this.entries[key] as T | undefined;
  }
  public getOrDefault<T>(key: string, defaultValue: T): T {
    return (this.entries[key] as T | undefined) ?? defaultValue;
  }
  public getOrFail<T>(
    key: string,
    options?: {
      readonly errorMessage?: string;
    }
  ): T {
    if (!this.has(key)) {
      const errorMessage =
        options?.errorMessage ?? `No ${key} in request context`;
      throw new Error(errorMessage);
    }
    return this.entries[key] as T;
  }
  public has(key: string): boolean {
    return key in this.entries;
  }
  public async getOrAdd<T>(
    key: string,
    factory: () => Promise<T> | T
  ): Promise<T | undefined> {
    if (!this.has(key)) {
      this.set(key, await factory());
    }
    return this.get(key);
  }
  public getOrAddSync<T>(key: string, factory: () => T): T {
    if (!this.has(key)) {
      this.set(key, factory());
    }
    return this.get(key) as T;
  }
  public set<T>(key: string, value: T) {
    this.entries[key] = value;
  }
  public toSerializable(): Record<string, unknown> {
    return this.entries;
  }
  public static fromSerializable(record: Record<string, unknown>) {
    const result = new RequestContext();
    for (const [key, value] of Object.entries(record)) {
      result.entries[key] = value;
    }
    return result;
  }
  public clone(): RequestContext {
    return RequestContext.fromSerializable(
      JSON.parse(JSON.stringify(this.toSerializable()))
    );
  }
  public withValue<T>(key: string, value: T): RequestContext {
    this.set(key, value);
    return this;
  }
}
