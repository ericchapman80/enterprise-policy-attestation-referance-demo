import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product } from '../api/products';

const mockProduct: Product = {
  id: '123',
  name: 'Test Product',
  description: 'This is a test product',
  brand: 'Test Brand',
  category: 'Test Category',
  price: 99.99,
  average_rating: 4.5,
  review_count: 10,
  images: [
    {
      id: 'img1',
      url: 'https://placehold.co/600x400?text=Test+Product',
      alt_text: 'Test Product Image',
      is_primary: true
    }
  ],
  variants: [],
  reviews: [],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
};

const mockProductWithSale: Product = {
  ...mockProduct,
  id: '456',
  sale_price: 79.99
};

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    
    const image = screen.getByAltText('Test Product Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://placehold.co/600x400?text=Test+Product');
  });
  
  test('renders sale price when available', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProductWithSale} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('$79.99')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });
});
