modelfilestrs['hotspotImage'] = hereDoc(function(){/*!
<script type="text/javascript">

	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var hotspotImage = new function() {
		var	$img;
		
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			$img = $("#image");
			
			$(".selected").removeClass("selected");
			$("#infoHolder").html("");
			$("#nextHS").button("enable");
			$("#prevHS").button("disable");
		}
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			$img.css({
				"opacity"	:0,
				"filter"	:'alpha(opacity=0)'
			});
			this.resizeImg(false);
		}
		
		this.init = function() {
			$img = $("#image");
			
            if (x_currentPageXML.getAttribute("align") == "Right") {
				$("#panel").addClass("left");
			} else {
				$("#panel").addClass("right");
			}
			$("#mainText").html(x_addLineBreaks(x_currentPageXML.getAttribute("text")));
			
			$img
				.css({
						"opacity"	:0,
						"filter"	:'alpha(opacity=0)'
				})
				.one("load", function() {
					hotspotImage.resizeImg(true);
					
					// call this function in every model once everything's loaded
					x_pageLoaded();
				})
				.attr({
					"src"	:x_evalURL(x_currentPageXML.getAttribute("url")),
					"alt"	:x_currentPageXML.getAttribute("tip")
				})
				.each(function() { // called if loaded from cache as in some browsers load won't automatically trigger
					if (this.complete) {
						$(this).trigger("load");
					}
				});
			
			if (x_currentPageXML.getAttribute("interactivity") == "Show Me") {
				// if language attributes aren't in xml will have to use english fall back
				var nextTxt = x_currentPageXML.getAttribute("nextTxt");
				if (nextTxt == undefined) {
					nextTxt = "Next";
				}
				var priorTxt = x_currentPageXML.getAttribute("priorTxt");
				if (priorTxt == undefined) {
					priorTxt = "Previous";
				}
				
				$("#nextHS")
					.button({
						icons: {
							primary: "ui-icon-carat-1-e"
						},
						label	:nextTxt,
						text	:false
					})
					.click(function() {
						hotspotImage.selectHs("next");
					});
				
				$("#prevHS")
					.button({
						icons: {
							primary: "ui-icon-carat-1-w"
						},
						label		:priorTxt,
						text		:false,
						disabled	:true
					})
					.click(function() {
						hotspotImage.selectHs("prev");
					});
			} else { // click explore
				$("#pageContents button").remove();
			}
		}
		
		this.resizeImg = function(firstLoad) {
			var imgMaxW = Math.round($x_pageHolder.width() * (400.0/800.0)),
				imgMaxH = Math.round($x_pageHolder.height() * (550.0/600.0) - 100);
			x_scaleImg($img, imgMaxW, imgMaxH, true, firstLoad, false);
			
			$img.css({
				"opacity"	:1,
				"filter"	:'alpha(opacity=100)'
			});
			
			this.createHS();
		}
		
		this.createHS = function() {
			// create hotspots - taking scale of image into account
			var scale = $img.width() / $img.data("origSize")[0],
				selected = $("#pageContents .hotspot.selected").length > 0 ? $("#pageContents .hotspot.selected").index() : undefined;
			$("#hsHolder").html("");
			
			$(x_currentPageXML).children()
				.each(function(i){
					var _this = this;
					
					var $hotspot = $('<a class="hotspot transparent" href="#" tabindex="' + (i+2) + '" />');
					$hotspot
						.attr("title", this.getAttribute("name"))
						.css({
							width	:Math.round(this.getAttribute("w") * scale) + "px",
							height	:Math.round(this.getAttribute("h") * scale) + "px",
							left	:Math.round(this.getAttribute("x") * scale) + "px",
							top		:Math.round(this.getAttribute("y") * scale) + "px"
							})
						.click(function() {
							$("#infoHolder").html("<hr/><h3>" + _this.getAttribute("name") + "</h3><br/>" + x_addLineBreaks(_this.getAttribute("text")));
							$(".selected").removeClass("selected");
							var $this = $(this);
							$this.addClass("selected");
							if (x_currentPageXML.getAttribute("interactivity") == "Show Me") {
								var nextHS = $("#nextHS"),
									prevHS = $("#prevHS");
								
								if ($this.index() + 1 == $("#pageContents .hotspot").length) {
									nextHS.button("disable");
									prevHS.button("enable");
								} else if ($this.index() == 0) {
									nextHS.button("enable");
									prevHS.button("disable");
								} else {
									nextHS.button("enable");
									prevHS.button("enable");
								}
							}
							})
						.focusin(function() {
							$(this)
								.removeClass("transparent")
								.addClass("highlight");
							})
						.focusout(function() {
							$(this)
								.removeClass("highlight")
								.addClass("transparent");
							})
						.keypress(function(e) {
							var charCode = e.charCode || e.keyCode;
							if (charCode == 32) {
								$(this).trigger("click");
							}
						});
					
					$("#hsHolder").append($hotspot);
				});
			
			var highlightColour = "yellow";
			if (x_currentPageXML.getAttribute("hicol") != undefined && x_currentPageXML.getAttribute("hicol") != "") {
				highlightColour = x_getColour(x_currentPageXML.getAttribute("hicol"));
			}
			$("#pageContents .hotspot").css("border-color", highlightColour);
			if (x_currentPageXML.getAttribute("highlight") == "true") {
				$("#pageContents .hotspot").addClass("highlightBorder");
			}
			
			if (selected != undefined) {
				$("#pageContents .hotspot:eq(" + selected + ")").trigger("click");
			}
		}
		
		this.selectHs = function(type) {
			var currentSelection = $("#pageContents .selected"),
				i = currentSelection.index();
			
			currentSelection.removeClass("selected");
			
			if (type == "next") {
				$("#pageContents .hotspot:eq(" + (i + 1)  + ")").trigger("click");
			} else {
				$("#pageContents .hotspot:eq(" + (i - 1) + ")").trigger("click");
			}
		}
	}
	
	hotspotImage.init();
	
</script>

<style>
	
	#panel.right {
		float:	right;
		margin:	0 0 20px 20px;
	}
	
	#panel.left {
		float:	left;
		margin:	0 20px 20px 0;
	}
	
	#imageHolder {
		position:	relative;
	}
	
	#pageContents .hotspot {
		position:	absolute;
		cursor:		pointer;
	}
	
	#infoHolder {
		padding-top: 10px;
	}
	
	#infoHolder hr {
		border: none;
		background-color: #CCCCCC;
		height: 1px;
		margin-bottom: 20px;
	}
	
	#pageContents .highlightBorder {
		border:		1px solid;
		margin-top: -1px;
		margin-left: -1px;
	}
	
	#pageContents .selected {
		border:		2px solid;
		margin-top: -2px;
		margin-left: -2px;
	}
	
	#btns {
		padding:	3px;
		position:	absolute;
		bottom:		10px;
		right:		10px;
	}
	
</style>

<div id="pageContents">
	
	<div id="panel" class="panel inline">
		<div id="imageHolder">
			<img id="image" />
			<div id="hsHolder"></div>
			<div id="btns">
				<button id="prevHS"></button>
				<button id="nextHS"></button>
			</div>
		</div>
	</div>
	
	<div id="textContents">
		<div id="mainText" tabindex="1"></div>
		<div id="infoHolder"></div>
	</div>
	
</div>
*/});