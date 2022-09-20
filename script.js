"use strict";

///////////////////////////////////////
// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// 1. Smooth scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();

  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: "smooth",
  });

  // section1.scrollIntoView({
  //   behavior: "smooth",
  // });
});

// 2. Page navigation
// document.querySelectorAll(".nav__link").forEach(function (link) {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();

//     const id = this.getAttribute("href");

//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// Event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// 3. Tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContents = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  tabContents.forEach(tabContent =>
    tabContent.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// 4. Passing arguments to Event Handler - Fade animation on navigation
const nav = document.querySelector(".nav");

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// mouseenter event does NOT bubble
// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener("mouseout", function (e) {
//   handleHover(e, 1);
// });

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// 5. Sticky navigation
///////////////// Bad performance especially on mobile devices ///////////////
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", () => {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

///////////////// Intersection Observer API /////////////////
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// 6. Reveal sections
const sections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

// 6. Lazy loading images
const imgs = document.querySelectorAll("img[data-src]");
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgs.forEach(img => imgObserver.observe(img));

// 7. Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let currentSlide = 0;
  const numOfSlides = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      // 0%, 100%, 200%, 300%
      // -100%, 0, 100%, 200%
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next
  const nextSlide = function () {
    if (currentSlide === numOfSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Prev
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = numOfSlides - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);

    createDots();
    activateDot(0);
  };

  init();

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
    // e.key === "ArrowLeft" && prevSlide();
    // e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", e => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;

      goToSlide(slide);

      activateDot(slide);
    }
  });
};
slider();

// document.addEventListener("click", () => {
//   // current scroll
//   console.log(window.pageXOffset, window.pageYOffset);

//   // current viewport width. height
//   console.log(
//     document.documentElement.clientWidth,
//     document.documentElement.clientHeight
//   );
// });
///////////////////////////////////////////////////////////////////////////
// LECTURE

// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// document.querySelector(".header");
// document.querySelectorAll(".section"); // NodeList

// document.getElementById("section--1");
// document.getElementsByTagName("button"); // HTMLCollection
// document.getElementsByClassName("btn"); // HTMLCollection

// // Creating & inserting elements

// //.insertAdjacentHTML
// const header = document.querySelector(".header");
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// // message.textContent = "We use cookie for improved functionality and analytics.";
// message.innerHTML =
//   "We use cookie for improved functionality and analytics.<button class='btn btn--close-cookie'>Got it!</button>";
// header.prepend(message);
// header.append(message);
// // prepend and append not only insert elements but also move elements => b/c a DOM element is unique

// // header.append(message.cloneNode(true));

// // Insert message before / after the header element
// // header.before(message);
// // header.after(message);

// // Deleting elements
// document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", function () {
//     message.remove();
//     // message.parentElement.removeChild(message);
//   });

// // Styles
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";

// // Get inline styles that are set by style property
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

// document.documentElement.style.setProperty("--color-primary", "orangered");

// // Attributes
// // Getter
// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt);
// console.log(logo.src); // absolute url: http://127.0.0.1:5500/img/logo.png
// console.log(logo.className);

// // Setter
// logo.alt = "Beautiful minimalist logo";

// // Non-standard
// console.log(logo.test);
// console.log(logo.getAttribute("test"));
// console.log(logo.getAttribute("src")); // relative url: img/logo.png

// logo.setAttribute("company", "Bankist");

// // Data attributes (data-)
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add("c");
// logo.classList.remove("c");
// logo.classList.toggle("c");
// logo.classList.contains("c");

// DO NOT use this => overrides all the existing classes and only adds 1 class
// logo.className = "my-class";

// const h1 = document.querySelector("h1");
// h1.addEventListener("mouseenter", function () {
//   alert("One");
// });

// h1.addEventListener("mouseenter", function () {
//   alert("Two");
// });

// h1.onmouseenter = function () {
//   alert("Three");
// };

// h1.onmouseenter = function () {
//   alert("Four");
// };

// DOM traversing
// const h1 = document.querySelector("h1");

// // Going downwards
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children); // direct children elements
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);

// // Going upwards
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(".header");

// // Going sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// const arr = [...h1.parentElement.children].forEach(ele => {
//   if (ele !== h1) ele.style.transform = "scale(2)";
// });

// window.addEventListener("beforeunload", e => {
//   e.preventDefault();
//   e.returnValue = "";
// });
