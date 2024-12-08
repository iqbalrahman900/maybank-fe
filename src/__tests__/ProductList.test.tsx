// src/__tests__/ProductList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductList from '../components/ProductList';

// Create mock store
const mockStore = configureStore([]);

describe('ProductList', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      products: {
        products: [{
          _id: '1',
          name: 'Test Product',
          price: 99.99,
          category: 'Electronics',
          description: 'Test description',
          createdAt: '2024-12-01',
          updatedAt: '2024-12-01'
        }],
        status: 'succeeded',
        error: null
      }
    });
  });

  it('renders product list', () => {
    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});