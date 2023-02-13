import { redirect } from "@remix-run/node";

const baseUrl = "https://github.com/login/oauth/authorize";
const clientId = process.env.GITHUB_CLIENT_ID;

const login = () => { 
  redirect(`${baseUrl}?client_id=${clientId}`);
}

export default function Index() {
  return (
    <>
      <a href={`${baseUrl}?client_id=${clientId}`}>
        <button onClick={login}>Login</button>
      </a>
    </>
  );
}
