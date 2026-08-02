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
