import { redirect, type LoaderArgs } from "@remix-run/node";
import { oauthToken } from "~/cookie";

const GhUrl = "https://github.com/login/oauth/access_token";
const clientId = process.env.GITHUB_CLIENT_ID as string;
const clientSecret = process.env.GITHUB_CLIENT_SECRET as string;

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const authUrl = new URL(GhUrl);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("client_secret", clientSecret);
  authUrl.searchParams.set("code", code as string);

  // TODO: error handling
  const token = await fetch(authUrl.href, {
    method: "post",
    headers: { Accept: "application/json" },
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await oauthToken.serialize(await token.json()),
    },
  });
};

export default function Callback() {}
