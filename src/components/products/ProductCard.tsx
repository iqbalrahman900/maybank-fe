// src/components/product/ProductCard.tsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from 'react-modal'
import { TrashIcon, PencilIcon } from 'lucide-react'
import { deleteProduct } from '../../features/products/productSlice'
import { Product } from '../../types/Product'
import { AppDispatch } from '../../store'
import toast from 'react-hot-toast'

type Props = {
    product: Product
    onEdit: () => void 
}

const ProductCard = ({ product, onEdit }: Props) => {
    let dispatch = useDispatch<AppDispatch>()
    let [showDeleteModal, setShowDeleteModal] = useState(false)

    let handleDelete = async () => {
        try {
            await dispatch(deleteProduct(product._id))
            toast.success('Product deleted successfully')
            setShowDeleteModal(false)
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="mt-2">
                        <span className="font-medium">MYR {product.price.toFixed(2)}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500">{product.category}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                    >
                        <PencilIcon size={16} />
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Delete Product</h2>
                    <p className="text-gray-600">
                        Are you sure you want to delete "{product.name}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ProductCard