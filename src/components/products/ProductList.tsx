// src/components/product/ProductList.tsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PlusIcon } from 'lucide-react'
import { fetchProducts } from '../../features/products/productSlice'
import { Product } from '../../types/Product'
import { RootState, AppDispatch } from '../../store'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'

const ProductList = () => {
    let dispatch = useDispatch<AppDispatch>()
    let { products, status, error } = useSelector((state: RootState) => state.products)
    let [showForm, setShowForm] = useState(false)
    let [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts())
        }
    }, [status, dispatch])

    if (status === 'loading') {
        return <div className="flex justify-center p-8">Loading...</div>
    }

    if (status === 'failed') {
        return <div className="text-red-500 p-4">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Muhammad Iqbal</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <PlusIcon size={16} />
                    Add Product
                </button>
            </div>

            {showForm && (
                <ProductForm
                    product={selectedProduct}
                    onClose={() => {
                        setShowForm(false)
                        setSelectedProduct(null)
                    }}
                />
            )}

            <div className="grid gap-4">
                {products?.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onEdit={() => {
                            setSelectedProduct(product)
                            setShowForm(true)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default ProductList