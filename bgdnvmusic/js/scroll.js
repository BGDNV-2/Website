document.addEventListener("DOMContentLoaded", () => {

    const title = document.querySelector('section[id="1"] h1');

    if (!title) return;

    const finalText = "BGDNV";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@!?";

    const scrambleDuration = 3000;
    const holdDuration = 5000;
    const speed = 50;

    function startScramble() {

        const startTime = Date.now();

        const interval = setInterval(() => {

            let randomText = "";

            for (let i = 0; i < finalText.length; i++) {
                randomText += chars[
                    Math.floor(Math.random() * chars.length)
                ];
            }

            title.textContent = randomText;

            if (Date.now() - startTime >= scrambleDuration) {

                clearInterval(interval);

                title.textContent = finalText;

                setTimeout(startScramble, holdDuration);
            }

        }, speed);
    }

    startScramble();
});