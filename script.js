'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
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
 
// button scrolling 

btnScrollTo.addEventListener('click',function(e){
    //e.preventDefault();
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());

    console.log('Current scroll (X/Y)',window.pageXOffset,pageYOffset);
    console.log('height/width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    );

    // scrolling
    // window.scrollTo(s1coords.left+window.pageXOffset ,s1coords.top+window.pageYOffset);
    ////////////old version 
    //  window.scrollTo({
    //     left: s1coords.left + window.pageXOffset ,
    //     top: s1coords.top + window.pageYOffset,behaviour: 'smooth',
    // }
    // );
//modern way
    section1.scrollIntoView({behavior: 'smooth'});
});

////////////////////////////////////////

//Page navigation
/*

document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click',function(e){
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({behaviour:'smooth'});
  });
});
 */

// 1. addevent listener to common parent element
//2. determine what element originated the event   // event delegation
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();

  //matching strategy 
  if(e.target.classList.contains('nav__link')){
    console.log('link');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});


// tabbed content

//const tabs = document.querySelectorAll('.operations__tab');


// tabs.forEach(t => t.addEventListener('click',()=>
// console.log('tab')));          // but oits a bad practice as it makes multiple copies

// we use event delegation
tabsContainer.addEventListener('click',function(e){
  //const clicked =e.target.parentElement;  // it select parent of child but we want button
  const clicked =e.target.closest('.operations__tab');
  console.log(clicked);

  // guard clause
  if(!clicked) return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

   //active tab
  clicked.classList.add('operations__tab--active');

  // activate contents area
  console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
});

// menu fade animation 

const handlehover = function(e,opacity){
  if(e.target.classList.contains('nav__link')){
    const link =e.target;
    //select sibling elemenets
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach((el) => {
     if (el !== link) el.style.opacity =this ;
    });
    logo.style.opacity = this ;
 }
}
/*
nav.addEventListener('mouseover',function(e){
  if(e.target.classList.contains('nav__link')){
     const link =e.target;
     //select sibling elemenets
     const sibling = link.closest('.nav').querySelectorAll('.nav__link');
     const logo = link.closest('.nav').querySelector('img');

     sibling.forEach((el) => {
      if (el !== link) el.style.opacity =0.5 ;
     });
     logo.style.opacity =0.5;
  }
});*/


// nav.addEventListener('mouseover',function(e){
//   handlehover(e,0.5);
// });  second way of doing this is bind mehod

// passing arguments  into handler 
nav.addEventListener('mouseover',handlehover.bind(0.5));
  
/*nav.addEventListener('mouseout',function(e){
  if(e.target.classList.contains('nav__link')){
    const link =e.target;
    //select sibling elemenets
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach((el) => {
     if (el !== link) el.style.opacity =1 ;
    });
    logo.style.opacity =1;
 }
});*/
// nav.addEventListener('mouseout',function(e){
//   handlehover(e,1);
// });
nav.addEventListener('mouseout',handlehover.bind(1));


 // sticky navigation

 /*
const initialCoords=section1.getBoundingClientRect();
console.log(initialCoords);
 window.addEventListener('scroll',function( ){
  console.log(this.window.scrollY);

  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
 });
 */


 // intersection Observer API :=> 

const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;
const stickynav =function(entries){
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting){
  nav.classList.add('sticky');}
  else nav.classList.remove('sticky');
}
const headerobserver = new IntersectionObserver
(
  stickynav,{
    root :null,
    threshold : 0,
    rootMargin: `-${navheight}px`,
  }
);
headerobserver.observe(header);


// reveal section

const allsection = document.querySelectorAll('.section');

const revealsection = function(entries,observer){
  console.log(entries);
  const [entry] =entries ;
  //console.log(entry);
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
  
};

const sectionObserver = new IntersectionObserver(revealsection ,{
  root:null, 
  threshold :0.15,
});

allsection.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images

const imgtarget = document.querySelectorAll('img[data-src]');

const loading = function(entries,observer){
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src=entry.target.dataset.src;
   entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });

};
const imgobserver = new IntersectionObserver(loading,{
    root :null,
    threshold:0,
});

imgtarget.forEach(img => 
  imgobserver.observe(img));

// slider 
/////////////////////////////////////////
const dotContainer =document.querySelector('.dots');
const slider = document.querySelectorAll('.slider');
const slides = document.querySelectorAll('.slide');
const btnleft = document.querySelector('.slider__btn--left');
const btnright = document.querySelector('.slider__btn--right');

let currslide = 0;
const maxslide=slides.length;
//slides.forEach((s,i)=> (s.style.transform = `translateX(${100*i}%)`));  // 0% 100% 200%

const createdots =function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class ="dots__dot" data-slide = "${i}"></button>`
    )
  })
};
createdots();

const activatedot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};


const gotoslide =function(slide){
  slides.forEach((s,i) => (s.style.transform= `translateX(${100*(i-slide)}%)`));
};
gotoslide(0);

//next slide
const nextslide =function(){
  if(currslide === maxslide -1){
    currslide =0 ;}
    else{
     currslide++;
    }
   gotoslide(currslide);
   };

   const prevslide =function(){
    if(currslide == 0){
      currslide =0;
    }else{
    currslide--;
  }
   gotoslide(currslide);
   };
  
// btnright.addEventListener('click',function(){
//   if(currslide === maxslide -1){
//  currslide =0 ;}
//  else{
//   currslide++;
//  }
// gotoslide(currslide);
// });
// -100 , 0 ,100,200

//event handler

btnright.addEventListener('click',nextslide);
btnleft.addEventListener('click',prevslide);

document.addEventListener('keydown',function(e){
  console.log(e);

  if(e.key=== 'ArrowLeft') prevslide();
  e.key === 'ArrowRight' && nextslide();
})

dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    // console.log('DOT');
    // const {slide} =Number(e.target.dataset.slide);
    currslide =Number(e.target.dataset.slide);
    gotoslide(currslide);
    activatedot(currslide);
  }
})






























