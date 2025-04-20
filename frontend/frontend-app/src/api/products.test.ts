import axios from 'axios';
import { getProducts, getProductById } from './products.mock';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('returns products data when API call is successful', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          brand: 'Test Brand',
          category: 'Test Category',
          price: 99.99,
          average_rating: 4.5,
          review_count: 10,
          images: [],
          variants: [],
          reviews: [],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      const result = await getProducts();
      
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/products'));
      expect(result).toEqual(mockProducts);
    });

    test('returns empty array when API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

      const result = await getProducts();
      
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/products'));
      expect(result).toEqual([]);
    });
  });

  describe('getProductById', () => {
    test('returns product data when API call is successful', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        brand: 'Test Brand',
        category: 'Test Category',
        price: 99.99,
        average_rating: 4.5,
        review_count: 10,
        images: [],
        variants: [],
        reviews: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

      const result = await getProductById('1');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/products/1'));
      expect(result).toEqual(mockProduct);
    });

    test('returns null when API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

      const result = await getProductById('1');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/products/1'));
      expect(result).toBeNull();
    });
  });
});
