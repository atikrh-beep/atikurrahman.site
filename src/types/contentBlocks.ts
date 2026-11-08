export type ContentBlockType = 
  | 'text'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'video'
  | 'code'
  | 'technical_specs';

export interface BaseBlock {
  id: string;
  type: ContentBlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 2 | 3;
  text: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  caption?: string;
  alt?: string;
  aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1';
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: { url: string; caption?: string }[];
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  caption?: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  code: string;
  language?: string;
  filename?: string;
}

export interface TechnicalSpecsBlock extends BaseBlock {
  type: 'technical_specs';
  title?: string;
  items: { label: string; value: string }[];
}

export type ContentBlock = 
  | TextBlock 
  | HeadingBlock 
  | ImageBlock 
  | GalleryBlock 
  | VideoBlock 
  | CodeBlock 
  | TechnicalSpecsBlock;

export interface NoteDocument {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImage?: string;
  category?: string;
  status: 'draft' | 'published';
  blocks: ContentBlock[];
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

export interface RoboticsDocument {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  coverImage?: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  status: 'draft' | 'published' | 'Planning' | 'In Progress' | 'Prototype' | 'Completed' | 'Archived' | string;
  projectStatus?: 'Planning' | 'In Progress' | 'Prototype' | 'Completed' | 'Archived' | string;
  isPublished?: boolean;
  period?: string;
  hardware?: string[];
  software?: string[];
  circuitNotes?: string;
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  blocks: ContentBlock[];
  createdAt: number;
  updatedAt: number;
}
