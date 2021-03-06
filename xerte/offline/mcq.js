modelfilestrs['mcq'] = hereDoc(function(){/*!
<script type="text/javascript">


	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var mcq = new function() {
        var checked;
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			if ($(x_currentPageXML).children().length > 0) {
				this.startQ();
				$("#feedback").html("");
				$("#optionHolder input:checked").prop("checked", false);
				$("#checkBtn").attr("disabled", "disabled");
			}
		}

		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			if (x_browserInfo.mobile == false) {
				var $panel = $("#pageContents .panel");
				$panel.height($x_pageHolder.height() - parseInt($x_pageDiv.css("padding-top")) * 2 - parseInt($panel.css("padding-top")) * 2 - 5);
			}
		}

        this.startQ = function() {
            var correctOptions = [],
               correctAnswer = [],
               correctFeedback = [],
               correctOption = false; // is there a correct answer for the question?

            this.checked = false;
            // Track the quiz page
            this.weighting = 1.0;
            if (x_currentPageXML.getAttribute("trackingWeight") != undefined)
            {
                this.weighting = x_currentPageXML.getAttribute("trackingWeight");
            }
            XTSetPageType(x_currentPage, 'numeric', 1, this.weighting);
            for (var i = 0; i < this.optionElements.length; i++) {
                if (this.optionElements[i].correct == 'true') {
                    correctOptions.push((i+1)+"");
                    correctAnswer.push(this.optionElements[i].text);
                    correctFeedback.push(this.optionElements[i].feedback);
                    mcq.correctOption = true;
                }
            }
            XTEnterInteraction(x_currentPage, 0, 'multiplechoice', x_currentPageXML.getAttribute("prompt"), correctOptions, correctAnswer, correctFeedback);
        }

        this.leavePage = function() {
			if ($(x_currentPageXML).children().length > 0) {
				if (!this.checked) {
					this.showFeedBackandTrackScore();
				}
			}
        }

        this.showFeedBackandTrackScore = function()
        {
            var answerFeedback = "",
                    correct = true,
                    l_options = [],
                    l_answer = [],
                    l_feedback = [],
                    selected = $("#optionHolder input"),
                    generalFeedback = "";

            if (x_currentPageXML.getAttribute("feedback") != undefined) {
                generalFeedback = "<p>" + x_addLineBreaks(x_currentPageXML.getAttribute("feedback")) + "</p>";
            }

            for (var i=0; i<selected.length; i++) {
                var optionIndex = $(selected[i]).parent().index(),
                        selectedOption = this.optionElements[optionIndex];

                correct = correct && (	(selectedOption.correct == "true" && $(selected[i]).is(':checked')) ||
                (selectedOption.correct == "false" && !$(selected[i]).is(':checked')));
                if ($(selected[i]).is(':checked')) {
                    answerFeedback += "<p>" + x_addLineBreaks(selectedOption.feedback) + "</p>";

                    l_options.push(optionIndex+1+"");
                    l_answer.push(selectedOption.text);
                    l_feedback.push(selectedOption.feedback);
                }
            }
            generalFeedback += answerFeedback;

            var singleRight = x_currentPageXML.getAttribute("singleRight");
            if (singleRight == undefined) {
                singleRight = "Your answer is correct";
            }
            var singleWrong = x_currentPageXML.getAttribute("singleWrong");
            if (singleWrong == undefined) {
                singleWrong = "Your answer is incorrect";
            }
            var multiRight = x_currentPageXML.getAttribute("multiRight");
            if (multiRight == undefined) {
                multiRight = "You have selected all the correct answers";
            }
            var multiWrong = x_currentPageXML.getAttribute("multiWrong");
            if (multiWrong == undefined) {
                multiWrong = "You have not selected the correct combination of answers";
            }

            var rightWrongTxt = "";
            // add correct feedback depending on if question overall has been answered correctly or not
            if (x_currentPageXML.getAttribute("type") == "Multiple Answer") {
                if (mcq.correctOption == true) { // there is a correct answer for question
                    if (correct == true) {
                        rightWrongTxt = '<p><br/>' + multiRight + '</p>';
                    } else {
                        rightWrongTxt = '<p><br/>' + multiWrong + '</p>';
                    }
                }
            } else {
                if (mcq.correctOption == true) { // there is a correct answer for question
                    if (correct == true) {
                        rightWrongTxt = '<p><br/>' + singleRight + '</p>';
                    } else {
                        rightWrongTxt = '<p><br/>' + singleWrong + '</p>';
                    }
                }
            }
            generalFeedback += rightWrongTxt;
            var feedbackLabel = x_currentPageXML.getAttribute("feedbackLabel");
            if (feedbackLabel == undefined) {
                feedbackLabel = "Feedback";
            }
            $("#feedback").html("<h3>" + feedbackLabel + "</h3>" + generalFeedback);

            if (x_currentPageXML.getAttribute("disableGlossary") == "true") {
                $("#feedback").find("a.x_glossary").contents().unwrap();
            }

            $(this).hide().show(); // hack to take care of IEs inconsistent handling of clicks

            // Queue reparsing of MathJax - fails if no network connection
            try { MathJax.Hub.Queue(["Typeset",MathJax.Hub]); } catch (e){}

            XTExitInteraction(x_currentPage, 0, correct, l_options, l_answer, l_feedback);
            XTSetPageScore(x_currentPage, (correct ? 100.0 : 0.0));
            if (XTGetMode() == "normal")
            {
                // Disable all options
                var i=0;
                for (i=0; i<mcq.currNrOptions; i++)
                {
                    $("#option"+i).attr("disabled", "disabled");
                }
            }
            // Queue reparsing of MathJax - fails if no network connection
            try { MathJax.Hub.Queue(["Typeset",MathJax.Hub]); } catch (e){}
        }

		this.init = function() {
			// correct attribute on option also not used as it doesn't mark correct/incorrect - only gives feedback for each answer
			var panelWidth = x_currentPageXML.getAttribute("panelWidth"),
				$splitScreen = $("#pageContents .splitScreen"),
				$textHolder = $("#textHolder");

			if (panelWidth == "Full") {
				$("#pageContents .panel").appendTo($("#pageContents"));
				$splitScreen.remove();
			} else {
				$textHolder.html(x_addLineBreaks(x_currentPageXML.getAttribute("instruction")));
				
				if (x_currentPageXML.getAttribute("disableGlossary") == "true") {
					$textHolder.find("a.x_glossary").contents().unwrap();
				}
				
				var textAlign = x_currentPageXML.getAttribute("align");
				if (textAlign != "Right") {
					if (panelWidth == "Small") {
						$splitScreen.addClass("large");
					} else if (panelWidth == "Large") {
						$splitScreen.addClass("small");
					} else {
						$splitScreen.addClass("medium");
					}
				} else {
					$textHolder
						.removeClass("left")
						.addClass("right")
						.appendTo($splitScreen);
					$("#infoHolder")
						.removeClass("right")
						.addClass("left");
					if (panelWidth == "Small") {
						$splitScreen.addClass("medium");
					} else if (panelWidth == "Large") {
						$splitScreen.addClass("xlarge");
					} else {
						$splitScreen.addClass("large");
					}
				}
			}

			$("#question").html(x_addLineBreaks(x_currentPageXML.getAttribute("prompt")));
			
			if (x_currentPageXML.getAttribute("disableGlossary") == "true") {
				$("#question").find("a.x_glossary").contents().unwrap();
			}
			
			var $optionHolder = $("#optionHolder");
			
			if ($(x_currentPageXML).children().length == 0) {
				$("#optionHolder").html('<span class="alert">' + x_getLangInfo(x_languageData.find("errorQuestions")[0], "noA", "No answer options have been added") + '</span>');
				$("#checkBtn").remove();
			} else {
				if (x_currentPageXML.getAttribute("type") == "Multiple Answer") {
					$optionHolder.find("input[type='radio']").remove();
				} else {
					$optionHolder.find("input[type='checkbox']").remove();
				}

				var $optionGroup = $optionHolder.find(".optionGroup");

				// Store the answers in a temporary array
				var elements = [];
				$(x_currentPageXML).children().each(function(i) {
					elements.push(
						{
							text:		this.getAttribute("text"),
							correct:	this.getAttribute("correct"),
							feedback:	this.getAttribute("feedback")
						}
					);
				});
				this.optionElements = elements;
				
				// Randomise the answers, if required
				if (x_currentPageXML.getAttribute("answerOrder") == 'random') {
					for (var tmp, j, k, i = this.optionElements.length; i--;) {
						j = Math.floor(Math.random() * this.optionElements.length);
						k = Math.floor(Math.random() * this.optionElements.length);
						tmp = this.optionElements[j];
						this.optionElements[j] = this.optionElements[k];
						this.optionElements[k] = tmp;
					}
				}
				
				$.each(this.optionElements, function(i, thisOption) {
						var $thisOptionGroup, $thisOption, $thisOptionTxt;
						if (i != 0) {
							$thisOptionGroup = $optionGroup.clone().appendTo($optionHolder);
						} else {
							$thisOptionGroup = $optionGroup;
						}
						$thisOption = $thisOptionGroup.find("input");
						$thisOptionTxt = $thisOptionGroup.find(".optionTxt");

						mcq.currNrOptions = i+1;

						$thisOption
							.attr({
								"value"		:thisOption.text,
								"id"		:"option" + i
								})
							.change(function() {
								$("#feedback").html("");
								var $checkBtn = $("#checkBtn"),
									$selected = $("#optionHolder input:checked");

								if ($checkBtn.attr("disabled") != "disabled" && $selected.length == 0) {
									$checkBtn.attr("disabled", "disabled");
								} else if ($checkBtn.attr("disabled") == "disabled" && $selected.length > 0) {
									$checkBtn.removeAttr("disabled");
								}
							})
							.focusin(function() {
								$thisOptionGroup.addClass("highlight");
							})
							.focusout(function() {
								$thisOptionGroup.removeClass("highlight");
							});

						$thisOptionTxt
							.attr("for", "option" + i)
							.data("option", $thisOption)
							.html(thisOption.text);
						
						if (x_currentPageXML.getAttribute("disableGlossary") == "true") {
							$thisOptionTxt.find("a.x_glossary").contents().unwrap();
						}
					});


				// checkBtnWidth attribute not used as button will be sized automatically
				// if language attributes aren't in xml will have to use english fall back
				var checkBtnTxt = x_currentPageXML.getAttribute("checkBtnTxt");
				if (checkBtnTxt == undefined) {
					checkBtnTxt = "Check";
				}
				var checkBtnTip = x_currentPageXML.getAttribute("checkBtnTip");
				if (checkBtnTip == undefined) {
					checkBtnTip = "Check Answer";
				}
				$("#checkBtn")
					.button({ label: checkBtnTxt })
					.attr("disabled", "disabled")
					.click(function() {
						mcq.showFeedBackandTrackScore();
						mcq.checked = true;
					});

				this.startQ();
			}
			
			this.sizeChanged();
			x_pageLoaded();
		}
	}

	mcq.init();

</script>

<style type="text/css">

	#pageContents .panel {
		overflow:	auto;
	}

	#optionHolder {
		margin-top:	15px;
	}

	#pageContents input {
		float:		left;
		display:	block;
	}

	#optionHolder .optionGroup {
		padding-top:	5px;
		padding-bottom:	5px;
	}

	#pageContents .optionTxt {
		cursor:			pointer;
		position:		relative;
		margin-left:	30px;
		display:		block;
	}

	#pageContents button {
		margin:		10px;
		float:		right;
	}

	#pageContents #feedback {
		clear:		both;
	}

</style>

<div id="pageContents">

	<div class="splitScreen">

		<div id="textHolder" class="left" tabindex="1"></div>

		<div id="infoHolder" class="right">
			<div class="panel">
				<h3 id="question"></h3>
				<div id="optionHolder">
					<div class="optionGroup">
						<input type="radio" name="option" />
						<input type="checkbox" name="option" />
						<label class="optionTxt"></label>
					</div>
				</div>
				<button id="checkBtn"></button>
				<div id="feedback"></div>
			</div>
		</div>

	</div>

</div>
*/});