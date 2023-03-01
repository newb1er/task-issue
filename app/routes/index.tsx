import { redirect, type LoaderArgs } from "@remix-run/node";

import { retrieveGithubToken, validateGithubToken } from "~/utils/oauth";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) return redirect("/github/login");

  const token = await retrieveGithubToken(cookieString);

  try {
    if (token === null) throw new Error("Token is null");
    validateGithubToken(token);
  } catch {
    return redirect("/github/login");
  }

  return redirect("/task");
};

export default function Index() {}
