// guide
// ==============
// ==============

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    if (!element) {
      return;
    }
    const animationName = `${prefix}${animation}`;
    const node =
      typeof element === "string" ? document.querySelector(element) : element;

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });
  
  function hideOtherSections(sections) {
    Array.prototype.filter.call(sections, function (section) {
      if (section.classList.contains("visible")) {
        animateCSS(section, "fadeOutUp").then((message) => {
          var link = document.querySelector(`a[href="#${section.id}"]`);
          link.classList.remove("active");
          section.classList.remove("visible");
        });
      }
    });
  }
  function showCurrentSection(section) {
    var link = document.querySelector(`a[href="#${section.id}"]`);
    section.classList.add("visible");
    animateCSS(section, "fadeInUp").then((message) => {
      link.classList.add("active");
    });
  }
  function rememberSection(_href) {
    localStorage.setItem("activeSection", _href);
  }
  function showSectionByLocalStorage() {
    var _href = localStorage.getItem("activeSection"),
      section = document.querySelector(_href),
      sections = document.querySelectorAll('[data-element="section"]');
  
    if (_href && section) {
      hideOtherSections(sections);
      showCurrentSection(section);
    }
  }
  
  var links = document.querySelectorAll('[data-element="switcher-section"] a');
  
  Array.prototype.filter.call(links, function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var _href = e.currentTarget.getAttribute("href"),
        section = document.querySelector(_href),
        parent = section.parentElement,
        sections = parent.querySelectorAll('[data-element="section"]');
  
      hideOtherSections(sections);
      showCurrentSection(section);
      rememberSection(_href);
    });
  });
  
  showSectionByLocalStorage();
// ==============
// ==============

$(function () {
  var loader = $('[data-element="loader"]');
  var loaderAnimationOut = loader.data('animationOut');
  var appElement = $('#app');
  var appAnimationIn = appElement.data('animationIn');
  var appAnimationOut = appElement.data('animationOut');
  var linesBackgroundElement = $('[data-element="lines"]');
  var linesBackgroundAnimationIn = linesBackgroundElement.data('animationIn');
  var linesBackgroundAnimationOut = linesBackgroundElement.data('animationOut');
  var appAnimationIn = appElement.data('animationIn');
  var appAnimationOut = appElement.data('animationOut');
  var headerElement = $('[data-element="header"]');
  var headerAnimationIn = headerElement.data('animationIn');
  var headerAnimationOut = headerElement.data('animationOut');
  var hash = $(location).attr('hash');
  var mainSection = hash ? $(hash) : $('#main');
  var mainSectionContentElement = mainSection.find('[data-element="content"]');
  var mainSectionContentAnimationIn = mainSectionContentElement.data('animationIn');
  var mainSectionContentAnimationOut = mainSectionContentElement.data('animationOut');
  var mainSectionBackgroundElement = mainSection.find('[data-element="background"]');
  var mainSectionBackgroundAnimationIn = mainSectionBackgroundElement.data('animationIn');
  var mainSectionBackgroundAnimationOut = mainSectionBackgroundElement.data('animationOut');

  $('[data-element="switch-slide"]').each(function(i, el) {
    if ($(el).attr('href') == hash) {
      $(el).parent().addClass('active');
    }
  })

  animateCSS(loader[0], loaderAnimationOut)
  .then(function() {
    loader.removeClass('show');
    appElement.addClass('show');
    animateCSS(appElement[0], appAnimationIn)
    .then(function() {
      linesBackgroundElement.addClass('show');
      animateCSS(linesBackgroundElement[0], linesBackgroundAnimationIn)
      .then(function() {
        linesBackgroundElement.addClass('animate__pulse animate__animated animate__infinite');
        mainSection.addClass('show');
        headerElement.addClass('show');
        animateCSS(headerElement[0], headerAnimationIn);
        animateCSS(mainSectionContentElement[0], mainSectionContentAnimationIn);
        animateCSS(mainSectionBackgroundElement[0], mainSectionBackgroundAnimationIn);
      });
    });
  });
  
  var swiper = new Swiper("[data-element='app']", {
    grabCursor: false,
    allowTouchMove: false,
    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: true,
        translate: ["-120%", 0, -500],
      },
      next: {
        shadow: true,
        translate: ["120%", 0, -500],
      },
    },
    on: {
      slideChangeTransitionEnd: function(swiper) {
        console.log(swiper.activeIndex);
      }
    }
  });

  var swiper2 = new Swiper("[data-element='carousel-gallery']", {
    effect: "cards",
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  $('[data-element="toggle"]').on("click", function (e) {
    var target = $(this).data("target");
    var toggleClass = $(this).data("toggleClass");
    var _element = $(`#${target}`);
    _element.toggleClass(toggleClass);
  });

  $('[data-element="switch-slide"]').on("click", function (e) {
    // e.preventDefault();
    var target = $(this).attr("href");
    var _this = $(this);
    var contentElementNext = $(target).find('[data-element="content"]');
    var contentElementAnimationIn = contentElementNext.data('animationIn');
    var backgroundElementNext = $(target).find('[data-element="background"]');
    var backgroundElementAnimationIn = backgroundElementNext.data('animationIn');
    
    $('.section').each(function(i, el) {
      if ($(el).hasClass('show')) {
        var contentElementCurrent = $(el).find('[data-element="content"]');
        var contentElementAnimationOut = contentElementCurrent.data('animationOut');
        var backgroundElementCurrent = $(el).find('[data-element="background"]');
        var backgroundElementAnimationOut = backgroundElementCurrent.data('animationOut');
        console.log(`hide #${el.id} section`);

        headerElement.removeClass('menu-opened');
        animateCSS(headerElement[0], headerAnimationOut)
        .then(function() {
          headerElement.removeClass('show');
          $('[data-element="switch-slide"]').each(function(i, el) {
            $(el).parent().removeClass('active');
          })
        });
        animateCSS(backgroundElementCurrent[0], backgroundElementAnimationOut);
        animateCSS(contentElementCurrent[0], contentElementAnimationOut)
        .then(function () {
          $(el).removeClass('show');
          linesBackgroundElement.removeClass('animate__pulse animate__animated animate__infinite');
          animateCSS(linesBackgroundElement[0], linesBackgroundAnimationOut)
          .then(function() {
            linesBackgroundElement.removeClass('show');
            animateCSS(appElement[0], appAnimationOut)
            .then(function() {
              animateCSS(appElement[0], appAnimationIn)
              .then(function() {
                linesBackgroundElement.addClass('show');
                animateCSS(linesBackgroundElement[0], linesBackgroundAnimationIn)
                .then(function() {
                  console.log(`show ${target} section`);
                  linesBackgroundElement.addClass('animate__pulse animate__animated animate__infinite');
                  $(target).addClass('show');
                  animateCSS(contentElementNext[0], contentElementAnimationIn);
                  animateCSS(backgroundElementNext[0], backgroundElementAnimationIn);
                  headerElement.addClass('show');
                  _this.parent().addClass('active');
                  animateCSS(headerElement[0], headerAnimationIn);
                })
              })
            })
          })
        })
      }
    })

  });
});
