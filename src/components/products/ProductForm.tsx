// src/components/product/ProductForm.tsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProduct, updateProduct } from '../../features/products/productSlice'
import { Product } from '../../types/Product'
import { PRODUCT_CATEGORIES } from './constants'
import { AppDispatch } from '../../store'
import toast from 'react-hot-toast'

type Props = {
    product: Product | null
    onClose: () => void
}

const ProductForm = ({ product, onClose }: Props) => {
    let dispatch = useDispatch<AppDispatch>()
    let [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || 0,
        category: product?.category || 'Electronics',
        description: product?.description || ''
    })

    let handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (product) {
                await dispatch(updateProduct({ id: product._id, product: formData }))
                toast.success('Product updated successfully')
            } else {
                await dispatch(addProduct(formData))
                toast.success('Product added successfully')
            }
            onClose()
        } catch (error) {
            toast.error('Failed to save product')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {product ? 'Edit Product' : 'Add Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            className="w-full border rounded p-2"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full border rounded p-2 bg-white"
                            required
                        >
                            {PRODUCT_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full border rounded p-2"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {product ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductForm