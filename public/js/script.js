window.onunload = function() {};
window.onload = function() {
  $(document).ready(function() {
    var $body = $("html, body"),
      $document = $(document),
      scroll,
      direction = 0,
      height,
      width,
      project,
      scrollable = true;

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {
      32: 1,
      33: 1,
      34: 1,
      35: 1,
      36: 1,
      37: 1,
      38: 1,
      39: 1,
      40: 1
    };

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    function disableScroll() {
      if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }
    var setup = function() {
      scroll = $document.scrollTop();
      var href = window.location.hash;
      if (window.location.hash !== "") {
        $("#nav").css("height", "100%");
      } else {
        $("#nav").css("height", "117px");
      }
      $(".selected").removeClass("selected");
      if (href !== "") {
        $("." + href.substring(1)).addClass("selected");
      }
      var newHeight = $(window).height();
      if (height !== newHeight) {
        height = newHeight;
        $body.scrollTop(href === "" ? 0 : href === "#about" ? height : height * 2);
      }
      var newWidth = $(window).width();
      if (width !== newWidth) {
        width = newWidth;
        if (!$(".scroll-selected").length) {
          $("#project-wrapper").stop().animate({
            scrollLeft: 0
          });
          $("#item0").addClass("scroll-selected");
        } else {
          $("#project-wrapper").scrollLeft($(".scroll-selected").attr("id").substring(4) * width);
        }
      }
      console.log(newWidth, newHeight);
    }

    var scrollPage = function(destination, scroll) {
      if (destination <= 0) {
        $("#nav").stop().animate({
          height: "117px"
        })
      } else {
        $("#nav").stop().animate({
          height: "100%"
        })
      }
      if (destination <= 0) {
        $(".selected").removeClass("selected");
        history.replaceState(undefined, undefined, "#");
      } else if (destination === height) {
        $(".selected").removeClass("selected");
        history.replaceState(undefined, undefined, "#about");
        $(".about").addClass("selected");
      } else if (destination === height * 2) {
        $(".selected").removeClass("selected");
        history.replaceState(undefined, undefined, "#projects");
        $(".projects").addClass("selected");
      }
      if (scroll > destination) {
        direction = -1;
      } else {
        direction = 1;
      }
      $body.stop().animate({
        scrollTop: destination
      }, function() {
        direction = 0;
      });
    };

    $(".anchor").click(function() {
      href = $(this).attr("href");
      if (!$(this).hasClass("selected")) {
        $(".selected").removeClass("selected");
      }
      if (href !== "") {
        $("." + href.substring(1)).addClass("selected");
      }
      var destination = $(href + "-section").offset().top;
      scrollPage(destination, $document.scrollTop());
    });

    $document.on("touchmove", function(e) {
      e.preventDefault();
    })

    var touchstart = {};
    $document.on("touchstart", function(e) {
      touchstart = {
        x: e.originalEvent.changedTouches[0].clientX,
        y: e.originalEvent.changedTouches[0].clientY
      };
    });

    $document.on("touchend", function(e) {
      if (scrollable) {
        var touchend = {
          x: e.originalEvent.changedTouches[0].clientX,
          y: e.originalEvent.changedTouches[0].clientY
        };
        if (Math.abs(touchend.y - touchstart.y) > Math.abs(touchend.x - touchstart.x)) {
          var down;
          if (touchend.y > touchstart.y) {
            if (direction === -1) {
              return;
            }
            down = false;
          } else if (touchstart.y > touchend.y) {
            if (direction === 1) {
              return;
            }
            down = true;
          } else {
            return;
          }
          scroll = $document.scrollTop();
          var destination = scroll;
          if (down && destination !== height * 2) {
            destination = Math.floor((destination + height) / height) * height;
          } else if (!down && destination !== 0) {
            destination = Math.ceil((destination - height) / height) * height;
          } else {
            return;
          }
          scrollPage(destination, scroll);
        }
      }
    });

    $document.on("mouseup", function(e) {
      if (scrollable) {
        var scroll = $document.scrollTop();
        var destination = Math.round(scroll / height) * height;
        if (destination !== scroll) {
          scrollPage(destination, scroll);
        }
      }
    });

    $document.on("wheel mousewheel DOMMouseScroll keyup", function(e) {
      if (scrollable) {
        scroll = $document.scrollTop();
        var down;
        if (e.type === "mousewheel" || e.type === "wheel") {
          if (e.originalEvent.deltaY > 0) {
            down = true;
          } else {
            down = false;
          }
        } else if (e.type === "DOMMouseScroll") {
          if (e.originalEvent.detail > 0) {
            down = true;
          } else {
            down = false;
          }
        } else if (e.type === "keyup") {
          var keycode = e.originalEvent.keyCode;
          if (keycode === 40 || keycode === 32 || keycode === 34) { //down, space, pgdwn
            down = true;
          } else if (keycode === 38 || keycode === 33) { //up, pgup
            down = false;
          } else if (keycode === 35) { //end
            down = 2;
          } else if (keycode === 36) { //home
            down = 3;
          } else {
            return;
          }
        } else {
          return;
        }
        var destination = scroll;
        if ((direction === 1 && (down === true || down === 2)) || (direction === -1 && (down === false || down === 3))) {
          return;
        } else if (down === 2) {
          destination = height * 2;
        } else if (down === 3) {
          destination = 0;
        } else if (down && destination !== height * 2) {
          destination = Math.floor((destination + height) / height) * height;
        } else if (!down && destination !== 0) {
          destination = Math.ceil((destination - height) / height) * height;
        } else {
          return;
        }
        scrollPage(destination, scroll);
      }
    });

    $(window).on("hashchange", function() {
      var href = window.location.hash;
      $body.clearQueue();
      var destination;
      if (href === "#about") {
        destination = height;
      } else if (href === "#projects") {
        destination = height * 2;
      } else {
        destination = 0;
        history.replaceState(undefined, undefined, "#");
      }
      scrollPage(destination, $document.scrollTop());
    });

    $(window).resize(setup);

    $("#projects-wrapper").on("touchend", function(e) {
      var touchend = {
        x: e.originalEvent.changedTouches[0].clientX,
        y: e.originalEvent.changedTouches[0].clientY
      };
      if (Math.abs(touchend.y - touchstart.y) < Math.abs(touchend.x - touchstart.x)) {
        var pos = $("#projects-wrapper").scrollLeft(),
          num = parseInt($(".scroll-selected").attr("id").substring(4));
        if (touchend.x > touchstart.x && pos > 0) {
          pos -= width;
          num--;
        } else if (touchend.x < touchstart.x && pos < width) {
          pos += width;
          num++;
        } else {
          return;
        }
        $("#projects-wrapper").animate({
          scrollLeft: pos
        }, function() {
          $(".scroll-selected").removeClass("scroll-selected");
          $("#item" + (num)).addClass("scroll-selected");
        });
      }
    });

    $(".scroll-item").on("click", function() {
      if (!$(this).hasClass("scroll-selected")) {
        $(".scroll-selected").removeClass("scroll-selected");
        $(this).addClass("scroll-selected");
      }
      console.log($(this).prop("id").substring(4) * width)
      $("#projects-wrapper").stop().animate({
        scrollLeft: $(this).prop("id").substring(4) * width
      });
    });

    $(".project").on("mouseenter", function() {
      $(this).stop().animate({
        opacity: "0.5"
      }, 200);
    });

    $(".project").on("mouseleave", function() {
      $(this).stop().animate({
        opacity: "1"
      }, 200);
    });

    $(".project").on("click", function() {
      scrollable = false;
      $("body").css("overflow", "hidden");
      project = $(this).attr("class").substring(8);
      $("." + project + ".project-details").css("visibility", "visible");
      $("#project-details-wrapper").css({
        display: "block",
        top: height * 2
      });
    });

    $(".close").on("click", function() {
      $("#project-details-wrapper").css({
        display: "none"
      });
      $("." + project + ".project-details").css("visibility", "hidden");
      $("body").css("overflow", "auto");
      scrollable = true;
    });

    disableScroll();
    setup();
  });
};
