"use strict";

const btnsOpenModel = document.querySelectorAll(".btn--open-modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const nav = document.querySelector(".nav");

const btn = document.querySelector(".btn--scroll-to");
const section = document.querySelector("#section--1");
const allSections = document.querySelectorAll(".section");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations");

const initialCoords = section.getBoundingClientRect();

const header = document.querySelector(".header");
const navHeight = nav.clientHeight;

const images = section.querySelectorAll("img");

const slider = document.querySelector(".slider");
const sliderHeight = slider.clientHeight;
const slides = document.querySelectorAll(".slide");

const dotsContainer = document.querySelector(".dots"); 
const dots = dotsContainer.childNodes;

const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");



btnsOpenModel.forEach(item => {
  item.addEventListener("click", function(e) {
    e.preventDefault();
      if (modal.classList.contains("hidden")) {
        modal.classList.remove("hidden");            
      }
      if (overlay.classList.contains("hidden")) {
        overlay.classList.remove("hidden");    
      } 
  });
});


[overlay, btnCloseModal].forEach(item => {
  item.addEventListener("click", function(e) {
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");            
    }
    if (!overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");    
    } 
  });
});

document.body.addEventListener("keydown", function(e) {
  if (e['key'] === 'Escape') {
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");            
    }
    if (!overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");    
    } 
  }
});


// Scrolling to Features section
btn.addEventListener("click", function(e) {
  e.preventDefault();
  const coords = section.getBoundingClientRect();

  // Getting main window sizes
  // console.log(document.documentElement.clientHeight, document.documentElement.clientWidth);

  // first approach
  // window.scrollTo({
  //   left: coords.left + window.pageXOffset,    
  //   top: coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // second approach
  section.scrollIntoView({ behavior: "smooth" });   
});


// // Page navigation simple solution
// document.querySelectorAll(".nav__link").forEach(el => {
//   el.addEventListener("click", function(e) {
//     e.preventDefault();
//     document.querySelector(el.getAttribute("href")).scrollIntoView({behavior: "smooth"});
//   });
// });

// Page navigation using event delegation
document.querySelector(".nav__links").addEventListener("click", function(e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }
});


// Tabbed component
tabsContainer.addEventListener("click", function(e) {
  // Deactivating previous active tab
  const tabPrev = tabsContainer.querySelector(".operations__tab--active");
  const contentPrev = tabsContainer.querySelector(`.operations__content--${tabPrev.dataset.tab}`);

  tabPrev.classList.remove("operations__tab--active");
  contentPrev.classList.remove("operations__content--active");

  // Activating clicked tab
  const tabClicked = e.target.closest(".operations__tab");
  const contentClicked = tabsContainer.querySelector(`.operations__content--${tabClicked.dataset.tab}`);

  if (!tabClicked) return;
  tabClicked.classList.add("operations__tab--active");
  contentClicked.classList.add("operations__content--active");
});


// Menu fade animation

// // First approach
// const handleHover = function(e, opacity) {
//   if (e.target.classList.contains("nav__link")) {
//     const linkChosen = e.target;

//     const siblings = linkChosen.closest(".nav").querySelectorAll(".nav__link");
//     const logo = linkChosen.closest(".nav").querySelector("img");

//     siblings.forEach(item => item != linkChosen ? item.style.opacity = opacity : item.style.opacity = 1);
//     logo.style.opacity = opacity;
//   }
// };

// nav.addEventListener("mouseover", function(e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener("mouseout", function(e) {
//   handleHover(e, 1);
// });

// Second approach
const handleHover = function(e) {
  if (e.target.classList.contains("nav__link")) {
    const linkChosen = e.target;

    const siblings = linkChosen.closest(".nav").querySelectorAll(".nav__link");
    const logo = linkChosen.closest(".nav").querySelector("img");

    siblings.forEach(item => item != linkChosen ? item.style.opacity = this : item.style.opacity = 1);
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));


// Sticky navigation

// First approach
// window.addEventListener("scroll", function(e) {
//   if (initialCoords.top - window.scrollY <= nav.clientHeight) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// Second approach
// window.addEventListener("scroll", function(e) {
//   if (section.getBoundingClientRect().top <= nav.clientHeight) {
//     console.log("equal");
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });


// Observer API example
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null, 
//   threshold: [0, 0.1]
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section);


// Sticky navbar Third approach
const stickyNav = function(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(
  stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);
headerObserver.observe(header);


// Revealing elements on scrolling
const revealSection = function(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(
  revealSection, {
    root: null,
    threshold: 0.15,
  }
);

allSections.forEach(section => {
  section.classList.add("section--hidden");  
  sectionObserver.observe(section);
});


// Lazy loading images
const obsCallback = function(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.setAttribute("src", entry.target.dataset.src);

    entry.target.addEventListener("load", function() {
      entry.target.classList.remove("lazy-img");
    }); 
    observer.unobserve(entry.target);  
  }
};

const imageObserver = new IntersectionObserver(obsCallback, {
  root: null, 
  threshold: 0,
  rootMargin: "-100px",
}); 

images.forEach(image => {
  imageObserver.observe(image);
});


// Sliders
let curSlide = 0;
let n = slides.length;

// Adding dots to slider
slides.forEach((_, i) => {
  const dotNew = `<button class="dots__dot" data-slide="${i}"></button>`;
  dotsContainer.insertAdjacentHTML("beforeend", dotNew);      
});

// Activating proper chosen slider dot
const activateDot = function(ind = 0) {
  dots[curSlide].classList.remove("dots__dot--active");
  dots[curSlide = ind].classList.add("dots__dot--active");
};

// Dot slider
dotsContainer.addEventListener("click", function(e) {
  const newSlide = e.target.dataset.slide;
  activateDot(newSlide);
  changeSlide(newSlide);
});

// Changing current slides due to slide variable
const changeSlide = function(slide = 0) {
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
};

changeSlide();
activateDot();
btnRight.addEventListener("click", function(e) {
  const newSlide = (curSlide + 1) % n;
  activateDot(newSlide);
  changeSlide(newSlide);
  curSlide = newSlide;
});

btnLeft.addEventListener("click", function(e) {
  const newSlide = (curSlide - 1 + n) % n;
  activateDot(newSlide);
  changeSlide(newSlide);
  curSlide = newSlide;
});


// Right and Left keyboards working with slider when slider is intersecting with viewport
const handleKeyPress = function(e) {
  if (e.key == "ArrowLeft") {
    const newSlide = (curSlide - 1 + n) % n;
    activateDot(newSlide);
    changeSlide(newSlide);
    curSlide = newSlide;  
  } else if (e.key == "ArrowRight") {
    const newSlide = (curSlide + 1) % n;
    activateDot(newSlide);
    changeSlide(newSlide);
    curSlide = newSlide;
  }
}

const sliderFunc = function(entries, observer) {
  const [entry] = entries;
  // Remove event listener if slider is not intersecting
  if (!entry.isIntersecting) {
    document.removeEventListener("keydown", handleKeyPress);
  } else {
    document.addEventListener("keydown", handleKeyPress);
  }
}

const sliderObserver = new IntersectionObserver(sliderFunc, {
  root: null,
  threshold: 0,
  rootMargin: `-${sliderHeight}px`
});
sliderObserver.observe(slider);


// // DOMContentLoaded
// document.addEventListener("DOMContentLoaded", function(e) {
//   console.log("HTML parsed and DOM Tree has been built", e);
// });


// // Load event
// window.addEventListener("load", function(e) {
//   console.log("Page has been fully loaded", e);
// }); 


// unload event
// window.addEventListener("beforeunload", function(e) {
//   e.preventDefault();
//   e.returnValue = "";
// });