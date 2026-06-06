import project from "./project";
import news from "./news";
import newsCategory from "./newsCategory";
import procurement from "./procurement";
import publication from "./publication";
import province from "./province";
import homeSettings from "./homeSettings";
import siteSettings from "./siteSettings";
import aboutPage from "./aboutPage";

export const schemaTypes = [
  // Main content
  project,
  news,
  procurement,
  publication,

  // Taxonomies
  province,
  newsCategory,
  homeSettings,
  siteSettings,
  aboutPage,
];
