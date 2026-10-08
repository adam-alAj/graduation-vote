import { HeartHandshake, GraduationCap, type LucideIcon } from "lucide-react";

export type ConceptId = "concept_a" | "concept_b";

export interface Concept {
  id: ConceptId; // internal identifier, never shown to visitors
  icon: LucideIcon;
  title: string;
  description: string;
  howItWorks: string[];
  aiRole: string;
  strengths: string[];
}

// Edit the text here without touching any UI code.
// Keep both concepts similar in length so the poll stays neutral.
export const concepts: Concept[] = [
  {
    id: "concept_a",
    icon: HeartHandshake,
    title: "منصة ربط المحتاجين بالمتطوعين بالذكاء الاصطناعي",
    description:
      "منصة تربط من يحتاج مساعدة بالمتطوع المناسب. يكتب الشخص طلبه عبر تطبيق مألوف مثل تيليغرام أو واتساب، ويفهم النظام الطلب ويحدد نوعه (طعام، دواء، تعليم، مواصلات…) ومدى استعجاله، ثم يعرضه على المتطوعين المناسبين. ويمكن إخفاء هويات الطرفين في البداية حفاظًا على الخصوصية.",
    howItWorks: ["شخص محتاج", "الذكاء الاصطناعي", "المطابقة", "متطوع"],
    aiRole:
      "يقرأ الذكاء الاصطناعي رسالة الشخص بلغته العادية، ويفهم ما يحتاجه ومدى استعجاله، ثم يرشّح له المتطوعين الأنسب.",
    strengths: [
      "مشكلة اجتماعية حقيقية وأثر ملموس",
      "تجمع الذكاء الاصطناعي وفهم اللغة وخوارزميات المطابقة",
      "تحافظ على خصوصية الأطراف وأمان بياناتهم",
    ],
  },
  {
    id: "concept_b",
    icon: GraduationCap,
    title: "منصة إدارة التدريب الميداني للطلاب",
    description:
      "منصة تنظّم التدريب الميداني في الجامعة وتربط الطلاب بالشركات والمؤسسات. بدل النماذج والرسائل والجداول المتفرقة والمتابعة اليدوية، تجمع المنصة كل شيء في مكان واحد: الفرص، والطلبات، والجداول، والتقييم، والتقارير، وسجلات التدريب.",
    howItWorks: ["طالب", "المنصة", "شركة أو مؤسسة", "الجامعة والمشرف"],
    aiRole:
      "يطابق الذكاء الاصطناعي الطالب مع الفرص حسب مهاراته، ويلخّص التقارير، وينبّه إلى المعلومات الناقصة في المستندات، ويساعد في كتابة السيرة الذاتية وتحليل تقدّم الطالب.",
    strengths: [
      "مشكلة جامعية حقيقية ومتكررة",
      "تفيد الطلاب والشركات والأقسام والمشرفين",
      "مناسبة لتطبيق مفاهيم هندسة البرمجيات: أدوار وصلاحيات وسير عمل وتقارير",
    ],
  },
];

export const conceptById = (id: ConceptId): Concept =>
  concepts.find((c) => c.id === id) as Concept;
