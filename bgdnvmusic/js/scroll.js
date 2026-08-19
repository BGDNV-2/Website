document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    function updateHeader() {
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader);

    updateHeader();
});