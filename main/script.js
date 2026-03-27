const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

const auth = document.getElementById("auth");
const profile = document.getElementById("profile");
const logoutLink = document.getElementById("logout");

// Check if user is logged in
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  // let user = false;

  if (user) {
    profile.style.display = "flex";
    auth.style.display = "none";
  } else {
    auth.style.display = "flex";
    profile.style.display = "none";
  }
}

checkAuthStatus();
logoutLink.addEventListener("click", (e) => {
  localStorage.removeItem("user");
  checkAuthStatus();
  alert("You have been logged out successfully.");
});
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// 👉 ScrollReveal Options (IMPORTANT)
// 👉 ScrollReveal Options
const scrollRevealOption = {
  distance: "60px",
  duration: 1000,
  reset: false,
  opacity: 0,
};

// Header Title
ScrollReveal().reveal(".header__container h2", {
  ...scrollRevealOption,
  origin: "bottom",
  delay: 1000,
});

// ALL Cards animation

ScrollReveal().reveal(".feature-card", {
  ...scrollRevealOption,
  origin: "bottom",
  interval: 100,
  delay: 100,
});

// Header Buttons
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 1500,
  origin: "bottom",
});

ScrollReveal().reveal(".steps__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".explore__card", {
  duration: 1000,
  interval: 500,
});

ScrollReveal().reveal(".job__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".offer__card", {
  ...scrollRevealOption,
  interval: 500,
});
const swiper = new Swiper(".swiper", {
  loop: true,
});
// Card UI create

async function loadTest() {
  const slider = document.getElementById("slider");

  try {
    const response = await fetch("./test/test.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const tests = data.tests;

    // Render Slider Cards
    tests.forEach((test) => {
      slider.innerHTML += `
        <div class="swiper-slide card" data-test-id="${test.id}">
          <img src="${test.image}" alt="${test.title}">
          <h3 class="card-title">${test.title}</h3>
          <p class="card-desc">${test.description}</p>
        </div>
      `;
    });

    // Card Click → Popup open
    slider.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;

      const id = card.getAttribute("data-test-id");
      const item = tests.find((t) => t.id == id);

      // Fill popup
      document.getElementById("popupImage").src = item.image;
      document.getElementById("popupTitle").innerText = item.title;
      document.getElementById("popupDesc").innerText = item.description;
      document.getElementById("popupDuration").innerText = item.duration;
      document.getElementById("popupSkills").innerText = item.skills.join(", ");
      document.getElementById("popupQuestions").innerText = item.questions;

      // SAVE SELECTED TEST IN LOCAL STORAGE
      document.getElementById("popupStartBtn").onclick = () => {
        localStorage.setItem("currentTest", JSON.stringify(item));
        window.location.href = "./test/test.html"; // Test page open
      };

      document.getElementById("popupModal").classList.remove("hidden");
    });

    // Close popup
    document.getElementById("closePopup").addEventListener("click", () => {
      document.getElementById("popupModal").classList.add("hidden");
    });
  } catch (error) {
    console.error("Error loading tests:", error);
  }
}

loadTest();

// Swiper Init
new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 20,
  loop: true,
  grabCursor: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    600: { slidesPerView: 1 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});
