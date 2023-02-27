const baseUrl = "https://github.com/login/oauth/authorize";
const clientId = process.env.GITHUB_CLIENT_ID;
const siteUrl = `${process.env.SITE_URL}/github/callback`;
const scope = "repo";

export default function Login() {
  console.log(siteUrl);

  return (
    <>
      <a
        href={`${baseUrl}?client_id=${clientId}&redirect_uri=${siteUrl}&scope=${scope}`}
      >
        <button>Login</button>
      </a>
    </>
  );
}
