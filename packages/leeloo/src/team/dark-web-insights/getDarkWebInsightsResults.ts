import { carbonConnector } from "../../libs/carbon/connector";
export async function fetchDarkWebInsightsResults(
  domain: string,
  requestSize: number,
  offset = 0
) {
  const response = await carbonConnector.getDarkWebInsightsReportResults({
    domain,
    offset,
    count: requestSize,
  });
  if (response?.success) {
    return response.data;
  } else {
    throw new Error(
      "[fetchDarkWebInsightsResults] - Server Error: Unable to load dark web insight report results data"
    );
  }
}
