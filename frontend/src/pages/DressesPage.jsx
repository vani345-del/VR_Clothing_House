import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchFilteredProducts } from '../redux/slices/productSlice';
import ProductListPage from '../components/Products/ProductListPage';

const DressesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    dispatch(fetchFilteredProducts({ category: 'Dresses', search }));
  }, [dispatch, search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <ProductListPage products={products} title="Dresses Collection" />;
};

export default DressesPage;



