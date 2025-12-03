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
    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light");
            localStorage.setItem(
                "theme",
                document.body.classList.contains("light") ? "light" : "dark"
            );
        });
    }

    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }

    // Update fav buttons
    updateFavouriteButtons();

    // Handle favourite button clicks on home page
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            let favs = JSON.parse(localStorage.getItem("favourites")) || [];
            const title = btn.dataset.title;
            const url = btn.dataset.url;
            const img = btn.dataset.img;

            const exists = favs.find(item => item.title === title);
            if (exists) {
                favs = favs.filter(item => item.title !== title);
            } else {
                favs.push({ title, url, img });
            }

            localStorage.setItem("favourites", JSON.stringify(favs));
            updateFavouriteButtons();
        });
    });

    // Handle favourites page
    const favContainer = document.getElementById("fav-container");
    if (favContainer) {
        const favs = JSON.parse(localStorage.getItem("favourites")) || [];
        const noMsg = document.getElementById("no-fav-msg");
        if (favs.length === 0) {
            noMsg.style.display = "block";
        } else {
            favs.forEach(news => {
                favContainer.innerHTML += `
                <div class="news-card fade-in">
                    <img src="${news.img || 'https://via.placeholder.com/400x200?text=No+Image'}" />
                    <h3>${news.title}</h3>
                    <a href="${news.url}" target="_blank" class="read-btn">Read More</a>
                </div>`;
            });
        }
    }

    // Suggestion tags click
    document.querySelectorAll(".tag").forEach(tag => {
        tag.addEventListener("click", () => {
            const query = tag.dataset.query;
            window.location.href = `/search?query=${encodeURIComponent(query)}`;
        });
    });
});

