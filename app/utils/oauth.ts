import { type Cookie } from "@remix-run/node";
import { z } from "zod";

import { oauthToken } from "~/cookie";

export async function retriveTokenFromCookie(
  cookieHeader: string,
  cookieParser: Cookie
) {
  return await cookieParser.parse(cookieHeader);
}

const githubTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.enum(["basic", "bearer"]),
  scope: z.string(),
});

export type GithubToken = z.infer<typeof githubTokenSchema>;

export const retrieveGithubToken = async (cookieHeader: string) => {
  const cookie = await retriveTokenFromCookie(cookieHeader, oauthToken);
  const parsedToken = githubTokenSchema.safeParse(cookie);

  return parsedToken.success ? parsedToken.data : null;
};

export const validateGithubToken = async (token: GithubToken) => {
  const parsedToken = githubTokenSchema.safeParse(token);

  if (!parsedToken.success) {
    throw new Error("TypeError: Invalid token format");
  }

  const requestResult = await fetch("https://api.github.com/", {
    headers: {
      Authentication: `${token.token_type} ${token.access_token}`,
    },
  });

  if (!requestResult.ok) {
    throw new Error("AuthError: Invalid token or expired");
  }
};
