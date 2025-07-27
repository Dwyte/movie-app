import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Movie, MovieDetails } from "../types";
import { getMovieDetails, getMovieImageURL } from "../tmdbAPI";
import {
  BsBadgeCcFill,
  BsBadgeHdFill,
  BsPlayFill,
  BsPlusLg,
  BsSend,
  BsStar,
  BsXLg,
} from "react-icons/bs";
import { RiDownloadLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { getDurationString } from "../utils";

const ViewMovieModal = () => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId } = useParams();

  useEffect(() => {
    // Disable main body scrolling
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;
      const response = await getMovieDetails(parseInt(movieId));
      setMovieDetails(response);
    };

    fetchMovieDetails();
  }, []);

  const closeModal = () => {
    if (location.state && location.state.backgroundLocation) {
      navigate(location.state.backgroundLocation);
      return;
    }

    navigate("/");
  };

  const imgSource = useMemo(() => {
    try {
      if (movieDetails) {
        return getMovieImageURL(movieDetails.backdrop_path);
      }
    } catch (error) {
      return "/no-image-landscape.png";
    }
  }, [movieDetails]);

  return (
    <div
      onClick={closeModal}
      className="flex justify-center fixed inset-0 text-white z-10000 bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-200 sm:mt-8 sm:rounded-sm scrollable-x"
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="round-button absolute right-3 top-3 bg-black/70 border-0"
          >
            <BsXLg />
          </button>

          <img
            className="w-full sm:h-110 sm:object-cover"
            src={imgSource}
            alt=""
          />
        </div>

        <div className="flex flex-col gap-2 p-4 bg-black">
          <h1 className="font-bold text-2xl">
            {movieDetails ? movieDetails.title : "Movie Title"}
          </h1>
          <div className="flex items-center gap-2 text-stone-400">
            <div>{movieDetails && movieDetails.release_date}</div>
            <div>{movieDetails && getDurationString(movieDetails.runtime)}</div>
            <BsBadgeHdFill className="text-xl" />
            <BsBadgeCcFill className="text-xl" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center leading-none text-[8px] font-bold bg-red-600 p-[3px] rounded-[2px]">
              <span>TOP</span> <span className="text-[11px]">10</span>
            </div>
            <h3 className="font-bold text-lg">#1 in TV Shows Today</h3>
          </div>

          <button className="primary-btn justify-center">
            <BsPlayFill className="text-2xl mr-1" />
            Play
          </button>
          <button className="secondary-btn justify-center">
            <RiDownloadLine className="text-2xl mr-1" />
            Download
          </button>
          <p className="text-stone-300 text-sm">
            {movieDetails && movieDetails.overview}
          </p>

          <div className="text-sm text-stone-400">
            Genres: &#32;
            <span className="text-white">
              {movieDetails &&
                movieDetails.genres.map((genre) => genre.name).join(", ")}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="flex flex-col justify-between items-center gap-1 px-3 py-2 min-w-16 border-b-2 border-b-red-600">
              <BsPlusLg className="text-2xl p-[3px]" />
              <span className="text-sm">My List</span>
            </button>
            <button className="flex flex-col justify-between items-center px-3 py-2 min-w-16">
              <BsSend className="text-2xl p-[3px]" />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex flex-col justify-between items-center px-3 py-2 min-w-16">
              <BsStar className="text-2xl p-[3px]" />
              <span className="text-sm">Rate</span>
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold my-2">More Like This</h3>
            <div className="grid grid-cols-3 gap-2">
              <img src="/no-image-portrait.png" className="rounded-sm" alt="" />
              <img src="/no-image-portrait.png" className="rounded-sm" alt="" />
              <img src="/no-image-portrait.png" className="rounded-sm" alt="" />
              <img src="/no-image-portrait.png" className="rounded-sm" alt="" />
              <img src="/no-image-portrait.png" className="rounded-sm" alt="" />
              <img src="/no-image-portrait.png" className="rounded-sm" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMovieModal;
