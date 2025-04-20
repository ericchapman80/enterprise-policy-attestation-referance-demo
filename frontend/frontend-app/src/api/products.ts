import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
}

export interface ProductReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  sale_price?: number;
  inventory_count: number;
  color?: string;
  size?: string;
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

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
};
