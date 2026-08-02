const diplomaTrack = document.getElementById("diplomaTrack");
const prevButton = document.querySelector(".carousel-btn.prev");
const nextButton = document.querySelector(".carousel-btn.next");

function getScrollAmount() {
  const slide = diplomaTrack.querySelector(".diploma-slide");
  const gap = 26;

  if (!slide) return 400;

  return slide.offsetWidth + gap;
}

nextButton.addEventListener("click", () => {
  diplomaTrack.scrollBy({
    left: getScrollAmount(),
    behavior: "smooth"
  });
});

prevButton.addEventListener("click", () => {
  diplomaTrack.scrollBy({
    left: -getScrollAmount(),
    behavior: "smooth"
  });
});

/* Auto-scroll */
let autoScroll = setInterval(() => {
  const maxScrollLeft = diplomaTrack.scrollWidth - diplomaTrack.clientWidth;

  if (diplomaTrack.scrollLeft >= maxScrollLeft - 10) {
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
}, 3500);

/* Pause auto-scroll on interaction */
diplomaTrack.addEventListener("mouseenter", () => {
  clearInterval(autoScroll);
});

diplomaTrack.addEventListener("mouseleave", () => {
  autoScroll = setInterval(() => {
    const maxScrollLeft = diplomaTrack.scrollWidth - diplomaTrack.clientWidth;

    if (diplomaTrack.scrollLeft >= maxScrollLeft - 10) {
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
  }, 3500);
});
