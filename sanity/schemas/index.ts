import project from "./project";
import news from "./news";
import newsCategory from "./newsCategory";
import procurement from "./procurement";
import publication from "./publication";
import province from "./province";
import homeSettings from "./homeSettings";
import siteSettings from "./siteSettings";
import aboutPage from "./aboutPage";
import media from "./media";
import mediaAlbum from "./mediaAlbum";

export const schemaTypes = [
  // Main content
  project,
  news,
  procurement,
  publication,
  media,
  mediaAlbum,

  // Taxonomies
  province,
  newsCategory,
  homeSettings,
  siteSettings,
  aboutPage,
];
