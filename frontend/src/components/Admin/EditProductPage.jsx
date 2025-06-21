import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { updateProduct } from '../../redux/slices/adminProductSlice';
import axios from 'axios';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    rating: 0,
    countInStock: 0,
    sku: '',
    category: '',
    brand: '',
    sizes: [],
    colors: [],
    collections: '',
    material: '',
    gender: '',
    ethnic_weave: '',
    styles: '',
    images: [],
    isFeatured: false,
    isPublished: false,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
     setProductData((prev) => ({
  ...prev,
  ...selectedProduct,
  sizes: selectedProduct.sizes || [],
  colors: selectedProduct.colors || [],
  images: (selectedProduct.images || []).map((img) => ({
    url: img.url,
    altText: img.altText || '',
    color: img.color || '',
  })),
}));

    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: '', color: '' }],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const updateImageField = (index, field, value) => {
    const updatedImages = [...productData.images];
    updatedImages[index][field] = value;
    setProductData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate('/admin/products');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" name="name" value={productData.name} onChange={handleChange} required />
          <Input label="Price" name="price" type="number" value={productData.price} onChange={handleChange} required />
          <Input label="Discount Price" name="discountPrice" type="number" value={productData.discountPrice} onChange={handleChange} />
          <Input label="Rating (0-5)" name="rating" type="number" min="0" max="5" step="0.1" value={productData.rating} onChange={handleChange} />
          <Input label="Count In Stock" name="countInStock" type="number" value={productData.countInStock} onChange={handleChange} required />
          <Input label="SKU" name="sku" value={productData.sku} onChange={handleChange} />
          <Input label="Brand" name="brand" value={productData.brand} onChange={handleChange} />

          <div>
            <label className="block font-semibold mb-2">Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select</option>
              <option value="Sarees">Sarees</option>
              <option value="Dresses">Dresses</option>
              <option value="Kidswear">Kidswear</option>
            </select>
          </div>

          <Input
            label="Sizes (comma separated)"
            name="sizes"
            value={productData.sizes.join(',')}
            onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(',').map((s) => s.trim()) })}
          />

          <Input
            label="Colors (comma separated)"
            name="colors"
            value={productData.colors.join(',')}
            onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(',').map((c) => c.trim()) })}
          />

          <Input label="Collection" name="collections" value={productData.collections} onChange={handleChange} />
          <Input label="Material" name="material" value={productData.material} onChange={handleChange} />

          {productData.category === 'Sarees' && (
            <Input label="Ethnic Weave" name="ethnic_weave" value={productData.ethnic_weave} onChange={handleChange} />
          )}

          {productData.category === 'Dresses' && (
            <Input label="Styles" name="styles" value={productData.styles} onChange={handleChange} />
          )}

          {productData.category === 'Kidswear' && (
            <div>
              <label className="block font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={productData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select</option>
                <option value="girls">Girls</option>
                <option value="boys">Boys</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {productData.images.map((img, idx) => (
              <div key={idx} className="border rounded-md p-2">
                <img
                  src={img.url}
                  alt={img.altText || 'Product Image'}
                  className="w-full h-32 object-cover mb-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.altText || ''}
                  onChange={(e) => updateImageField(idx, 'altText', e.target.value)}
                  className="w-full border p-1 mb-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={img.color || ''}
                  onChange={(e) => updateImageField(idx, 'color', e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mt-4">
          <label>
            <input type="checkbox" name="isFeatured" checked={productData.isFeatured} onChange={handleChange} /> Featured
          </label>
          <label>
            <input type="checkbox" name="isPublished" checked={productData.isPublished} onChange={handleChange} /> Published
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 mt-6 rounded hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="block font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);

export default EditProductPage;
