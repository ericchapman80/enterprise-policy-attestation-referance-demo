import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProductListPage from './ProductListPage';
import * as productsApi from '../api/products';

jest.mock('../api/products', () => ({
  getProducts: jest.fn(),
}));

describe('ProductListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    jest.spyOn(productsApi, 'getProducts').mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <ProductListPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Products')).toBeInTheDocument();
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('renders products when data is loaded', async () => {
    const mockProducts = [
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
      },
      {
        id: '2',
        name: 'Test Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'Category 2',
        price: 149.99,
        average_rating: 4.0,
        review_count: 5,
        images: [{ id: 'img2', url: 'test2.jpg', alt_text: 'Test 2', is_primary: true }],
        variants: [],
        reviews: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    jest.spyOn(productsApi, 'getProducts').mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <ProductListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('Brand 1')).toBeInTheDocument();
      expect(screen.getByText('Brand 2')).toBeInTheDocument();
    });
  });

  test('renders no products message when empty array is returned', async () => {
    jest.spyOn(productsApi, 'getProducts').mockResolvedValue([]);

    render(
      <BrowserRouter>
        <ProductListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });
});
