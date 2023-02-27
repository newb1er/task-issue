import { GraphQLClient } from "graphql-request";
import { graphql } from "~/gql/gql";

const issuesQueryDocument = graphql(`
  query issues($after: String, $pagination: Int) {
    viewer {
      issues(
        orderBy: { field: CREATED_AT, direction: DESC }
        first: $pagination
        after: $after
      ) {
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

export async function getIssues(
  token: { token_type: string; access_token: string },
  pagination: number,
  after: string | null
): Promise<any> {
  const client = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const data = await client.request(issuesQueryDocument, {
    pagination,
    after,
  });

  return data.viewer.issues;
}
