export interface ArticleImage {
  id: string;
  altText: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  body: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: ArticleImage[];
}

export interface ArticleSummary {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverImageId: string | null;
}
