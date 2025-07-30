import {
  Media,
  MediaDetails,
  Movie,
  MovieDetails,
  TV,
  TVDetails,
} from "./types";

/**
 * Shortens a string by trimming it to whole sentences until it fits within the given maxLength.
 * For example, if the original string has 5 sentences totaling 200 characters, and maxLength is
 * 100, the method will include as many full sentences as possible without exceeding the limit.
 * If the first 2 sentences total 88 characters and the first 3 total 133, the returned string
 * will contain only the first 2.
 * @param string - the original string to shorten
 * @param maxLength - the maximum string length
 * @param separator - the separator of sentences. defaults to ". "
 * @returns shortenned string
 */
export const shortenParagraph = (
  string: string,
  maxLength: number,
  separator: string = ". "
) => {
  const sentences = string.split(separator);

  // If there's only 1 sentence, no need to trim.
  if (sentences.length === 1) return sentences[0];

  let currLength = 0;
  const currSentences = [];

  for (let i = 0; i < sentences.length; i++) {
    const currSentence = sentences[i];
    currSentences.push(currSentence);

    currLength += currSentence.length;
    if (currLength >= maxLength) break;
  }

  currSentences.push(" ");

  return currSentences.join(". ").trim();
};

/**
 * Returns a duration in the follwing format: Xh Xm ex. 2h 54m
 * @param runtimeMinutes duration/runtime in minutes integer
 * @returns
 */
export const getDurationString = (runtimeMinutes: number): string => {
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;
  const hoursString = hours > 0 ? `${hours}h ` : "";

  return `${hoursString}${minutes}m`;
};

export const getTMDBImageURL = (path: string, quality: string = "500") => {
  if (!path) throw Error(`Invalid path.  <${path}>`);

  const MOVIE_IMAGE_BASE_URL = `https://image.tmdb.org/t/p/w${quality}`;
  return `${MOVIE_IMAGE_BASE_URL}${path}`;
};

export const normalizeMedia = (data: TV | Movie): Media => {
  const isMovie = "title" in data;
  const normalizedMedia: Media = {
    ...data,
    media_type: isMovie ? "movie" : "tv",
    title: isMovie ? data.title : data.name,
    original_title: isMovie ? data.original_title : data.original_name,
  };

  return normalizedMedia;
};

export const normalizeMediaDetails = (
  data: TVDetails | MovieDetails
): MediaDetails => {
  const isMovie = "title" in data;
  const normalizedMedia: MediaDetails = {
    ...data,
    media_type: isMovie ? "movie" : "tv",
    title: isMovie ? data.title : data.name,
    original_title: isMovie ? data.original_title : data.original_name,
  };

  return normalizedMedia;
};
