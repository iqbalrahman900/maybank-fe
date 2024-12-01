import { Provider } from 'react-redux';
import { store } from './store';
import ProductList from './components/ProductList';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <ProductList />
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;