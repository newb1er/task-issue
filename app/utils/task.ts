import { GraphQLClient } from "graphql-request";
import { graphql } from "~/gql/gql";
import { type GithubToken } from "./oauth";

const tasksQueryDocument = graphql(`
  query issues($after: String, $pagination: Int) {
    viewer {
      issues(
        filterBy: { states: OPEN }
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
            createdAt
          }
        }
      }
    }
  }
`);

export async function getTasks(
  token: GithubToken,
  pagination: number,
  after: string | null
) {
  const client = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const data = await client.request(tasksQueryDocument, {
    pagination,
    after,
  });

  const tasklist =
    data.viewer.issues.edges?.map((edge) => {
      return (
        edge?.node && {
          id: edge.node.id,
          title: edge.node.title,
          createdAt: edge.node.createdAt,
        }
      );
    }) || [];

  return {
    totalCount: data.viewer.issues.totalCount,
    list: tasklist,
    lastCursor: data.viewer.issues.edges?.slice(-1)[0]?.cursor || null,
  };
}
