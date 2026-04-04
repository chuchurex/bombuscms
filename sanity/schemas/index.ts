import { blockContent } from "./blockContent";
import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { post } from "./post";
import { publication } from "./publication";
import { event } from "./event";
import { teamMember } from "./teamMember";
import { category } from "./category";

export const schemaTypes = [
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  // Collections
  post,
  publication,
  event,
  teamMember,
  category,
  // Portable Text
  blockContent,
];
