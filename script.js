// ===== GANTI TEMA: DARK (DEFAULT) <-> LIGHT =====
// Default selamanya "dark" kalau belum pernah dipilih. Pilihan disimpan di localStorage
// supaya tetap tersimpan pas ganti halaman / refresh.
const THEME_KEY = "tema-nabil";

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function syncThemeButton() {
  const isLight = getCurrentTheme() === "light";
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");
  if (icon) icon.textContent = isLight ? "☀️" : "🌙";
  if (text) text.textContent = isLight ? "Mode Light" : "Mode Dark";
}

function setTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {
    // localStorage tidak tersedia (mode privat/dll) -> tema tetap berubah untuk sesi ini saja
  }
  syncThemeButton();
}

// Sinkronkan tampilan tombol dengan tema yang sudah dipasang <head> sebelum load
syncThemeButton();

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    setTheme(getCurrentTheme() === "light" ? "dark" : "light");
  });
}

// ===== MENU MOBILE (hamburger) =====
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("show");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Tutup menu otomatis setelah link diklik (HP)
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ===== FALLBACK FOTO PROFIL =====
// Kalau foto gagal dimuat, tampilkan huruf "N" sebagai placeholder
const profileImg = document.getElementById("profileImg") || document.querySelector(".profile-img");
if (profileImg) {
  profileImg.addEventListener("error", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#17181c";
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = "#c0c0c8";
    ctx.font = "bold 120px Segoe UI, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", 150, 160);
    profileImg.src = canvas.toDataURL("image/png");
  });
}

// ===== KLIK FOTO PROFIL: MEMPERBESAR =====
// Klik foto -> muncul modal dengan foto besar. Klik di luar foto / tombol / Esc untuk menutup.
const profileImgWrap = document.getElementById("profileImgWrap");
const photoModal = document.getElementById("photoModal");
const photoModalClose = document.getElementById("photoModalClose");

function openPhotoModal() {
  if (!photoModal) return;
  photoModal.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closePhotoModal() {
  if (!photoModal) return;
  photoModal.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

if (profileImgWrap) {
  profileImgWrap.addEventListener("click", openPhotoModal);
}

if (photoModal) {
  // Klik di luar foto untuk menutup
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) closePhotoModal();
  });
}

if (photoModalClose) {
  photoModalClose.addEventListener("click", closePhotoModal);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePhotoModal();
});

// ===== ANIMASI SCROLL SEDERHANA =====
// Fade-in untuk kartu saat masuk layar
const cards = document.querySelectorAll(".card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.15 }
);

cards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(card);
});
