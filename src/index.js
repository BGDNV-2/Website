export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/instagram") {
            const apiUrl =
                "https://graph.instagram.com/me/media" +
                "?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp" +
                "&limit=8" +
                `&access_token=${encodeURIComponent(env.INSTAGRAM_ACCESS_TOKEN)}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            return Response.json(data);
        }

        return env.ASSETS.fetch(request);
    }
};