import React from "react";

const HeroSection = () => {
  return (
    <div className="relative">
      <img
        className="w-full h-150 object-cover"
        src="/hero-image.jpg"
        alt="Random Movie Posters"
      />
      <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-linear-to-t from-[#000] via-black/10 via-50% to-[#000] to-100%">
        <h2>Unlimited movies, TV shows, and more.</h2>
      </div>
    </div>
  );
};

export default HeroSection;
