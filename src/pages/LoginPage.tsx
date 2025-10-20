import { useQuery } from "@tanstack/react-query";
import {
  postCreateAccessToken,
  postCreateRequestToken,
  postCreateSessionFromV4Token,
} from "../misc/tmdbAPI";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import heroImage from "/hero-image.jpg";
import PageContainer from "../components/PageContainer";

enum LoginState {
  INITIAL,
  FOR_APPROVAL,
  APPROVED,
}

const LoginPage = () => {
  const [loginState, setLoginState] = useState<LoginState>(LoginState.INITIAL);
  const { login, isLoggedIn } = useAuth();

  const { data: requestToken } = useQuery({
    queryKey: ["request_token"],
    queryFn: postCreateRequestToken,
    staleTime: 1000 * 60 * 5,
  });

  useQuery({
    enabled: requestToken?.success && loginState === LoginState.FOR_APPROVAL,
    queryKey: ["access_token"],
    queryFn: async () => {
      if (!requestToken) return null;

      const accessToken = await postCreateAccessToken(
        requestToken?.request_token,
      );

      if (!accessToken.success) {
        throw Error("still unapproved login...");
      }

      const session = await postCreateSessionFromV4Token(
        accessToken.access_token,
      );

      setLoginState(LoginState.APPROVED);

      login(
        session.session_id,
        accessToken.access_token,
        accessToken.account_id,
      );

      // Redirect to home
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

      return { accessToken, session };
    },
    refetchInterval: (data) => {
      return data ? false : 1000 * 3;
    },
  });

  const startLogin = async () => {
    setLoginState(LoginState.FOR_APPROVAL);

    window.open(
      `https://www.themoviedb.org/auth/access?request_token=${requestToken?.request_token}`,
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn]);

  return (
    <PageContainer className="p-1 text-white h-full flex flex-col items-center justify-center relative">
      <img
        className="h-[100vh] opacity-100 object-cover saturate-25"
        src={heroImage}
        alt=""
      />
      <div className="bg-noise inset-0 absolute"></div>
      <div className="absolute p-8 bg-black/90  sm:min-w-125">
        <h2 className="text-2xl mt-0 mb-4">Sign-in</h2>
        <button
          data-variant="primary"
          className="btn justify-center w-full font-bold px-8 py-4"
          onClick={startLogin}
          disabled={!requestToken?.success}
        >
          Log-in via TheMovieDatabase
        </button>
        {loginState === LoginState.FOR_APPROVAL && (
          <p className="mt-4 text-sm text-stone-300 animate-pulse">
            Waiting for authorization... Please approve Log-in on TMDB...
          </p>
        )}
        {loginState === LoginState.APPROVED && (
          <p className="mt-4 text-sm text-stone-300 animate-pulse">
            Log-in approved, redirecting...
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default LoginPage;
