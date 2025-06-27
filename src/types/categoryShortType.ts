// types/categoryShortType.ts
export interface CategoryShort {
  id: number;
  name: string;
  slug: string;
  parent: number;
  yoast_head_json?: {
    og_url?: string;
  };
}
