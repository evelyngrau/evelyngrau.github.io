(() => {
  "use strict";

  const projectGalleries = {
    xacademy: {
      title: "XAcademy QA Project",
      description: "Test cases, bug reports, Trello workflow and QA evidence.",
      images: [
        {
          src: "assets/projects/xacademy-main.png",
          caption: "XAcademy QA Project dashboard"
        },
        {
          src: "assets/projects/xacademy-testcases.png",
          caption: "Test cases"
        },
        {
          src: "assets/projects/xacademy-trello.png",
          caption: "Trello workflow"
        },
        {
          src: "assets/projects/xacademy-bug-report.png",
          caption: "Bug report"
        }
      ]
    },

    cypress: {
      title: "Cypress Automation Practice",
      description: "Cypress test code, execution evidence and automation practice.",
      images: [
        {
          src: "assets/projects/cypress-main.png",
          caption: "Cypress Automation Practice"
        },
        {
          src: "assets/projects/cypress-code.png",
          caption: "Cypress test code"
        },
        {
          src: "assets/projects/cypress-report.png",
          caption: "Cypress execution report"
        }
      ]
    },

    postman: {
      title: "Postman / API Testing",
      description: "API requests, collections, JSON responses and validation evidence.",
      images: [
        {
          src: "assets/projects/postman-main.png",
          caption: "Postman API Testing"
        },
        {
          src: "assets/projects/postman-collection.png",
          caption: "Postman collection"
        },
        {
          src: "assets/projects/postman-response.png",
          caption: "API response"
        }
      ]
    }
  };

  function initializePortfolio() {
    initializeNavbar();
    initializeCertificateCarousel();
    initializeGallery();
    initializeAnalyticsEvents();
  }

  /* ========================================
     NAVBAR
  ======================================== */

  function initializeNavbar() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) {
      return;
    }

    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    function updateNavbar() {
      const currentScrollY = window.scrollY;

      navbar.classList.toggle("nav-scrolled", currentScrollY > 40);

      navbar.classList.toggle(
        "nav-hidden",
        currentScrollY > lastScrollY && currentScrollY > 120
      );

      lastScrollY = currentScrollY;
      scrollTicking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (scrollTicking) {
          return;
        }

        scrollTicking = true;
        window.requestAnimationFrame(updateNavbar);
      },
      { passive: true }
    );
  }

  /* ========================================
CERTIFICATE CAROUSEL
  ======================================== */

function initializeCertificateCarousel() {
  const diplomaTrack = document.getElementById("diplomaTrack");

  if (!diplomaTrack) {
    return;
  }

  const originalSlides = Array.from(
    diplomaTrack.querySelectorAll(".diploma-slide")
  ).filter((slide) => slide.dataset.carouselClone !== "true");

  /* Duplicar certificados para crear un recorrido infinito */
  if (
    originalSlides.length > 0 &&
    diplomaTrack.dataset.carouselInitialized !== "true"
  ) {
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);

      clone.dataset.carouselClone = "true";
      clone.setAttribute("aria-hidden", "true");

      clone.querySelectorAll("img").forEach((image) => {
        image.setAttribute("aria-hidden", "true");
        image.removeAttribute("alt");
      });

      diplomaTrack.appendChild(clone);
    });

    diplomaTrack.dataset.carouselInitialized = "true";
  }

  const speed = 28; // píxeles por segundo

  let previousTime = null;
  let isInteracting = false;
  let resumeTimer = null;

  function animateCertificates(currentTime) {
    if (previousTime === null) {
      previousTime = currentTime;
    }

    const elapsedTime = Math.min(currentTime - previousTime, 50);
    previousTime = currentTime;

    if (!isInteracting) {
      diplomaTrack.scrollLeft +=
        speed * (elapsedTime / 1000);

      const loopPoint = diplomaTrack.scrollWidth / 2;

      if (
        loopPoint > 0 &&
        diplomaTrack.scrollLeft >= loopPoint
      ) {
        diplomaTrack.scrollLeft -= loopPoint;
      }
    }

    window.requestAnimationFrame(animateCertificates);
  }

  function pauseMovement() {
    isInteracting = true;
    window.clearTimeout(resumeTimer);
  }

  function resumeMovement() {
    window.clearTimeout(resumeTimer);

    resumeTimer = window.setTimeout(() => {
      isInteracting = false;
      previousTime = null;
    }, 700);
  }

  diplomaTrack.addEventListener(
    "pointerdown",
    pauseMovement
  );

  window.addEventListener(
    "pointerup",
    resumeMovement
  );

  window.addEventListener(
    "pointercancel",
    resumeMovement
  );

  diplomaTrack.addEventListener(
    "touchstart",
    pauseMovement,
    { passive: true }
  );

  diplomaTrack.addEventListener(
    "touchend",
    resumeMovement,
    { passive: true }
  );

  window.requestAnimationFrame(animateCertificates);
}

  /* ========================================
PROJECT AND COMIC GALLERY
  ======================================== */

  function initializeGallery() {
    const modal = document.getElementById("galleryModal");
    const overlay = document.getElementById("galleryOverlay");
    const closeButton = document.getElementById("galleryClose");
    const previousButton = document.getElementById("galleryPrev");
    const nextButton = document.getElementById("galleryNext");
    const image = document.getElementById("galleryImage");
    const title = document.getElementById("galleryTitle");
    const description = document.getElementById("galleryDescription");
    const counter = document.getElementById("galleryCounter");

    if (
      !modal ||
      !overlay ||
      !closeButton ||
      !previousButton ||
      !nextButton ||
      !image ||
      !title ||
      !description ||
      !counter
    ) {
      console.error(
        "Gallery could not start because the modal markup is incomplete."
      );
      return;
    }

    let currentGallery = [];
    let currentIndex = 0;
    let currentTitle = "";
    let currentDescription = "";
    let opener = null;
    let touchStartX = 0;
    let touchStartY = 0;

    function normalizeGalleryItems(items) {
      if (!Array.isArray(items)) {
        return [];
      }

      return items
        .map((item) => {
          if (typeof item === "string") {
            return { src: item, caption: "" };
          }

          return {
            src: item?.src || "",
            caption: item?.caption || ""
          };
        })
        .filter((item) => item.src);
    }

    function renderImage() {
      const item = currentGallery[currentIndex];

      if (!item) {
        return;
      }

      image.src = item.src;
      image.alt = item.caption || currentTitle || "Gallery image";
      title.textContent = currentTitle || "Gallery";
      description.textContent = item.caption || currentDescription || "";
      counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

      const hasMultipleImages = currentGallery.length > 1;
      previousButton.hidden = !hasMultipleImages;
      nextButton.hidden = !hasMultipleImages;
    }

    function openGallery(
      items,
      galleryTitle,
      galleryDescription,
      startIndex = 0,
      trigger = null
    ) {
      const normalizedItems = normalizeGalleryItems(items);

      if (normalizedItems.length === 0) {
        console.error("The selected gallery does not contain valid images.");
        return;
      }

      currentGallery = normalizedItems;
      currentTitle = galleryTitle || "Gallery";
      currentDescription = galleryDescription || "";
      currentIndex = Math.min(
        Math.max(Number(startIndex) || 0, 0),
        currentGallery.length - 1
      );
      opener = trigger || document.activeElement;

      renderImage();

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("gallery-open");
      closeButton.focus();
    }

    function closeGallery() {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("gallery-open");

      image.removeAttribute("src");
      image.alt = "";
      currentGallery = [];
      currentIndex = 0;

      if (opener && typeof opener.focus === "function") {
        opener.focus();
      }

      opener = null;
    }

    function showPreviousImage() {
      if (currentGallery.length < 2) {
        return;
      }

      currentIndex =
        (currentIndex - 1 + currentGallery.length) % currentGallery.length;

      renderImage();
    }

    function showNextImage() {
      if (currentGallery.length < 2) {
        return;
      }

      currentIndex = (currentIndex + 1) % currentGallery.length;
      renderImage();
    }

    function getComicGallery(galleryElement) {
      const buttons = Array.from(
        galleryElement.querySelectorAll(".gallery-thumb")
      );

      return buttons
        .map((button) => {
          const previewImage = button.querySelector("img");

          return {
            src:
              button.dataset.full ||
              previewImage?.getAttribute("src") ||
              "",
            caption:
              button.dataset.caption ||
              previewImage?.alt ||
              ""
          };
        })
        .filter((item) => item.src);
    }

    function getProjectStartIndex(trigger, clickedElement, gallery) {
      const clickedImage = clickedElement?.closest?.("img");

      if (!clickedImage) {
        return 0;
      }

      const clickedSource = clickedImage.getAttribute("src");
      const matchedIndex = gallery.images.findIndex(
        (item) => item.src === clickedSource
      );

      return matchedIndex >= 0 ? matchedIndex : 0;
    }

    function openNamedProjectGallery(trigger, clickedElement = null) {
      const galleryName = trigger.dataset.gallery;
      const gallery = projectGalleries[galleryName];

      if (!gallery) {
        console.error(`Project gallery not found: ${galleryName}`);
        return;
      }

      openGallery(
        gallery.images,
        gallery.title,
        gallery.description,
        getProjectStartIndex(trigger, clickedElement, gallery),
        trigger
      );
    }

    document.addEventListener("click", (event) => {
      const projectTrigger = event.target.closest(".gallery-trigger");

      if (projectTrigger) {
        event.preventDefault();
        openNamedProjectGallery(projectTrigger, event.target);
        return;
      }

      const externalGalleryButton = event.target.closest(
        "[data-gallery-open]"
      );

      if (externalGalleryButton) {
        event.preventDefault();

        const galleryId = externalGalleryButton.dataset.galleryOpen;
        const galleryElement = document.getElementById(galleryId);

        if (!galleryElement) {
          console.error(`Comic gallery not found: ${galleryId}`);
          return;
        }

        openGallery(
          getComicGallery(galleryElement),
          "Rocky y Bengala",
          "Comic preview",
          0,
          externalGalleryButton
        );
        return;
      }

      const comicItem = event.target.closest(
        ".project-gallery .gallery-thumb"
      );

      if (comicItem) {
        event.preventDefault();

        const galleryElement = comicItem.closest(".project-gallery");
        const allItems = Array.from(
          galleryElement.querySelectorAll(".gallery-thumb")
        );
        const selectedIndex = Math.max(0, allItems.indexOf(comicItem));

        openGallery(
          getComicGallery(galleryElement),
          "Rocky y Bengala",
          "Comic preview",
          selectedIndex,
          comicItem
        );
      }
    });

    document.addEventListener("keydown", (event) => {
      const projectTrigger = event.target.closest?.(".gallery-trigger");

      if (
        projectTrigger &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        openNamedProjectGallery(projectTrigger, event.target);
        return;
      }

      if (!modal.classList.contains("active")) {
        return;
      }

      if (event.key === "Escape") {
        closeGallery();
      } else if (event.key === "ArrowLeft") {
        showPreviousImage();
      } else if (event.key === "ArrowRight") {
        showNextImage();
      }
    });

    closeButton.addEventListener("click", closeGallery);
    overlay.addEventListener("click", closeGallery);
    previousButton.addEventListener("click", showPreviousImage);
    nextButton.addEventListener("click", showNextImage);

    modal.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true }
    );

    modal.addEventListener(
      "touchend",
      (event) => {
        if (currentGallery.length < 2) {
          return;
        }

        const touch = event.changedTouches[0];
        const horizontalMovement = touchStartX - touch.clientX;
        const verticalMovement = touchStartY - touch.clientY;

        if (
          Math.abs(horizontalMovement) < 50 ||
          Math.abs(horizontalMovement) <= Math.abs(verticalMovement)
        ) {
          return;
        }

        if (horizontalMovement > 0) {
          showNextImage();
        } else {
          showPreviousImage();
        }
      },
      { passive: true }
    );
  }

  /* ========================================
     GOOGLE ANALYTICS EVENTS
  ======================================== */

  function initializeAnalyticsEvents() {
    document.addEventListener("click", (event) => {
      const trackedElement = event.target.closest("[data-event]");

      if (!trackedElement || typeof window.gtag !== "function") {
        return;
      }

      window.gtag("event", trackedElement.dataset.event, {
        link_text: trackedElement.textContent.trim(),
        link_url: trackedElement.href || ""
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePortfolio);
  } else {
    initializePortfolio();
  }
})();
