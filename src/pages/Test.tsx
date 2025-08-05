import { useQuery } from "@tanstack/react-query";
import React from "react";
import { postCreateAccessToken, postCreateRequestToken } from "../misc/tmdbAPI";

const Test = () => {
  const { data: requestToken } = useQuery({
    queryKey: ["request_token"],
    queryFn: postCreateRequestToken,
    staleTime: 1000 * 60 * 5,
  });

  const login = async () => {
    window.open(
      `https://www.themoviedb.org/auth/access?request_token=${requestToken?.request_token}`
    );
  };

  const access = async () => {
    if (!requestToken) return;

    const session = await postCreateAccessToken(requestToken?.request_token);

    console.log(session);
  };

  return (
    <div className="text-white h-100 flex flex-col gap-4 justify-center">
      <h2>Authentication</h2>
      <p className="max-w-100">
        Request_Token {requestToken && requestToken.request_token}
      </p>
      <button className="primary-btn" onClick={login}>
        Login
      </button>
      <button className="primary-btn" onClick={access}>
        access
      </button>
    </div>
  );
};

export default Test;
