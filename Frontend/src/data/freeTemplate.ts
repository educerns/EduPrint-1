// 🧩 Define Template type
export interface Template {
  id: number;
  _id?: string;
  title: string;
  description: string;
  sampleImage: string;
  customImage: string;
  price: number;
  type: string;
}

import sampleImage from "../assets/samplePoster.jpeg";
import customizeImage from "../assets/customizePoster.jpeg";
import Demo1 from "../assets/Demo1.jpeg";
import sampleDemo2 from "../assets/sampleDemo2.jpeg";
import customizeDemo2 from "../assets/customDemo2.jpeg";
import RegistrationCustom from "../assets/RegistrationCustom.jpeg";
import RegistrationSample from "../assets/RegistrationSample.jpeg";
import RegistrationCustom1 from "../assets/RegistrationCustom1.jpeg";
import RegistrationSample1 from "../assets/RegistrationSample1.jpeg";
import RegistrationCustom3 from "../assets/RegistrationCustom3.jpeg";
import RegistrationSample3 from "../assets/RegistrationSample3.jpeg";
import RegistrationCustom4 from "../assets/RegistrationCustom4.jpeg";
import RegistrationSample4 from "../assets/RegistrationSample4.jpeg";

import PromotionCustom from "../assets/PromotionCustom.jpeg";
import PromotionSample from "../assets/PromotionSample.jpeg";
import PromotionCustom1 from "../assets/Promotioncustom1.jpeg";
import PromotionSample1 from "../assets/PromotionSample1.jpeg";
import PromotionCustom2 from "../assets/PromotionCustom2.jpeg";
import PromotionSample2 from "../assets/PromotionSample2.jpeg";
import PromotionCustom3 from "../assets/PromotionCustom3.jpeg";
import PromotionSample3 from "../assets/PromotionSample3.jpeg";
import PromotionCustom4 from "../assets/PromotionCustom4.jpeg";
import PromotionSample4 from "../assets/PromotionSample4.jpeg";

import DemoCustom from "../assets/customDemo2.jpeg";
import DemoSample from "../assets/DemoSample1.jpeg";
import DemoCustom1 from "../assets/DemoCustom2.jpeg";
import DemoSample1 from "../assets/DemoSample2.jpeg";

// 🧩 Base Template List
export const staticTemplates: readonly Template[] = [
  {
    id: 1,
    customImage: customizeImage,
    sampleImage: sampleImage,
    title: "Demo_img 1",
    description: "Real Time GST Training Platform",
    price: 0,
    type: "Demo1",
  },
  {
    id: 3,
    customImage: DemoCustom,
    sampleImage: DemoSample,
    title: "Demo_img 2",
    description: "Real Time GST Training Platform",
    price: 0,
    type: "Demo2",
  },
  
  {
    id: 2,
    customImage: DemoCustom1,
    sampleImage: DemoSample1,
    title: "Demo_img 3",
    description: "Real Time GST Training Platform",
    price: 0,
    type: "Demo3",
  },
  {
    id: 4,
    customImage: RegistrationCustom,
    sampleImage: RegistrationSample,
    title: "Registration_img 1",
    description: "GST Course for College student",
    price: 0,
    type: "Registration1",
  },
  {
    id: 5,
    customImage: RegistrationCustom1,
    sampleImage: RegistrationSample1,
    title: "Registration_img 2",
    description: "GST Course for College student",
    price: 0,
    type: "Registration1",
  },
  {
    id: 6,
    customImage: PromotionCustom,
    sampleImage: PromotionSample,
    title: "Promotion_img 1",
    description: "Become a GST Consultant",
    price: 0,
    type: "Promotion1",
  },
  {
    id: 7,
    customImage: PromotionCustom1,
    sampleImage: PromotionSample1,
    title: "Promotion_img 2",
    description: "Real time GST - Return filling practice platform",
    price: 0,
    type: "Promotion2",
  },
  {
    id: 8,
    customImage: PromotionCustom2,
    sampleImage: PromotionSample2,
    title: "Promotion_img 3",
    description: "Real time GST return filling",
    price: 0,
    type: "Promotion3",
  },
  {
    id: 9,
    customImage: PromotionCustom3,
    sampleImage: PromotionSample3,
    title: "Promotion_img 5",
    description: "Real-time, hands-on GST training that turns theory into confidence",
    price: 0,
    type: "Promotion4",
  },
  {
    id: 10,
    customImage: PromotionCustom4,
    sampleImage: PromotionSample4,
    title: "Promotion_img 6",
    description: "Add practical GST training to your institute",
    price: 0,
    type: "Promotion5",
  },
  {
    id: 12,
    customImage: RegistrationCustom4,
    sampleImage: RegistrationSample4,
    title: "Registration_img 3",
    description: "My GST - MY CONTROL",
    price: 0,
    type: "Registration2",
  },
];

// 🧱 Grouped Templates (Array Format)
export const groupedTemplates = [
  {
    category: "Demo",
    templates: staticTemplates.filter(
      (item) =>
        item.type === "Demo1" || item.type === "Demo2" || item.type === "Demo3"
    ),
  },
  {
    category: "Registration",
    templates: staticTemplates.filter(
      (item) => item.type === "Registration1" || item.type === "Registration2"
    ),
  },
  {
    category: "Promotion",
    templates: staticTemplates.filter(
      (item) =>
        item.type === "Promotion1" ||
        item.type === "Promotion2" ||
        item.type === "Promotion3" ||
        item.type === "Promotion4" ||
        item.type === "Promotion5"
    ),
  },
] as const;

// ✅ Example usage:
// import { groupedTemplates } from "./templates";
// groupedTemplates.map(group => (
//   <TemplateSection title={group.category} templates={group.templates} />
// ));

export default staticTemplates;
