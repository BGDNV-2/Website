async function loadInstagramFeed() {
    const feed = document.getElementById("instagram-feed");

    try {
        const response = await fetch("/api/instagram");
        const result = await response.json();

        result.data.forEach(post => {
            const link = document.createElement("a");
            link.href = post.permalink;
            link.target = "_blank";

            const image = document.createElement("img");
            image.src = post.thumbnail_url || post.media_url;
            image.alt = post.caption || "BGDNV Instagram post";

            link.appendChild(image);
            feed.appendChild(link);
        });

    } catch (error) {
        console.error("Instagram feed could not be loaded:", error);
    }
}

loadInstagramFeed();