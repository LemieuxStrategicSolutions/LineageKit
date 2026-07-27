export const librarySections = [
  { title: "Cycle Charters", categories: ["Cycle charter"] },
  { title: "Cycle Reports", categories: ["Cycle report"] },
  { title: "Record Analysis", categories: ["Record analysis", "Research assessment", "Profile"] },
  { title: "Branch Research", categories: ["Branch research"] },
] as const;

export function librarySectionTitle(category: string) {
  return librarySections.find((section) => section.categories.some((candidate) => candidate === category))?.title ?? "Record Analysis";
}
