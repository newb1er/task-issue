import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, List, ListItem, Card, CardBody } from "@chakra-ui/react";

import { getIssues } from "~/utils/issue";
import { retrieveGithubToken } from "~/utils/oauth";

const PAGINATION = 10;

export const loader = async ({ request }: LoaderArgs) => {
  const cookieString = request.headers.get("Cookie") || "";
  if (cookieString === "") return redirect("/github/login");

  const oauthToken = await retrieveGithubToken(cookieString);
  if (oauthToken === null) return redirect("/github/login");

  const issues = await getIssues(oauthToken, PAGINATION, null);

  return json(issues);
};

export default function Task() {
  const issues = useLoaderData<typeof loader>();

  const issuesListView =
    issues &&
    issues?.edges?.map(
      (issue, index) =>
        issue?.node && (
          <ListItem key={`issus-${index}`}>
            <Card>
              <CardBody>{issue.node.title}</CardBody>
            </Card>
          </ListItem>
        )
    );

  return (
    <Container>
      <List spacing="1rem">{issuesListView}</List>
    </Container>
  );
}
