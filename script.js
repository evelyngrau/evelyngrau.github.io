const diplomaTrack = document.getElementById("diplomaTrack");
const prevButton = document.querySelector(".carousel-btn.prev");
const nextButton = document.querySelector(".carousel-btn.next");

function getScrollAmount() {
  const slide = diplomaTrack.querySelector(".diploma-slide");
  const gap = 26;

  if (!slide) return 420;

  return slide.offsetWidth + gap;
}

function scrollNext() {
  const maxScrollLeft = diplomaTrack.scrollWidth - diplomaTrack.clientWidth;

  if (diplomaTrack.scrollLeft >= maxScrollLeft - 20) {
    diplomaTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });
  } else {
    diplomaTrack.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth"
    });
  }
}

function scrollPrev() {
  if (diplomaTrack.scrollLeft <= 20) {
    diplomaTrack.scrollTo({
      left: diplomaTrack.scrollWidth,
      behavior: "smooth"
    });
  } else {
    diplomaTrack.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth"
    });
  }
}

nextButton.addEventListener("click", scrollNext);
prevButton.addEventListener("click", scrollPrev);

/* Auto-scroll every 2 seconds */
let autoScroll = setInterval(scrollNext, 2000);

/* Pause on hover */
diplomaTrack.addEventListener("mouseenter", () => {
  clearInterval(autoScroll);
});

diplomaTrack.addEventListener("mouseleave", () => {
  autoScroll = setInterval(scrollNext, 2000);
});

/* Pause when user touches/scrolls on mobile */
diplomaTrack.addEventListener("touchstart", () => {
  clearInterval(autoScroll);
});

diplomaTrack.addEventListener("touchend", () => {
  autoScroll = setInterval(scrollNext, 2500);
});

/* Hide navbar on scroll down, show on scroll up */

const navbar = document.querySelector(".navbar");

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (!navbar) return;

  if (currentScrollY > 40) {
    navbar.classList.add("nav-scrolled");
  } else {
    navbar.classList.remove("nav-scrolled");
  }

  if (currentScrollY > lastScrollY && currentScrollY > 120) {
    navbar.classList.add("nav-hidden");
  } else {
    navbar.classList.remove("nav-hidden");
  }

  lastScrollY = currentScrollY;
});

/* PROJECT SCREENSHOT GALLERY */

document.addEventListener("DOMContentLoaded", () => {
  const projectGalleries = {
    xacademy: {
      title: "XAcademy QA Project",
      description: "Test cases, bug reports, Trello workflow and QA evidence.",
      images: [
        "assets/projects/xacademy-main.png",
        "assets/projects/xacademy-testcases.png",
        "assets/projects/xacademy-trello.png",
        "assets/projects/xacademy-bug-report.png"
      ]
    },

    cypress: {
      title: "Cypress Automation Practice",
      description: "Cypress runner, test code, execution evidence and automation practice.",
      images: [
        "assets/projects/cypress-main.png",
        "assets/projects/cypress-code.png",
        "assets/projects/cypress-report.png"
      ]
    },

    postman: {
      title: "Postman / API Testing",
      description: "API requests, JSON responses, assertions and validation evidence.",
      images: [
        "assets/projects/postman-main.png",
        "assets/projects/postman-collection.png",
        "assets/projects/postman-response.png"
      ]
    }
  };

  const galleryModal = document.getElementById("galleryModal");
  const galleryOverlay = document.getElementById("galleryOverlay");
  const galleryClose = document.getElementById("galleryClose");
  const galleryImage = document.getElementById("galleryImage");
  const galleryTitle = document.getElementById("galleryTitle");
  const galleryDescription = document.getElementById("galleryDescription");
  const galleryCounter = document.getElementById("galleryCounter");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  const galleryTriggers = document.querySelectorAll(".gallery-trigger");

  let currentGallery = null;
  let currentImageIndex = 0;

  function openGallery(galleryName) {
    currentGallery = projectGalleries[galleryName];
    currentImageIndex = 0;

    if (!currentGallery) return;

    galleryTitle.textContent = currentGallery.title;
    galleryDescription.textContent = currentGallery.description;

    updateGalleryImage();

    galleryModal.classList.add("active");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    galleryModal.classList.remove("active");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateGalleryImage() {
    if (!currentGallery) return;

    galleryImage.src = currentGallery.images[currentImageIndex];
    galleryImage.alt = `${currentGallery.title} screenshot ${currentImageIndex + 1}`;
    galleryCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.images.length}`;
  }

  function showNextImage() {
    if (!currentGallery) return;

    currentImageIndex++;

    if (currentImageIndex >= currentGallery.images.length) {
      currentImageIndex = 0;
    }

    updateGalleryImage();
  }

  function showPrevImage() {
    if (!currentGallery) return;

    currentImageIndex--;

    if (currentImageIndex < 0) {
      currentImageIndex = currentGallery.images.length - 1;
    }

    updateGalleryImage();
  }

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openGallery(trigger.dataset.gallery);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGallery(trigger.dataset.gallery);
      }
    });
  });

  galleryNext.addEventListener("click", showNextImage);
  galleryPrev.addEventListener("click", showPrevImage);
  galleryClose.addEventListener("click", closeGallery);
  galleryOverlay.addEventListener("click", closeGallery);

  document.addEventListener("keydown", (event) => {
    if (!galleryModal.classList.contains("active")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") showNextImage();
    if (event.key === "ArrowLeft") showPrevImage();
  });
});