function updateFavouriteButtons() {
    const favs = JSON.parse(localStorage.getItem("favourites")) || [];
    document.querySelectorAll(".fav-btn").forEach(btn => {
        const title = btn.dataset.title;
        if (favs.find(item => item.title === title)) {
            btn.textContent = "❤️";
            btn.classList.add("active");
        } else {
            btn.textContent = "🤍";
            btn.classList.remove("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateFavouriteButtons();

    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            let favs = JSON.parse(localStorage.getItem("favourites")) || [];
            const title = btn.dataset.title;
            const url = btn.dataset.url;
            const img = btn.dataset.img;

            const exists = favs.find(item => item.title === title);
            favs = exists ? favs.filter(item => item.title !== title) : [...favs, { title, url, img }];

            localStorage.setItem("favourites", JSON.stringify(favs));
            updateFavouriteButtons();
        });
    });

    // THEME FIX
    const themeBtn = document.getElementById("theme-toggle");
    themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("light");
        localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    });

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }
});


    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
    }
});
