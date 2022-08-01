'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById('section--1');
const nav = document.querySelector('nav');
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect();
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const allSections = document.querySelectorAll('.section');
const imageTargets = document.querySelectorAll('img[data-src]')
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect())
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset)
  // //Y - current position of the view port!
  // console.log('height and width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth)

  section1.scrollIntoView({behavior: 'smooth'})

})

// document.querySelectorAll('.nav__link')
// .forEach(el => {
//   el.addEventListener('click', function (e)  {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({behavior:'smooth'})
//   })
// })

//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  }
})

//tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) {
    return;
  }

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active')
})

//Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__Link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sib => {
      if (sib !== link) {
        sib.style.opacity = opacity;
      }
    });

    logo.style.opacity = opacity;
  }
}

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5)
})
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1)
});

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }

}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight.height}px`,
});
headerObserver.observe(header);

//section reveal
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden")
});

//Lazy loading images
const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target);
}
const imageObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})
imageTargets.forEach(img => imageObserver.observe(img));
//we can also to something like this, if we only have one argument except event
//nav.addEventListener('mouseover',  function (e){
//   handleHover.bind(0.5) and replace opacity with "this" keyword in the handleHover function
// })

//Slider
let curSlide = 0;
const slidesCount = slides.length;

const goToSlide = function (slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)`);
}
const nextSlide = function () {
  curSlide = (curSlide + 1) % slidesCount;
  goToSlide(curSlide);
  activateDot(curSlide)
}

const prevSlide = function () {
  curSlide = (curSlide === 0) ? slidesCount - 1 : curSlide - 1;
  goToSlide(curSlide)
  activateDot(curSlide)
}

btnRight.addEventListener('click', nextSlide)

btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function (e) {
  if (e.key === "ArrowLeft") {
    prevSlide();
  }
  if (e.key === "ArrowRight") {
    nextSlide();
  }
})

//Dots
const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML("beforeend", `<button class='dots__dot' data-slide="${i}"></button>`)
  })
  activateDot(0);
}
const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot')
    .forEach((dot => {
      dot.classList.remove("dots__dot--active")
    }));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
  curSlide = slide;
}

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    activateDot(slide);
    goToSlide(slide);
  }
})

//init
const init = function () {
  goToSlide(0);
  createDots();
}

init();

//
document.addEventListener('DOMContentLoaded', function (e) {
  console.log(`HTML parsed and DOM tree built ${e} event`)
})

window.addEventListener('load', function (e) {
  console.log(`Page was fully loaded, ${e}`)
})

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = "";
})