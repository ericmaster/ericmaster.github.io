export default {
  async fetch(
    request: Request,
    env: unknown,
    // ctx: ExecutionContext
  ): Promise<Response> {
    const { GH_CLIENT_ID: client_id, GH_CLIENT_SECRET: client_secret } = env as { GH_CLIENT_ID: string; GH_CLIENT_SECRET: string; };
    const url = new URL(request.url);
    if (!url.pathname.includes("/api/auth")) {
      return new Response(null, { status: 404 });
    }

    const code = url.searchParams.get("code");

    if (!code) {
      const params = new URLSearchParams({
        client_id: client_id,
        redirect_uri: "https://ericmaster.github.io/api/auth",
        scope: "read:user user:email repo",
      });
      const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
      return Response.redirect(githubAuthUrl);
    }

    // Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          code,
          redirect_uri: "https://ericmaster.github.io/api/auth",
        }),
      }
    );
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      return new Response("OAuth failed", { status: 401 });
    }

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
} satisfies ExportedHandler;
