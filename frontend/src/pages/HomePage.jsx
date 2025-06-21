import React from 'react'
import Hero from '../components/Layout/Hero'
import Collection from '../components/Products/Collection'
import NewArrivals from '../components/Products/NewArrivals'
import FeaturedSection from '../components/Products/FeaturedSection'
import Style from '../components/Products/Style'
import ProductDetails from '../components/Products/productDetails'
import { useEffect,useState } from 'react'
import biglogo from '../assets/biglogo.png'
import axios from 'axios'
const HomePage = () => {
  const [bestSellerProduct, setBestSellerProduct] =useState(null);

  useEffect(() => {
  const fetchBestSeller = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
      setBestSellerProduct(response.data);
      console.log("Best Seller Product:", response.data);
      if (!response.data || !response.data._id) {
        console.warn("No valid best seller product found");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  fetchBestSeller();
}, []); 


  return (
    <div>
        <Hero/>
        <Collection/>
        <NewArrivals/>

        {/* best Seller */}
        <h2 className='text-3xl text-center font-bold mt-8'>
          Best Seller
        </h2>
        {bestSellerProduct ?(
          
          <ProductDetails productId={bestSellerProduct._id}/>
         

        ):(
          <p className='text-center'>Loading best seller products....
          </p>
        )}
        
    
         <Style/>
          <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-4 lg:py-4">
  <h2 className="flex items-center justify-center gap-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
  <img
    src={biglogo}
    alt="Logo"
    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
  />
  VR Clothing House
</h2>


  <p className="text-base mt-4 md:text-lg lg:text-xl max-w-3xl text-gray-700">
  VR Clothing House is a budget-friendly clothing store that has everything from casual basics to luxurious statement pieces. 
    If you’re looking for an elegant yet bold look, this is your go-to spot for quality pieces at affordable prices.
  </p>
</div>


        <FeaturedSection/>
       
    </div>
  )
}

export default HomePage