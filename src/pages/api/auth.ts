// Astro API endpoint for GitHub OAuth callback
export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const client_id = import.meta.env.GH_CLIENT_ID;
  const client_secret = import.meta.env.GH_CLIENT_SECRET;

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return new Response("OAuth failed", { status: 401 });
  }

  // Optionally, fetch user info
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/json",
      "User-Agent": "Astro-Blog-OAuth",
    },
  });

  // Return HTML for OAuth popup communication
  const content = { token: tokenData.access_token, provider: "github" };
  const html = `<!DOCTYPE html>
<html>
  <body>
    <script>
      const content = ${JSON.stringify(content)};
      if (window.opener) {
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(content),
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        };
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
        // window.close();
      } else {
        // fallback: show token for manual copy
        document.write('Authentication successful. You may close this window.');
      }
    </script>
  </body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
