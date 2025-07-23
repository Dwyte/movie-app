import { useLocation, useNavigate } from "react-router-dom";
import { Movie } from "../types";
import { getMovieImageURL } from "../tmdbAPI";

const ViewMovieModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state.movie as Movie;

  const closeModal = () => {
    navigate(-1);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="flex justify-center absolute w-full left-0 top-0 h-full text-white mt-20 z-1000"
      onClick={closeModal}
    >
      <div className="">
        <div className="rounded-md w-200 flex-none bg-stone-900">
          <img
            onClick={handleImageClick}
            className="rounded-t-md w-full"
            src={getMovieImageURL(movie.backdrop_path)}
            alt=""
          />
          <p>{movie.title}</p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewMovieModal;
