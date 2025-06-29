interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductInfo {
  id: number;
  sku: string;
  slug: string;
  on_sale: boolean;
  name: string;
  key: string;
  stock_quantity: number;
  variation_id: number;
  description: string;
  quantity: number;
  brands: { name: string }[];
  short_description?: string;
  short_description_en?: string;
  short_description_uk?: string;
  categories: Category[];
  variations: number[];
  attributes: {
    name: string;
    options: string[];
    slug: string;
    option: string;
  }[];
  price: string;
  featured: boolean;
  regular_price: string;
  average_rating: string;
  rating_count: string;
  total_sales: number;
  sale_price: string;
  date_created: string;
  images: { src: string; alt: string; id: number }[];
  image: { src: string; alt: string; id: number };
  purchasable: boolean;
  meta_data: {
    key: string;
    value: string | string[];
  }[];
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  option: string;
  slug: string;
  variation?: boolean;
}

export interface ProductReview {
  id: number;
  product_id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  [key: string]: unknown; // для backward compatibility, якщо є додаткові поля
}
