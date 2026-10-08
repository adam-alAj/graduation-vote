export interface Reason {
  id: string; // stored in the database
  label: string; // shown to visitors
}

export const reasons: Reason[] = [
  { id: "community", label: "تبدو أكثر فائدة للمجتمع" },
  { id: "students", label: "تبدو أكثر فائدة للطلاب" },
  { id: "innovation", label: "أعتقد أنها أكثر ابتكارًا" },
  { id: "ai", label: "أعتقد أن الذكاء الاصطناعي فيها أكثر فائدة" },
  { id: "feasible", label: "تبدو أكثر قابلية للتنفيذ" },
  { id: "future", label: "أعتقد أن لها مستقبلًا أفضل" },
  { id: "impression", label: "أعتقد أنها ستترك انطباعًا أفضل" },
  { id: "interest", label: "الفكرة أقرب لاهتماماتي" },
  { id: "other", label: "أخرى" },
];

export const reasonLabel = (id: string): string =>
  reasons.find((r) => r.id === id)?.label ?? "سبب إضافي";
