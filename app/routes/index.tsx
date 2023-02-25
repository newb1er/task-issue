import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from 'zod';

import { oauthToken } from "~/cookie";
import { getIssues } from "~/utils/issue";

const ISSUE_PAGINATION = 10;


const tokenCookieSchema = z.object({
  access_token: z.string(),
  token_type: z.enum(['basic', 'bearer']),
  scope: z.string()
});


export const loader = async ({ request }: LoaderArgs) => {
  let token;

  try {
    token = tokenCookieSchema.parse(
      await oauthToken.parse(request.headers.get('Cookie')) || {}
    );

    const ret = await fetch('https://api.github.com/', {
      headers: {
        "Authentication": `${token.token_type} ${token.access_token}`
      }
    })

    if (!ret.ok) throw Error('Not Authenticated');

  } catch {
    return redirect('/github/login');
  }

  const issues = await getIssues(token, ISSUE_PAGINATION, null);

  return json(issues);
};

export default function Index() {
  const issues = useLoaderData<typeof loader>();

  const issuesListView = issues && issues?.edges?.map((issue, index) => 
    issue?.node && <li key={`issus-${index}`}>{issue.node.title}</li>
  );

  return (
    <ul>
      {issuesListView}
    </ul>
  );
}
