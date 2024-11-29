import Base from "./Base";
interface CreateParams {
  level: string;
  message: string;
  data: {
    [key: string]: any;
  };
}
export default class WebsiteLog extends Base {
  protected WSURL = "__REDACTED__";
  protected WSVERSION = 1;
  protected WSNAME = "websitelog";
  public create({ level, message, data }: CreateParams) {
    const apiData = Object.assign({}, data, { originLog: "leeloo" });
    const apiParams = {
      level,
      message,
      data: JSON.stringify(apiData),
    };
    return this._makeRequest("websitelogs", apiParams).then(() => null);
  }
}
