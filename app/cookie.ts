import { createCookie } from "@remix-run/node";

export const oauthToken = createCookie('oauth-token', {
    maxAge: 604_800,
})