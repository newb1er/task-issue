import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, List, ListItem, Card, CardBody } from "@chakra-ui/react";

import { getTasks } from "~/utils/task";
import { retrieveGithubToken } from "~/utils/oauth";

const PAGINATION = 10;

export const loader = async ({ request }: LoaderArgs) => {
  const cookieString = request.headers.get("Cookie") || "";
  if (cookieString === "") return redirect("/github/login");

  const oauthToken = await retrieveGithubToken(cookieString);
  if (oauthToken === null) return redirect("/github/login");

  const tasks = await getTasks(oauthToken, PAGINATION, null);

  return json(tasks);
};

export default function Task() {
  const tasks = useLoaderData<typeof loader>();

  const taskListView =
    tasks &&
    tasks.list?.map((task, index) => (
      <ListItem key={`task-${index}`}>
        <Card>
          <CardBody>{task?.title}</CardBody>
        </Card>
      </ListItem>
    ));

  return (
    <Container>
      <List spacing="1rem">{taskListView}</List>
    </Container>
  );
}
