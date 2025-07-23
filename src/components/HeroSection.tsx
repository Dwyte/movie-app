import React from "react";

const HeroSection = () => {
  return (
    <div className="relative">
      <img className="w-full h-150 object-cover" src="/hero-image.jpg" alt="Random Movie Posters" />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-linear-to-t from-[#181818] to-white/0 to-25%">
        Hero Section
      </div>
    </div>
  );
};

export default HeroSection;
