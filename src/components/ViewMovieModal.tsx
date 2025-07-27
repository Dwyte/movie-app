import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Cast, Movie, MovieDetails, MovieImage } from "../types";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieImages,
  getMovieImageURL,
} from "../tmdbAPI";
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
import useIsSmUp from "../hooks/useIsSmUp";

const ViewMovieModal = () => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [movieCasts, setMovieCasts] = useState<Cast[]>([]);
  const [logo, setLogo] = useState<MovieImage | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isSmUp = useIsSmUp();
  const params = useParams();
  const movieId = params.movieId ? parseInt(params.movieId) : null;

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
      const _movieDetails = await getMovieDetails(movieId);
      setMovieDetails(_movieDetails);

      const _movieCasts = await getMovieCredits(movieId);
      setMovieCasts(_movieCasts.cast);
    };

    fetchMovieDetails();
  }, []);

  useEffect(() => {
    const fetchMovieImages = async () => {
      if (!movieId) return;
      const images = await getMovieImages(movieId);

      const logo = images.logos.find((logo) => logo.iso_639_1 === "en");
      if (logo) setLogo(logo);
    };

    fetchMovieImages();
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
        return getMovieImageURL(movieDetails.backdrop_path, "1920");
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
            className="round-button absolute right-3 top-3 border-0 z-100"
          >
            <BsXLg />
          </button>
          <div className="hidden sm:block absolute inset-0 bottom-[-1px] bg-linear-to-t from-black to-black/0 via-black/75 via-25% to-100%"></div>
          <img
            className="w-full sm:h-110 sm:object-cover"
            src={imgSource}
            alt=""
          />

          <div className="hidden sm:flex flex-col items-start px-10 gap-8 absolute left-0 right-0 bottom-0">
            {logo ? (
              <img
                className="w-auto max-h-30"
                src={getMovieImageURL(logo.file_path)}
                alt=""
              />
            ) : (
              <h1 className="text-2xl font-bold">{movieDetails?.title}</h1>
            )}
            <div className="flex items-center gap-4 w-full">
              <button className="primary-btn justify-center min-w-30">
                <BsPlayFill className="text-2xl mr-1" />
                <span>Play</span>
              </button>

              <button className="round-button">
                <BsPlusLg />
              </button>
              <button className="round-button">
                <BsStar />
              </button>
              <div className="flex-1"></div>
              <button className="round-button opacity-65">
                <RiDownloadLine />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-black sm:px-10 sm:py-8 sm:gap-4">
          {!isSmUp && (
            <h1 className="font-bold text-2xl sm:hidden">
              {movieDetails && movieDetails.title}
            </h1>
          )}
          <div className="flex flex-col gap-2 sm:flex sm:flex-row sm:gap-12">
            <div className="flex flex-col gap-2 sm:flex-3">
              <div className="flex items-center gap-2 text-stone-400">
                <div>{movieDetails && movieDetails.release_date}</div>
                <div>
                  {movieDetails && getDurationString(movieDetails.runtime)}
                </div>
                <BsBadgeHdFill className="text-xl" />
                <BsBadgeCcFill className="text-xl" />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center leading-none text-[8px] font-bold bg-red-600 p-[3px] rounded-[2px]">
                  <span>TOP</span> <span className="text-[11px]">10</span>
                </div>
                <h3 className="font-bold text-lg">#1 in TV Shows Today</h3>
              </div>

              <button className="primary-btn justify-center sm:hidden">
                <BsPlayFill className="text-2xl mr-1" />
                Play
              </button>
              <button className="secondary-btn justify-center sm:hidden">
                <RiDownloadLine className="text-2xl mr-1" />
                Download
              </button>

              <p className="text-stone-300 text-sm">
                {movieDetails && movieDetails.overview}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-2">
              {movieCasts.length > 0 && (
                <div className="text-sm text-stone-400">
                  Casts: &#32;
                  <span className="text-white">
                    {movieCasts
                      .slice(0, 3)
                      .map((cast) => cast.name)
                      .join(", ")}
                  </span>
                </div>
              )}
              <div className="text-sm text-stone-400">
                Genres: &#32;
                <span className="text-white">
                  {movieDetails &&
                    movieDetails.genres.map((genre) => genre.name).join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:hidden">
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
            <h2 className="text-lg font-bold my-2">More Like This</h2>
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
