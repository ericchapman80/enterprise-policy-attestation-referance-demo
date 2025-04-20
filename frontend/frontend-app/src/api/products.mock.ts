import axios from 'axios';

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory_count: number;
  color?: string;
  size?: string;
}

export interface ProductReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  sale_price?: number;
  average_rating: number;
  review_count: number;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  created_at: string;
  updated_at: string;
}

const API_URL = 'http://localhost:8000';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};
