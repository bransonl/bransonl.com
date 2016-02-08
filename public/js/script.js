window.onload = function() {
	$(document).ready(function() {
		var headerHeight = $("#header").offset().top
		
		var checkHeader = function() {
			headerHeight = $("#header").hasClass("fixed") ? $("#filler").offset().top : $("#header").offset().top;
			console.log(window.scrollY, headerHeight);
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
