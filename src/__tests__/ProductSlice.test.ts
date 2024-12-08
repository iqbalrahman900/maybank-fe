// src/__tests__/ProductSlice.test.ts
import productReducer from '../features/products/productSlice';
import { fetchProducts, addProduct } from '../features/products/productSlice';

describe('Product Slice', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: 99.99,
    category: 'Electronics',
    description: 'Test description',
    createdAt: '2024-12-01T03:50:58.645Z',
    updatedAt: '2024-12-01T03:50:58.645Z',
  };

  it('should handle fetchProducts.fulfilled', () => {
    const initialState = {
      products: [],
      status: 'loading',
      error: null
    };

    const action = { type: fetchProducts.fulfilled.type, payload: [mockProduct] };
    const state = productReducer(initialState, action);

    expect(state.status).toBe('succeeded');
    expect(state.products).toEqual([mockProduct]);
  });

  it('should handle addProduct.fulfilled', () => {
    const initialState = {
      products: [mockProduct],
      status: 'succeeded',
      error: null
    };

    const newProduct = { ...mockProduct, _id: '2', name: 'New Product' };
    const action = { type: addProduct.fulfilled.type, payload: newProduct };
    const state = productReducer(initialState, action);

    expect(state.products).toHaveLength(2);
    expect(state.products[1]).toEqual(newProduct);
  });
});