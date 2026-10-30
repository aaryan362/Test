(function () {
  "use strict";

  function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else if (!(new RegExp("(^|\\s)" + className + "(\\s|$)")).test(element.className)) {
      element.className += " " + className;
    }
  }

  function removeClass(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)", "g"), " ").replace(/^\\s+|\\s+$/g, "");
    }
  }

  function getElements(selector) {
    return document.querySelectorAll(selector);
  }

  addClass(document.body, "js-ready");

  var cover = document.getElementById("cover");
  var openButton = document.getElementById("open-invitation");
  var guestName = document.getElementById("guest-name");
  var recipientMatch = window.location.search.match(/[?&]to=([^&]*)/);

  if (recipientMatch && guestName) {
    try {
      guestName.textContent = decodeURIComponent(recipientMatch[1].replace(/\+/g, " ")).replace(/[<>]/g, "").substring(0, 80);
    } catch (ignore) {
      guestName.textContent = "Nama Tamu";
    }
  }

  if (openButton) {
    openButton.addEventListener("click", function () {
      removeClass(document.body, "locked");
      addClass(cover, "is-hidden");
      window.setTimeout(function () {
        if (cover && cover.parentNode) cover.parentNode.removeChild(cover);
      }, 950);
      var top = document.getElementById("top");
      if (top && top.scrollIntoView) top.scrollIntoView();
    });
  }

  var weddingDate = new Date(2030, 0, 1, 8, 0, 0).getTime();
  var countdownValues = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };

  function updateCountdown() {
    var remaining = Math.max(0, weddingDate - new Date().getTime());
    if (countdownValues.days) countdownValues.days.textContent = Math.floor(remaining / 86400000);
    if (countdownValues.hours) countdownValues.hours.textContent = Math.floor((remaining % 86400000) / 3600000);
    if (countdownValues.minutes) countdownValues.minutes.textContent = Math.floor((remaining % 3600000) / 60000);
    if (countdownValues.seconds) countdownValues.seconds.textContent = Math.floor((remaining % 60000) / 1000);
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  var revealItems = getElements(".section-heading, .person-card, .event-card, .story-card, .gallery__item, .gift__panel, .rsvp__intro, .wish-form, .closing__copy");
  var index;
  for (index = 0; index < revealItems.length; index += 1) {
    revealItems[index].setAttribute("data-reveal", "");
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      var itemIndex;
      for (itemIndex = 0; itemIndex < entries.length; itemIndex += 1) {
        if (entries[itemIndex].isIntersecting) {
          addClass(entries[itemIndex].target, "is-visible");
          observer.unobserve(entries[itemIndex].target);
        }
      }
    }, { threshold: 0.12 });
    for (index = 0; index < revealItems.length; index += 1) observer.observe(revealItems[index]);
  } else {
    for (index = 0; index < revealItems.length; index += 1) addClass(revealItems[index], "is-visible");
  }

  var galleryButtons = getElements(".gallery__item");
  var galleryImages = [];
  for (index = 0; index < galleryButtons.length; index += 1) {
    var galleryImage = galleryButtons[index].getElementsByTagName("img")[0];
    galleryImages.push({ src: galleryImage.src, alt: galleryImage.alt });
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxCount = document.getElementById("lightbox-count");
  var activeIndex = 0;
  var previousFocus = null;

  function showPhoto(nextIndex) {
    if (!galleryImages.length) return;
    activeIndex = (nextIndex + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[activeIndex].src;
    lightboxImage.alt = galleryImages[activeIndex].alt;
    lightboxCount.textContent = (activeIndex + 1) + " / " + galleryImages.length;
  }

  function closeLightbox() {
    lightbox.setAttribute("hidden", "hidden");
    removeClass(document.body, "locked");
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  for (index = 0; index < galleryButtons.length; index += 1) {
    galleryButtons[index].addEventListener("click", function () {
      previousFocus = this;
      showPhoto(parseInt(this.getAttribute("data-gallery-index"), 10) || 0);
      lightbox.removeAttribute("hidden");
      addClass(document.body, "locked");
      document.getElementById("lightbox-close").focus();
    });
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", function () { showPhoto(activeIndex - 1); });
  document.getElementById("lightbox-next").addEventListener("click", function () { showPhoto(activeIndex + 1); });
  lightbox.addEventListener("click", function (event) {
    event = event || window.event;
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    event = event || window.event;
    if (lightbox.hasAttribute("hidden")) return;
    var key = event.key || event.keyCode;
    if (key === "Escape" || key === 27) closeLightbox();
    if (key === "ArrowLeft" || key === 37) showPhoto(activeIndex - 1);
    if (key === "ArrowRight" || key === 39) showPhoto(activeIndex + 1);
  });

  var form = document.getElementById("wish-form");
  var wishList = document.getElementById("wish-list");
  var wishCount = document.getElementById("wish-count");
  var formStatus = document.getElementById("form-status");
  var storageKey = "dummy-invitation-wishes";

  function readWishes() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    } catch (ignore) {
      return [];
    }
  }

  function renderWishes() {
    var wishes = readWishes();
    while (wishList.firstChild) wishList.removeChild(wishList.firstChild);
    wishCount.textContent = wishes.length;
    for (var wishIndex = wishes.length - 1; wishIndex >= 0; wishIndex -= 1) {
      var wish = wishes[wishIndex];
      var article = document.createElement("article");
      article.className = "wish-item";
      var topRow = document.createElement("div");
      topRow.className = "wish-item__top";
      var name = document.createElement("strong");
      name.textContent = wish.name;
      var attendance = document.createElement("span");
      attendance.textContent = wish.attendance;
      var message = document.createElement("p");
      message.textContent = wish.message;
      topRow.appendChild(name);
      topRow.appendChild(attendance);
      article.appendChild(topRow);
      article.appendChild(message);
      wishList.appendChild(article);
    }
  }

  form.addEventListener("submit", function (event) {
    if (event.preventDefault) event.preventDefault();
    var nameField = document.getElementById("wish-name");
    var attendanceField = document.getElementById("wish-attendance");
    var messageField = document.getElementById("wish-message");
    var wish = {
      name: nameField.value.replace(/^\s+|\s+$/g, ""),
      attendance: attendanceField.value,
      message: messageField.value.replace(/^\s+|\s+$/g, "")
    };
    if (!wish.name || !wish.attendance || !wish.message) {
      formStatus.textContent = "Mohon lengkapi semua kolom contoh.";
      return false;
    }
    var wishes = readWishes();
    wishes.push(wish);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(wishes));
      formStatus.textContent = "Contoh ucapan berhasil disimpan di browser ini.";
      form.reset();
      renderWishes();
    } catch (ignore) {
      formStatus.textContent = "Penyimpanan lokal tidak tersedia di browser ini.";
    }
    return false;
  });

  renderWishes();
}());
