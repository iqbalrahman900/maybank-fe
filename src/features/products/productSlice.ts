import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../types/Product';

interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('https://54.254.44.180/api/products');
  return response.json();
});

export const addProduct = createAsyncThunk(
    'products/addProduct', 
    async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const response = await fetch('https://54.254.44.180/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: product.name,
            price: Number(product.price),  
            category: product.category,
            description: product.description
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Could not create product');
        }
  
        return response.json();
      } catch (error) {
        console.error('Error creating product:', error);
        throw error;
      }
    }
  );

export const updateProduct = createAsyncThunk('products/updateProduct', 
  async ({ id, product }: { id: string; product: Partial<Product> }) => {
    const response = await fetch(`https://54.254.44.180/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    return response.json();
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
  await fetch(`https://54.254.44.180/api/products/${id}`, {
    method: 'DELETE',
  });
  return id;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
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
        const index = state.products.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product._id !== action.payload);
      });
  },
});

export default productSlice.reducer;