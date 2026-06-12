import type { StructureBuilder } from "sanity/structure";

const SINGLETONS = [
  { type: "siteSettings", title: "Paramètres du site", id: "siteSettings" },
  { type: "homeSettings", title: "Accueil — contenu éditable", id: "homeSettings" },
  { type: "aboutPage", title: "Page À propos", id: "aboutPage" },
] as const;

export function structure(S: StructureBuilder) {
  const singletonItems = SINGLETONS.map(({ type, title, id }) =>
    S.listItem()
      .title(title)
      .id(id)
      .child(S.document().schemaType(type).documentId(id))
  );

  const hiddenTypes = new Set(SINGLETONS.map((item) => item.type));

  return S.list()
    .title("Contenu")
    .items([
      ...singletonItems,
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !hiddenTypes.has(item.getId() ?? "")),
    ]);
}
