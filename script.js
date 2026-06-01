const nav = document.getElementById("nav");
const openBtn = document.getElementById("menu-open");
const closeBtn = document.getElementById("menu-close");

openBtn.addEventListener("click", () => {
    nav.classList.add("active");
    document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
    nav.classList.remove("active");
    document.body.style.overflow = "auto";
});


// ===== URL SHORTENER =====

const form = document.getElementById("shortener-form");
const input = document.getElementById("link");
const errorMessage = document.getElementById("error-message");
const resultsContainer = document.getElementById("shortened-links");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = input.value.trim();

    clearError();

    // validation vide
    if (!url) {
        showError("Please add a link");
        return;
    }

    // validation URL
    try {
        new URL(url);
    } catch {
        showError("Please enter a valid link");
        return;
    }

    try {
        // Remplacement par l'API TinyURL (qui accepte le cross-origin)
        const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
            showError("Please enter a valid link");
            return;
        }

        // L'API TinyURL renvoie directement l'URL raccourcie sous forme de texte (pas de JSON)
        const shortLink = await response.text();

        displayResult(url, shortLink);

        input.value = "";
    } catch (error) {
        console.error(error);
        showError("Something went wrong");
    }
});

function showError(message) {
    errorMessage.textContent = message;
    input.classList.add("input-error");
}

function clearError() {
    errorMessage.textContent = "";
    input.classList.remove("input-error");
}

function displayResult(originalUrl, shortenedUrl) {
    const result = document.createElement("div");
    result.classList.add("result-item");

    result.innerHTML = `
        <span>${originalUrl}</span>

        <div class="result-right">
            <a href="${shortenedUrl}" target="_blank">
                ${shortenedUrl}
            </a>

            <button class="copy-btn">Copy</button>
        </div>
    `;

    resultsContainer.prepend(result);

    const copyBtn = result.querySelector(".copy-btn");

    copyBtn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(shortenedUrl);

        copyBtn.textContent = "Copied";
        copyBtn.style.background = "#3b3054";

        setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.style.background = "";
        }, 2000);
    });
}