// src/App.tsx
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'  // Import your store
import ProductList from './components/products/ProductList'

function App() {
  return (
    <Provider store={store}>  {/* Wrap with Provider */}
      <div>
        <ProductList />
      </div>
    </Provider>
  )
}

export default App