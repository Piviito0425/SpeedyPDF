// lib/types.ts

export type DocumentType = 
  | 'meeting'
  | 'narrative' 
  | 'news/article'
  | 'legal/policy'
  | 'email_thread'
  | 'technical_report'
  | 'generic';

export type RouteResult = {
  type: DocumentType;
  confidence: number;
  reason: string;
};

export type MeetingJSON = {
  title?: string;
  date?: string;
  attendees?: string[];
  sections: { title: string; bullets: string[] }[]; // 3–6 secciones
  decisions: string[]; // 1–8
  action_items: { owner: string; action: string; due_date?: string }[]; // 1–10
};

export type NarrativeJSON = {
  synopsis: string;
  bullets: string[];
};

export type ArticleJSON = {
  tldr: string;
  claves: string[];
  cifras?: string[];
};

export type SummaryResult = {
  type: DocumentType;
  markdown: string;
};
