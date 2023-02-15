import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { z } from 'zod';

import { oauthToken } from "~/cookie";

const tokenCookieSchema = z.object({
  access_token: z.string(),
  token_type: z.enum(['basic', 'bearer']),
  scope: z.string()
});

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const token = tokenCookieSchema.parse(
      await oauthToken.parse(request.headers.get('Cookie')) || {}
    );

    const ret = await fetch('https://api.github.com/', {
      headers: {
        "Authentication": `${token.token_type} ${token.access_token}`
      }
    })

    if (!ret.ok) throw Error('Not Authenticated');

    return json(token);

  } catch {
    return redirect('/github/login');
  }
};

export default function Index() {
  return (
    <>
    </>
  );
}
