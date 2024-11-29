import Api from "./Api";
export default abstract class ApiMiddleware {
  protected _api: Api;
  constructor(api: Api) {
    this._api = api;
  }
}
