import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";

import { BsPlusCircleFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import { shortenParagraph, getTMDBImageURL } from "../misc/utils";
import { Media, MediaImage } from "../misc/types";
import { getMediaItemImages, getTrendingMediaItems } from "../misc/tmdbAPI";
import GenreList from "./GenreList";

const HeroSection = () => {
  const [mediaItem, setMediaItem] = useState<Media | null>(null);
  const [logo, setLogo] = useState<MediaImage | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMediaItems = async () => {
      const trendingMediaItems = await getTrendingMediaItems("movie", "week");
      const randomMediaItem =
        trendingMediaItems.results[
          Math.floor(Math.random() * trendingMediaItems.results.length)
        ];
      const images = await getMediaItemImages(
        randomMediaItem.media_type,
        randomMediaItem.id
      );

      const backdrop = images.backdrops.filter(
        (backdrop) => backdrop.iso_639_1 === null
      )[Math.floor(Math.random() * images.backdrops.length)];

      if (backdrop) randomMediaItem.backdrop_path = backdrop.file_path;

      const logo = images.logos.find((logo) => logo.iso_639_1 === "en");

      if (logo) setLogo(logo);

      setMediaItem(randomMediaItem);
    };

    fetchMediaItems();
  }, []);

  const handleMoreInfoClick = () => {
    if (!mediaItem) return;
    navigate(`/${mediaItem.media_type}/${mediaItem.id}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <div className="relative min-h-150">
      <div className="hidden sm:block absolute inset-0 bg-linear-to-r from-black to-black/0 to-60%"></div>{" "}
      <img
        className="w-full h-150 sm:h-screen object-cover sm:inset-shadow-lg"
        src={
          mediaItem
            ? getTMDBImageURL(mediaItem?.backdrop_path, "1920")
            : "/hero-image.jpg"
        }
        alt="Media Backdrop Image"
      />
      {mediaItem && (
        <div className="flex items-end sm:items-center sm:mt-[-100px] justify-center sm:justify-start absolute top-0 bottom-[-1px] right-0 left-0 bg-linear-to-t from-[#000] to-black/0 to-50% sm:to-25%">
          <div className="flex flex-col gap-2 sm:gap-4 justify-center sm:ml-12">
            {logo && (
              <div className="flex mb-2 px-10 justify-center sm:px-0 sm:justify-start">
                <img
                  className={`w-auto max-h-50 sm:w-auto sm:max-h-65`}
                  src={getTMDBImageURL(logo.file_path, "500")}
                  alt=""
                />
              </div>
            )}

            <div className="hidden text-white sm:block sm:w-150 sm:text-sm">
              {shortenParagraph(mediaItem.overview, 100)}
            </div>

            <GenreList
              genreIds={mediaItem.genre_ids}
              className="text-center sm:text-left"
            />
            <div className="flex gap-4 justify-center sm:justify-start">
              <button className="primary-btn">
                <BsPlusCircleFill className="text-md mr-2" />
                Add to my List
              </button>

              <button onClick={handleMoreInfoClick} className="secondary-btn">
                <FaInfoCircle className="text-md mr-2" />
                More Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
