window.onload = function() {
	$(document).ready(function() {
		var s = ''
		$(document).on("keypress", function(e) {
			var c = String.fromCharCode(e.charCode).toLowerCase()[0]
			if (c == 'k') s = c
			else if (c == 'a' && s == 'k') s = c
			else if (c == 't' && s == 'a') s = c
			else if (c == 's' && s == 't') s = c
			else if (c == 'u' && s == 's') s = c
			else if (c == 'd' && s == 'u') s = c
			else if (c == 'o' && s == 'd') s = c
			else if (c == 'n' && s == 'o') {
				s = ''
				console.log("katsudon!!")
			}
			else s = ''
		})

		var headerHeight = $("#header").offset().top
		
		var checkHeader = function() {
			headerHeight = $("#header").hasClass("fixed") ? $("#filler").offset().top : $("#header").offset().top;
			if (window.scrollY >= headerHeight) {
				$("#header").addClass("fixed");
				$("#filler").css("display", "block");
			} else {
				$("#filler").css("display", "none");
				$("#header").removeClass("fixed");
			}
		}
		
		checkHeader();
		
		$(".project-desc>a, #top a").on("click", function() {
			var pos = $("#" + $(this).attr("class").split("_")[0]).offset().top;
			console.log(Math.min(Math.abs(window.scrollY - pos)/(window.innerWidth >= 800 ? 2 : 1.2), 750))
			$("html,body").animate({
				scrollTop : pos
			}, Math.min(Math.abs(window.scrollY - pos)/(window.innerWidth >= 800 ? 2 : 1.2), 750));
		});
		
		$(document).on("scroll", checkHeader);
		
		$(window).on("resize", checkHeader);
	});
}
