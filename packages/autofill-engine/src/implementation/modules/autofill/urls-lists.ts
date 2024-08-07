type MappedDomains = Partial<Record<string, string[]>>;
export const MAPPED_DOMAINS: MappedDomains = {
  aol: ["aim"],
  att: ["bellsouth", "sbcglobal"],
  google: ["gmail", "googlemail"],
  live: ["hotmail", "outlook", "msn"],
  orange: ["wanadoo"],
  rediff: ["rediffmail"],
  spectrum: ["charter"],
  xfinity: ["comcast"],
  yahoo: ["ymail"],
};
export const META_DOMAINS_WITH_STRICT_FULLDOMAIN_MATCH = [
  "frama.site",
  "free.fr",
  "over-blog.com",
  "spreadshirt.com",
  "tumblr.com",
  "weebly.com",
  "wordpress.com",
];
export const ETLD_WITH_STRICT_FULLDOMAIN_MATCH = ["netlify.app"];
