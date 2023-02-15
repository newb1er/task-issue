const baseUrl = "https://github.com/login/oauth/authorize";
const clientId = process.env.GITHUB_CLIENT_ID;

export default function Login() {
    return (
        <>
            <a href={`${baseUrl}?client_id=${clientId}`}>
                <button>Login</button>
            </a>
        </>
    );
} 