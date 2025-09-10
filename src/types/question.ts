export interface Option {
  label: string;
  value: string;
  sublabel?: string;
  image?: string;
}

export interface Widget {
  type: string;
  content: string;
}

export interface Question {
  id: string | number;
  code: string;
  hint?: string;
  text: string;
  type: string;
  order: number;
  colspan: number;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  patternError?: string;
  requiredError?: string;
  options?: string[] | Option[];
  showFollowupWhen?: string;
  followup_questions?: Question[];
  min?: string | number;
  max?: string | number;
  maxError?: string;
  minError?: string;
  filetype?: string[];
  maxFileSize?: number;
  maxFilesAllowed?: number;
  component?: string;
  componentProps?: Record<string, any>;
}

export interface Page {
  id: number;
  code: string;
  desc: string;
  order: number;
  title: string;
  columns: number;
  questions: Question[];
  widgets?: Widget[];
  pageType?: string;
}

export interface Config {
  pages: Page[];
}

export interface InputRendererProps {
  question: Question;
  value: any;
  onChange: (code: string, value: any) => void;
  handleNext?: () => void;
}