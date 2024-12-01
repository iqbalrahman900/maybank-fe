import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../features/products/productSlice';
import type { Product } from '../types/Product';
import Modal from 'react-modal';
import type { RootState, AppDispatch } from '../store';
import toast from 'react-hot-toast';

const ProductList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, status, error } = useSelector((state: RootState) => state.products);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchProducts());
    }, [status, dispatch]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">MUHAMMAD IQBAL BIN ABDUL RAHMAN</h1>
                <button
                    onClick={() => { setSelectedProduct(null); setIsFormOpen(true); }}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <PlusIcon size={16} /> Add Product
                </button>
            </div>

            {isFormOpen && <ProductForm product={selectedProduct} onClose={() => setIsFormOpen(false)} />}

            <div className="grid gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product._id || `temp-${Date.now()}`}
                        product={product}
                        onEdit={() => { setSelectedProduct(product); setIsFormOpen(true); }}
                    />
                ))}
            </div>
        </div>
    );
};

const ProductCard = ({ product, onEdit }: { product: Product; onEdit: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteProduct(product._id));
            toast.success('Product deleted');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="mt-2">
                        <span>MYR {(product.price ?? 0).toFixed(2)}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500">{product.category}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                        <PencilIcon size={16} />
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <TrashIcon size={16} />
                    </button>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <div>
                    <h2>Delete Product</h2>
                    <p>Are you sure you want to delete "{product.name}"?</p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const ProductForm = ({ product, onClose }: { product: Product | null; onClose: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || 0,
        category: product?.category || 'Electronics',
        description: product?.description || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (product) {
                await dispatch(updateProduct({ id: product._id, product: formData }));
                toast.success('Product updated');
            } else {
                await dispatch(addProduct(formData));
                toast.success('Product added');
            }
            onClose();
        } catch (error) {
            toast.error('Error saving product');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full border rounded p-2"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full border rounded p-2"
                            required
                        >
                            {['Electronics', 'Clothing', 'Food', 'Books'].map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border rounded p-2"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">{product ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductList;
