import React from 'react';

const Topbar = () => {
  return (
    <div className="bg-[#333232] overflow-hidden whitespace-nowrap py-2">
      <div className="flex animate-marquee gap-32 text-white">
        {/* Duplicate content for infinite scroll effect */}
        <div className="flex gap-32">
          <span>Free shipping</span>
          <span>Delivery:0-7 Days only</span>
          <span>Free coupon applied</span>
        </div>
        <div className="flex gap-32">
          <span>Free shipping</span>
          <span>Delivery:0-7 Days only</span>
          <span>Free coupon applied</span>
        </div>
        <div className="flex gap-32">
          <span>Free shipping</span>
          <span>Delivery:0-7 Days only</span>
          <span>Free coupon applied</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

