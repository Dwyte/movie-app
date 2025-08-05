import { useQuery } from "@tanstack/react-query";
import {
  postCreateAccessToken,
  postCreateRequestToken,
  postCreateSessionFromV4Token,
} from "../misc/tmdbAPI";
import { useState } from "react";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: requestToken } = useQuery({
    queryKey: ["request_token"],
    queryFn: postCreateRequestToken,
    staleTime: 1000 * 60 * 5,
  });

  useQuery({
    enabled: requestToken?.success && isLoggingIn,
    queryKey: ["access_token"],
    queryFn: async () => {
      if (!requestToken) return null;

      const accessToken = await postCreateAccessToken(
        requestToken?.request_token
      );

      if (!accessToken.success) {
        throw Error("still unapproved login...");
      }

      const sessionId = await postCreateSessionFromV4Token(
        accessToken.access_token
      );

      localStorage.setItem("access_token", JSON.stringify(accessToken));
      localStorage.setItem("session_id", JSON.stringify(sessionId));

      setIsLoggingIn(false);
      return { accessToken, sessionId };
    },
    refetchInterval: (data) => {
      return data ? false : 1000 * 3;
    },
  });

  const login = async () => {
    setIsLoggingIn(true);

    window.open(
      `https://www.themoviedb.org/auth/access?request_token=${requestToken?.request_token}`
    );
  };

  return (
    <div className="text-white h-full flex flex-col items-center justify-center">
      <img className="h-full opacity-75" src="/hero-image.jpg" alt="" />
      <div className="absolute p-8 bg-black/90 rounded-sm min-w-125">
        <h2>Sign-in</h2>
        <button
          className="w-full font-bold bg-red-700 px-8 py-4 rounded-sm cursor-pointer hover:opacity-70"
          onClick={login}
          disabled={!requestToken?.success}
        >
          Log-in via TheMovieDatabase
        </button>
        {isLoggingIn && (
          <p className="mt-4 text-sm text-stone-300 animate-pulse">
            Waiting for authorization... Please approve Log-in on TMDB...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
