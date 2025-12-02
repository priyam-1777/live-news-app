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
            if (exists) {
                favs = favs.filter(item => item.title !== title);
            } else {
                favs.push({ title, url, img });
            }

            localStorage.setItem("favourites", JSON.stringify(favs));
            updateFavouriteButtons();
        });
    });

    // Load favourites page
    if (window.location.pathname.includes("favourites")) {
        const container = document.getElementById("fav-container");
        const favs = JSON.parse(localStorage.getItem("favourites")) || [];
        favs.forEach(news => {
            container.innerHTML += `
            <div class="news-card fade-in">
                <img src="${news.img || 'https://via.placeholder.com/400x200?text=No+Image'}" />
                <h3>${news.title}</h3>
                <a href="${news.url}" target="_blank" class="read-btn">Read More</a>
            </div>`;
        });
    }
});



