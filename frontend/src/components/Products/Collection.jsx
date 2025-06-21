import React from 'react';
import dress from '../../assets/dressc.jpg';
import saree from '../../assets/saree.jpg';
import kids from '../../assets/kids.jpg';
import { Link } from 'react-router-dom';

const Collection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-col md:flex-row gap-8'>
        
        {/* Kids Wear */}
        <div className='relative flex-1 border-2 border-black rounded-lg overflow-hidden'>
          <div className="w-full h-0 pb-[140%] relative"> {/* Maintains aspect ratio */}
            <img
              src={kids}
              alt='kids collection'
              className='absolute top-0 left-0 w-full h-full object-cover'
            />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Kids Collection</h2>
              <Link to='/kidsware' className='text-gray-900 underline'>
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Sarees */}
        <div className='relative flex-1 border-2 border-black rounded-lg overflow-hidden'>
          <div className="w-full h-0 pb-[140%] relative">
            <img
              src={saree}
              alt='sarees collection'
              className='absolute top-0 left-0 w-full h-full object-cover'
            />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Sarees Collection</h2>
              <Link to='/sarees' className='text-gray-900 underline'>
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Dresses */}
        <div className='relative flex-1 border-2 border-black rounded-lg overflow-hidden'>
          <div className="w-full h-0 pb-[140%] relative">
            <img
              src={dress}
              alt='dresses collection'
              className='absolute top-0 left-0 w-full h-full object-cover filter brightness-120'
            />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Dresses Collection</h2>
              <Link to='dresses' className='text-gray-900 underline'>
                Shop Now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Collection;
