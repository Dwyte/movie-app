import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MediaCard from "../components/MediaCard";

import { getDiscoverMediaItems, getSearchMediaItems } from "../misc/tmdbAPI";
import { Media, MediaSection } from "../misc/types";
import MediaItemsRow from "../components/MediaItemsRow";

const SearchResults = () => {
  const [mediaSections, setMediaSections] = useState<MediaSection[]>();
  const [searchParams] = useSearchParams();

  const searchMediaItems = async (query: string) => {
    const movieResults = (await getSearchMediaItems("movie", query)).results;
    const tvResults = (await getSearchMediaItems("tv", query)).results;

    if (movieResults.length === 0 && tvResults.length === 0) {
      setMediaSections([]);
      return;
    }

    const likeMovieResults =
      movieResults.length > 1
        ? await getDiscoverMediaItems("movie", {
            with_genres: (movieResults || tvResults)[0].genre_ids
              .map((id) => id.toString())
              .join(","),
            sort_by: "popularity.desc",
          })
        : { results: [] };

    const movieSection = [...movieResults, ...likeMovieResults.results]
      .filter((media) => media.backdrop_path) // remove no backdrop results
      .filter(
        (media, index, self) =>
          index === self.findIndex((t) => t.id === media.id)
      ) // remove duplicates
      .slice(0, 12);

    const likeTVResults = await getDiscoverMediaItems("tv", {
      with_genres: (tvResults || movieResults)[0].genre_ids
        .map((id) => id.toString())
        .join(","),
      sort_by: "popularity.desc",
    });

    const tvSection = [...tvResults, ...likeTVResults.results]
      .filter((media) => media.backdrop_path)
      .filter(
        (media, index, self) =>
          index === self.findIndex((t) => t.id === media.id)
      )
      .slice(0, 12);

    console.log(movieSection, tvSection);

    setMediaSections([
      {
        id: "movie-results",
        title: "Movies",
        mediaItems: movieSection,
      },
      {
        id: "tv-results",
        title: "TV Shows",
        mediaItems: tvSection,
      },
    ]);
  };

  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      searchMediaItems(query);
    }
  }, [searchParams]);

  return (
    query && (
      <div className="mt-20 sm:mt-24">
        <h1 className="hidden sm:block text-2xl text-stone-500 sm:mb-4 sm:pl-12">
          Search Results for: <span className="text-white">"{query}"</span>
        </h1>

        {mediaSections
          ?.filter((section) => section.mediaItems.length)
          .map((section, index) => (
            <div className={index > 0 ? "sm:mt-[-36px]" : ""}>
              <MediaItemsRow
                key={section.id}
                title={section.title}
                mediaItems={section.mediaItems}
              />
            </div>
          ))}
      </div>
    )
  );
};

export default SearchResults;
