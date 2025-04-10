export interface Tenant {
  tenant_id: string;
  tenant_name: string;
  website_domain: string;
  description: string;
  is_active: boolean;
  integrations: any | null;
}

export interface Article {
  article_id: string;
  title: string;
  html_content: string;
  markdown_content: string | null;
  hero_image_prompt: string;
  alt_text: string;
  hero_image_url: string;
  meta_description: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  created_on: string;
} 