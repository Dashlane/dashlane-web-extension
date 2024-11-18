import {
  LimitedToOneDevice,
  MonoBucketOwner,
  NotLimitedToOneDevice,
} from "@dashlane/communication";
export const limitedToOneDevice = (
  bucketOwner: MonoBucketOwner
): LimitedToOneDevice => ({
  _tag: "limitedToOneDevice",
  bucketOwner,
});
export const notLimitedToOneDevice = (): NotLimitedToOneDevice => ({
  _tag: "notLimitedToOneDevice",
});
