export type IconType =
  | "crawled"
  | "xs"
  | "sm"
  | "sm@2x"
  | "md"
  | "md.tiff"
  | "xmd"
  | "xmd@2x"
  | "l"
  | "l@2x"
  | "xl"
  | "xl@2x"
  | "46x30"
  | "46x30@2x"
  | "50x33"
  | "50x33@2x"
  | "56x56"
  | "56x56@2x"
  | "118x98"
  | "118x98@2x"
  | "160x106"
  | "160x106@2x";
export type IconUrls = {
  [key in IconType]?: string | null;
};
export interface IconDataStructure {
  urls: IconUrls;
  backgroundColor: string;
  mainColor: string;
}
