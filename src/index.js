export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/instagram") {

            const accessToken = await env.INSTAGRAM_KV.get("access_token");

            if (!accessToken) {
                return Response.json(
                    { error: "Instagram token missing in KV" },
                    { status: 503 }
                );
            }

            const apiUrl =
                "https://graph.instagram.com/me/media" +
                "?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp" +
                "&limit=8" +
                `&access_token=${encodeURIComponent(accessToken)}`;

            const response = await fetch(apiUrl);
            let data;

            try {
                data = await response.json();
            } catch {
                return Response.json(
                    { error: "Failed to parse Instagram API response" },
                    { status: 502 }
                );
            }

            if (!response.ok || data.error) {
                console.error("Instagram API error:",
                    response.status,
                    data.error?.code
                );
                return Response.json(
                    { error: "Failed to fetch Instagram data" },
                    { status: 502 }
                );
            }

            if (!Array.isArray(data.data)) {
                return Response.json(
                    { error: "Invalid Instagram feed data" },
                    { status: 502 }
                );
            }

            return Response.json(data);

        }

        
        return env.ASSETS.fetch(request);
    },

    async scheduled(event, env) {
        const kv = env.INSTAGRAM_KV;
        const now = Date.now();

        const lastRefresh = await kv.get("last_refresh");
        const refreshInterval = 30 * 24 * 60 * 60 * 1000;

        // Nur nach mindestens 30 Tagen erneuern
        if (
            lastRefresh &&
            now - Number(lastRefresh) < refreshInterval
        ) {
            console.log("Instagram token refresh not needed");
            return;
        }

        const accessToken = await kv.get("access_token");

        if (!accessToken) {
            throw new Error("Instagram token missing in KV");
        }

        const refreshUrl = new URL(
            "https://graph.instagram.com/refresh_access_token"
        );

        refreshUrl.searchParams.set(
            "grant_type",
            "ig_refresh_token"
        );

        refreshUrl.searchParams.set(
            "access_token",
            accessToken
        );

        const response = await fetch(refreshUrl.toString());

        if (!response.ok) {
            console.error(
                "Instagram token refresh failed:",
                response.status
            );
            throw new Error("Instagram token refresh failed");
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error("No refreshed Instagram token returned");
        }

        // Neuen Token dauerhaft speichern
        await kv.put("access_token", data.access_token);
        await kv.put("last_refresh", String(Date.now()));

        console.log("Instagram token refreshed successfully");
    }
};
