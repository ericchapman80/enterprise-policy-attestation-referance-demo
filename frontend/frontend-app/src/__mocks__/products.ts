import { Product } from '../api/products';

export const getProducts = jest.fn().mockImplementation(async () => {
  return [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Description 1',
      brand: 'Brand 1',
      category: 'Category 1',
      price: 99.99,
      average_rating: 4.5,
      review_count: 10,
      images: [{ id: 'img1', url: 'test.jpg', alt_text: 'Test', is_primary: true }],
      variants: [],
      reviews: [],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ];
});

export const getProductById = jest.fn().mockImplementation(async (id: string) => {
  return {
    id,
    name: 'Test Product',
    description: 'This is a test product description',
    brand: 'Test Brand',
    category: 'Test Category',
    price: 99.99,
    average_rating: 4.5,
    review_count: 10,
    images: [
      { id: 'img1', url: 'test.jpg', alt_text: 'Test Image', is_primary: true },
      { id: 'img2', url: 'test2.jpg', alt_text: 'Test Image 2', is_primary: false }
    ],
    variants: [
      { 
        id: 'var1', 
        name: 'Test Variant', 
        sku: 'TEST-SKU', 
        price: 99.99, 
        inventory_count: 10,
        color: 'Red',
        size: 'Medium'
      }
    ],
    reviews: [
      {
        id: 'rev1',
        user_name: 'Test User',
        rating: 5,
        comment: 'Great product!',
        created_at: '2023-01-01T00:00:00Z'
      }
    ],
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };
});

export type { Product };
