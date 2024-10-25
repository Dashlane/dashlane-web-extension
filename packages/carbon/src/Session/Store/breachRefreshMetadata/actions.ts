export const UPDATE_BREACHES_REFRESH_TIMESTAMP =
  "UPDATE_BREACHES_REFRESH_TIMESTAMP";
export const updateBreachRefreshTimestamp = (
  lastBreachRefreshTimestamp: number
) => ({
  type: UPDATE_BREACHES_REFRESH_TIMESTAMP,
  lastBreachRefreshTimestamp,
});
