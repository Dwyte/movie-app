import React, { useEffect, useMemo, useState } from "react";
import { BsPlayFill, BsPlusLg, BsStar, BsXLg } from "react-icons/bs";
import { getTMDBImageURL } from "../../misc/utils";
import { MediaDetails, MediaImage } from "../../misc/types";
import { RiDownloadLine } from "react-icons/ri";
import { getMediaItemImages } from "../../misc/tmdbAPI";
import { useNavigate } from "react-router-dom";

interface Props {
  mediaItemDetails: MediaDetails | null;
  onClose: () => void;
}

const MediaPageHeroSection = ({ mediaItemDetails, onClose }: Props) => {
  const [logo, setLogo] = useState<MediaImage | null>(null);

  useEffect(() => {
    const fetchMediaImages = async () => {
      if (!mediaItemDetails) return;
      const images = await getMediaItemImages(
        mediaItemDetails.media_type,
        mediaItemDetails.id
      );

      const logo = images.logos.find((logo) => logo.iso_639_1 === "en");
      if (logo) {
        setLogo(logo);
      } else {
        setLogo(null);
      }
    };

    fetchMediaImages();
  }, [mediaItemDetails]);

  const imgSource = useMemo(() => {
    try {
      if (mediaItemDetails) {
        return getTMDBImageURL(mediaItemDetails.backdrop_path, "1920");
      }
    } catch (error) {
      return "/no-image-landscape.png";
    }
  }, [mediaItemDetails]);

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="secondary-icon-btn absolute right-3 top-3 border-0 z-100"
      >
        <BsXLg />
      </button>
      <div className="hidden sm:block absolute inset-0 bottom-[-1px] bg-linear-to-t from-black to-black/0 via-black/75 via-25% to-100%"></div>
      <img className="w-full sm:h-110 sm:object-cover" src={imgSource} alt="" />

      <div className="hidden sm:flex flex-col items-start px-10 gap-8 absolute left-0 right-0 bottom-0">
        {logo ? (
          <img
            className="w-auto max-h-30"
            src={getTMDBImageURL(logo.file_path)}
            alt=""
          />
        ) : (
          <h1 className="text-2xl font-bold">{mediaItemDetails?.title}</h1>
        )}
        <div className="flex items-center gap-4 w-full">
          <button className="primary-btn justify-center min-w-30">
            <BsPlayFill className="text-2xl mr-1" />
            <span>Play</span>
          </button>

          <button className="secondary-icon-btn">
            <BsPlusLg />
          </button>
          <button className="secondary-icon-btn">
            <BsStar />
          </button>
          <div className="flex-1"></div>
          <button className="secondary-icon-btn opacity-65">
            <RiDownloadLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPageHeroSection;
