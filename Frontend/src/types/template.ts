// src/types/template.ts
export interface TemplateData {
  id: number;
  _id?: string;
  title: string;
  description: string;
  sampleImage?: string;
  customImage?: string;
  price: number;
  type: string;
}
