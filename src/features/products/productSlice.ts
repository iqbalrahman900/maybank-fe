import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../types/Product';

const API_URL = 'https://54.169.80.184/api/products';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// API Functions
const api = {
  get: () => fetch(API_URL),
  post: (data: any) => fetch(API_URL, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  }),
  put: (id: string, data: any) => fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  }),
  delete: (id: string) => fetch(`${API_URL}/${id}`, { method: 'DELETE' })
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => (await api.get()).json()
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post({
      ...product,
      price: Number(product.price)
    });
    if (!response.ok) throw new Error('Failed to add product');
    return response.json();
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, product }: { id: string; product: Partial<Product> }) => 
    (await api.put(id, product)).json()
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await api.delete(id);
    return id;
  }
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [] as Product[],
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;