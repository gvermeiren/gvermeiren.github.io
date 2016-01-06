modelfilestrs['title'] = hereDoc(function(){/*!
<script type="text/javascript">

	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var title = new function() {
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			this.setUpBg();
		}
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			
		}
		
		this.init = function() {
			var $pageContents = $("#pageContents");
			$pageContents
				.html(x_currentPageXML.childNodes[0].nodeValue)
				.css("font-size", x_currentPageXML.getAttribute("size") + "pt");
			
			if (x_currentPageXML.getAttribute("titleTextColour") != undefined) {
				$pageContents.css("color", x_currentPageXML.getAttribute("titleTextColour").replace("0x","#"));
			}
			
			if (x_currentPageXML.getAttribute("titleHAlign") != undefined) {
				$pageContents.addClass(x_currentPageXML.getAttribute("titleHAlign") + "Align");
			} else {
				$pageContents.addClass("centerAlign");
			}
			
			var titleAlign = x_currentPageXML.getAttribute("titleVAlign");
			if (x_browserInfo.mobile == true) {
				$pageContents.css({
					"position"		:"inherit",
					"margin-left"	:0
				});
			} else {
				if (titleAlign == 200 || titleAlign == undefined) { // middle
					$pageContents.css({
						"top"			:"50%",
						"margin-top"	:0 - Math.round($pageContents.height() / 2)
					})
				} else if (titleAlign == 400) { // bottom
					$pageContents.css({
						"top"			:"100%",
						"margin-top"	:0 - $pageContents.height()
					})
				}
			}
			
			title.setUpBg(true);
		}
		
		this.setUpBg = function(firstLoad) {
			if (x_currentPageXML.getAttribute("bgImage") != undefined) {
				var vConstrain = x_currentPageXML.getAttribute("bgImageVConstrain"),
					hConstrain = x_currentPageXML.getAttribute("bgImageHConstrain"),
					alpha = 100;
				
				if (x_currentPageXML.getAttribute("bgImageAlpha") != undefined && x_currentPageXML.getAttribute("bgImageAlpha") != "") {
					alpha = x_currentPageXML.getAttribute("bgImageAlpha");
				}
				
				var $pageBg = $('<img id="pageBg"/>');
				$pageBg
					.attr("src", x_evalURL(x_currentPageXML.getAttribute("bgImage")))
					.css({
						"opacity"		:Number(alpha/100),
						"filter"		:"alpha(opacity=" + alpha + ")",
						"visibility"	:"hidden"
					})
					.one("load", function() {
						var $this = $(this);
						setTimeout(function(){
							if (vConstrain != undefined || hConstrain != undefined) {
								var imgMaxW = 800,
									imgMaxH = 500;
								
								if (hConstrain != undefined) {
									imgMaxW = Number(hConstrain);
								}
								if (vConstrain != undefined) {
									imgMaxH = Number(vConstrain);
								}
								
								x_scaleImg($this[0], imgMaxW, imgMaxH, true, false, true);
								
								var vAlign = x_currentPageXML.getAttribute("bgImageVAlign") != undefined ? x_currentPageXML.getAttribute("bgImageVAlign") : "middle",
									hAlign = x_currentPageXML.getAttribute("bgImageHAlign") != undefined ? x_currentPageXML.getAttribute("bgImageHAlign") : "centre";
								
								if (vAlign == "middle" || vAlign == "bottom") {
									var topValue = "50%",
										topMargin = 0 - Math.round($this.height() / 2);
									
									if (vAlign == "bottom") {
										topValue = "100%"
										topMargin = 0 - $this.height();
									}
									$this.css({
										"top"			:topValue,
										"margin-top"	:topMargin
									})
								}
								if (hAlign == "centre" || hAlign == "right") {
									var leftValue = "50%",
										leftMargin = 0 - Math.round($this.width() / 2);
									
									if (hAlign == "right") {
										leftValue = "100%"
										leftMargin = 0 - $this.width();
									}
									$this.css({
										"left"			:leftValue,
										"margin-left"	:leftMargin
									})
								}
							} else {
								$this.css("visibility", "visible");
							}
						}, 0);
					})
					.each(function() { // called if loaded from cache as in some browsers load won't automatically trigger
						if (this.complete) {
							$(this).trigger("load");
						}
					});
				
				$x_background.append($pageBg);
				$pageBg.fadeIn();
				
				if (firstLoad == true) {
					x_pageLoaded();
				}
			} else if (firstLoad == true) {
				x_pageLoaded();
			}
		}
	}
	
	title.init();
	
</script>

<style type="text/css">
	
	#pageContents {
		position:		absolute;
		width:			100%;
		margin-left:	-10px;
	}
	
</style>

<div id="pageContents">
	
</div>
*/});