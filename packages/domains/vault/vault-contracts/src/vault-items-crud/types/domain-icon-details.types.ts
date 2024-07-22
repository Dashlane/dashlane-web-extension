import { z } from "zod";
const DomainIconType = [
  "crawled",
  "xs",
  "sm",
  "sm@2x",
  "md",
  "md.tiff",
  "xmd",
  "xmd@2x",
  "l",
  "l@2x",
  "xl",
  "xl@2x",
  "46x30",
  "46x30@2x",
  "50x33",
  "50x33@2x",
  "56x56",
  "56x56@2x",
  "118x98",
  "118x98@2x",
  "160x106",
  "160x106@2x",
] as const;
const DomainIconTypeSchema = z.enum(DomainIconType);
export declare type DomainIconType = z.infer<typeof DomainIconTypeSchema>;
const DomainIconDetailsUrlsSchema = DomainIconType.reduce(
  (schema, key) => schema.setKey(key, z.string().optional().nullable()),
  z.object({})
);
export declare type DomainIconDetailsUrls = z.infer<
  typeof DomainIconDetailsUrlsSchema
>;
export const DomainIconDetailsSchema = z.object({
  backgroundColor: z.string(),
  mainColor: z.string(),
  urls: DomainIconDetailsUrlsSchema,
});
export type DomainIconDetails = z.infer<typeof DomainIconDetailsSchema>;
export const DomainIconDetailsMapSchema = z.map(
  z.string(),
  DomainIconDetailsSchema
);
export type DomainIconDetailsMap = z.infer<typeof DomainIconDetailsMapSchema>;
