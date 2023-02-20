import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient } from "graphql-request";
import { z } from 'zod';

import { oauthToken } from "~/cookie";
import { graphql } from "~/gql";

const ISSUE_PAGINATION = 10;


const tokenCookieSchema = z.object({
  access_token: z.string(),
  token_type: z.enum(['basic', 'bearer']),
  scope: z.string()
});

const issuesQueryDocument = graphql(`
  query issues($after: String) {
    viewer {
      issues(orderBy: {field: CREATED_AT, direction: DESC}, first: ${ISSUE_PAGINATION}, after: $after) {
        totalCount
        edges {
          cursor
          node {
            id
            title
            state
            stateReason
            createdAt
          }
        }
      }
    }
  }
`);



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

  const envGithubApiUrl = z.string().parse(process.env.GITHUB_API_URL);
  const graphqlClient = new GraphQLClient(envGithubApiUrl, {
    headers: {
      authorization: `${token.token_type} ${token.access_token}`
    }
  });

  const data = await graphqlClient.request(issuesQueryDocument, { after: null });

  return json(data.viewer.issues);
};

export default function Index() {
  const issues = useLoaderData<typeof loader>();

  console.log(issues);
  
  const issuesListView = issues && issues?.edges?.map((issue, index) => 
    issue?.node && <li key={`issus-${index}`}>{issue.node.title}</li>
  );

  return (
    <ul>
      {issuesListView}
    </ul>
  );
}
