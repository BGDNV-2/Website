const titles = document.querySelectorAll("h1");

const finalTexts = {
    bgdnv: "BGDNV",
    contact: "CONTACT"
};

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@";
const scrambleDuration = 2000;
const holdDuration = 5000;
const frameTime = 50;

function scrambleText(title, finalText) {
    const startTime = Date.now();

    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scrambleDuration, 1);

        let output = "";

        for (let i = 0; i < finalText.length; i++) {
            if (i < Math.floor(progress * finalText.length)) {
                output += finalText[i];
            } else {
                output += characters[
                    Math.floor(Math.random() * characters.length)
                ];
            }
        }

        title.textContent = output;

        if (progress >= 1) {
            clearInterval(interval);
            title.textContent = finalText;

            setTimeout(() => {
                scrambleText(title, finalText);
            }, holdDuration);
        }
    }, frameTime);
}

titles.forEach(title => {
    const finalText = finalTexts[title.id];

    if (finalText) {
        scrambleText(title, finalText);
    }
});