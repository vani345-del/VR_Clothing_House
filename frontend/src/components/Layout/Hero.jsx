import hero from '../../assets/shreya.jpg';
import Navbar from '../Common/Navbar';
import { HiOutlineChevronDown } from 'react-icons/hi';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hero Image */}
      <img
        src={hero}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover object-center sm:object-[40%_30%] md:object-[40%_30%] 2xl:object-[40%_10%] filter brightness-100"
      />

      {/* Optional Overlay */}
      <div className="absolute inset-0 z-10 bg-black/20" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Text */}
       <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center text-white">
        <div className="max-w-[90%] sm:max-w-2xl">
         <h1
  className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wide mb-6 drop-shadow-lg text-white"
  style={{ fontFamily: "'Playfair Display', serif" }}
>
  VR Clothing House
</h1>

<p className="text-base sm:text-lg md:text-2xl font-bold drop-shadow-sm mt-2">
  Explore the best collection of Dresses & Sarees & Kidsware
</p>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 text-white animate-bounce">
  <div className="flex flex-col items-center text-center">
    <p className="text-sm mb-1">Scroll Down</p>
    <HiOutlineChevronDown size={28} />
  </div>
</div>

    </div>
  );
};

export default Hero;
