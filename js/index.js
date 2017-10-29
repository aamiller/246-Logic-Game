'use strict';

let state = {
	levelIsCompleted: [false, false, false, false, false, false],
	timeElapsed: 0,
	totalTimePaused: 0,
	timePaused: 0,
	isPaused: true,
	timeBegan: 0,
	numLevelsCompleted: 0,
	currentLevel: 0,
	baseCases: [[2, 4, 6], [-1, 0, 1], [12, 16, 4], [2, 4, 8], [8, 1, 3], [4, 4, 4], [4, 2, 2]],
	guessedTrueCasesPerLevel: [" ", " ", " ", " ", " ", " ", " ", ""],
	guessedFalseCasesPerLevel: [" ", " ", " ", " ", " "," ", " ", ""],
	currentGuessesOnTest: [false, false, false, false, false],
	correctTestAnswers: [],
	currentClickedInputButton: 1,
	inTest: false,
	shuffleCases: [
	[[4, 6, 8],[102, 104, 108],[-10, -8, -2]],
	[[-2, 0, 1],[14, 0, -20],[-1, 0, -5]],
	[[96, 19, 59],[12, 56, 19],[0, 17, 64]],
	[[10, 10, 10],[27, 59, 12],[0, 21, 6]],
	[[12, 53, 10],[8, 43, 155],[6, 53, 12]],
	[[16, 81, 25],[81, 26, 16],[9, 100, 16]],
	[[1, 0, 1],[60, -10, 70],[-23, -10, -13]]
	]
}


function setUp() {
	$ ( "#make-a-level" ).show();
	$( '#domino-choices' ).append(convertNumToDomino("-0"))
	for (let k = -1; k < 2; k=k+2) {
		for (let i = 0; i < 10; i++) {
			if (i == 0 && k == -1) { i++; }
			$( '#domino-choices' ).append((convertNumToDomino(k*i)));
		}
	}
// Setup so dominoes render
levelChanged(1);
levelChanged(0);
}

setUp();


/*** Domino conversion and processing functions ****/
/*
 * Resets the input values and
 * registers the input, adding it
 * to the list of guesses the user has made on this
 * level.
 */
 function processInputs(var1, var2, var3) {
 	$( "#reset-input-vals" ).click();

 	let guessIsCorrect = testCase(parseInt(var1), parseInt(var2), parseInt(var3));
 	renderUserGuess(var1, var2, var3, guessIsCorrect);
 }

/*
* Takes in three numbers and returns
* them in domino image format.
*/
function convertToDomino(var1, var2, var3) {
	let var1Img = convertIndividualDigitsOfNum(var1);
	let var2Img = convertIndividualDigitsOfNum(var2);
	let var3Img = convertIndividualDigitsOfNum(var3);
	return var1Img.append(var2Img, var3Img);
}

/*
* Breaks down digits of number
* and returns domino conversion of entire
* number.
*/
function convertIndividualDigitsOfNum(number) {
	let output = $( '<div class="num-group"></div>');
	let numberStr = number + "";
	for (let i = 0; i < numberStr.length; i++) {
		if (numberStr.indexOf(" ") == -1) { // No space
			if (numberStr.indexOf('-') != -1 && numberStr.charAt(i) != "0") {
				if (i == 0) { i++; } // Skip negative
				output.append(convertNumToDomino("-" + numberStr.charAt(i)));
			} else {
				output.append(convertNumToDomino(numberStr.charAt(i)));

			}
		}
	}
	return output;
}

/*
* Takes in an array of 3 numbers, returns html
* for their domino display.
*/
function convertCaseArrayToDomino(inputArray) {
	return convertToDomino(inputArray[0], inputArray[1], inputArray[2]);
}

/*
* Takes in a single digit and returns
* an image element that will display that domino.
*/
function convertNumToDomino(number) {
	return $( '<img></img>').attr({src: "images/dominoes/" + number + "_domino.png", id: number, class: "domino-img", alt: "domino with number " + number})
}

/*** End domino conversion and processing functions ****/




/*** User entering own test cases management ***/
$( ".choose-index-button" ).click(function ( event ) {
 	// Stops other button from looking pressed
 	$( ".choose-index-button" ).removeClass("active");

 	// Makes currently clicked button look pressed
 	$( event.target ).addClass("active");

 	state.currentClickedInputButton = event.target.id.charAt(11);
 });

$( ".domino-img" ).click(function ( event )  {
	if (event.target.id != "-0") {
		let dominoToAdd = convertNumToDomino(event.target.id);

		$( "#guessed-domino-holder-" + state.currentClickedInputButton).append(dominoToAdd);  

} else { // Is color changing block

}
});


// Empties out current domino holding containers
$( "#reset-input-vals" ).click(function () {
	$( ".guessed-domino-holder" ).empty();
});

/*** End user entering own test cases management ***/





/*** Submit test case management ***/
/* 
 * Gets values from the inputs on
 * the user interface.
 */
 $( "#submit-test-case" ).click(function() {
 	let firstVal = collapseChildrenToNumber($( '#guessed-domino-holder-1' ));
 	let secondVal = collapseChildrenToNumber($( '#guessed-domino-holder-2' ));
 	let thirdVal = collapseChildrenToNumber($( '#guessed-domino-holder-3' ));

	// If values aren't numbers or any value is empty
	if ((isNaN(firstVal) | isNaN(secondVal) | isNaN(thirdVal)) |
		(firstVal == "" || secondVal == "" | thirdVal == "")) {
		// Do something to tell user there is an issue
} else {
	processInputs(firstVal, secondVal, thirdVal);
}
});

/*
* Takes in the children of 
* an element (should be containers for guessed dominoes).
* Returns a number that represents them.
*/
function collapseChildrenToNumber(parentElement) {
	let output = "";
	let isNegative = false;
	parentElement.children().each(function () {
		if (this.id.indexOf("-") == -1) {
			output = output + this.id;
		} else {
			output = output + this.id.substring(1);
			isNegative = true;
		}
	});
	if (isNegative) { output = "-" + output; }
	return output;
}

/*
 * Adds user input to list of past guesses.
 * Takes in integers and where or not guess
 * was correct.
 */
 function renderUserGuess(var1, var2, var3, wasCorrect) {
 	let guessElement = $( '<div class="rendered-guess"></div>').append(convertToDomino(var1, var2, var3));
	// Set class so that it will be displayed as true or false
	if (wasCorrect) {
		guessElement.addClass('correct-guess');
		$( ".correct" ).append(guessElement);
	} else { 
		guessElement.addClass('wrong-guess'); 
		$( ".false" ).append(guessElement);
	}
}
/*** End submit test case management ***/



/* 
 * New level is clicked.
 * Change base case and level
 * in state.
 */ 
 $( "#case-1" ).click(function() {
 	levelChanged(0);
 });
 $( "#case-2" ).click(function() {
 	levelChanged(1);
 }); 
 $( "#case-3" ).click(function() {
 	levelChanged(2);
 });
 $( "#case-4" ).click(function() {
 	levelChanged(3); 	
 });
 $( "#case-5" ).click(function() {
 	levelChanged(4);
 });
 $( "#case-6" ).click(function() {
 	levelChanged(5);
 });
 $( "#case-7" ).click(function() {
 	levelChanged(6);	
 });

/*
* Changes the level to the input
* level, changing the guessses the user has made
* on that level as well.
*/
function levelChanged(newLevel) {
	if (state.isPaused) {
		$('.form-group, .guesses-container, .base-case-container, .game-details-container, #guess-label').show();
		 document.getElementById("pause-button").click(); // Unpause timer
		 $( ".level-builder").hide();
		}

		if (newLevel != state.currentLevel && !state.inTest) {
			$( "#current-base-case" ).html(convertCaseArrayToDomino(state.baseCases[newLevel]));
			$( ".base-case-container" ).show();
			$ ( "#make-a-level" ).hide();
		// Save elements so that they can be replaced when switching between levels
		state.guessedFalseCasesPerLevel[state.currentLevel] = document.querySelector('.false').innerHTML;
		state.guessedTrueCasesPerLevel[state.currentLevel] = document.querySelector('.correct').innerHTML;
		// Set HTML to the previous set of guesses
		state.currentLevel = newLevel;
		$( '#base-case-title' ).text('Level ' + (newLevel + 1));
		document.getElementById('c').innerHTML = (state.guessedTrueCasesPerLevel[state.currentLevel]);
		document.getElementById('f').innerHTML = (state.guessedFalseCasesPerLevel[state.currentLevel]);
	}
}

/*
 * Gives the user 5 test cases.
 * If the users correctly says that
 * each is true or false, they have completed the level.
 */
 $( "#test-user" ).click(function() {
 	state.inTest = true;
	// Hides users previous guesses, saving them first
	state.guessedFalseCasesPerLevel[state.currentLevel] = document.querySelector('.false').innerHTML;
	state.guessedTrueCasesPerLevel[state.currentLevel] = document.querySelector('.correct').innerHTML;
	document.getElementById('c').innerHTML = ('');
	document.getElementById('f').innerHTML = ('');

	// Hides buttons and input boxes to make space for test cases
	$('.form-group, .guesses-container,  #guess-categories, #guess-placeholder-text, #guess-label, .guessed-domino-holder, #domino-choices').hide();

	// Generates 5 cases that the user can select as correct/incorrect

	let levelTestCases = generateLevelTest();

	// If custom level
	if (levelTestCases.cases[0] == 7) {
		state.correctTestAnswers = cases.testCaseWorks;
		levelTestCases.cases = cases.testCases;
	} else { // If not custom level
		state.correctTestAnswers = levelTestCases.caseIsCorrect;
	}

	let testHolder = $( ".testing-user-cases-container");

	// Add each test case and a T/F button
	levelTestCases.cases.forEach(function(currentValue, index) {
		let newCase = $('<div class="dominoes-holder"></div>');

		newCase.html(convertCaseArrayToDomino(currentValue));
		newCase.attr("numCase", index);

		let trueButton = $('<button class="btn btn-success tfButton">T</button>');
		let falseButton = $('<button class="btn btn-danger tfButton">F</button>');
		trueButton.attr({tF:true, index: index});
		falseButton.attr({tF:false, index: index});

		newCase.append($('<br>'));
		newCase.append(trueButton, falseButton);
		testHolder.append(newCase);
	})

	testHolder.append($('<button class="btn btn-primary" id="submit-test-answers">Submit Guesses</button>'));
	// Has submit button + modal that says to try again
	//$('.form-group, .guesses-container').show();

});

/* Click on true or false button
* Updates what the current user guesses are in the
* state.
*/
$(document).on('click', '.tfButton', function() {
	let isTrue = $(this).attr('tF');
	let index = $(this).attr('index')

	// Change the color of the output test on screen
	// so the user can see what their guesses are.
	if (isTrue == "true") {
		$("div[numcase=" + index + "]").removeClass("wrong-guess").addClass("correct-guess");
		state.currentGuessesOnTest[index] = true;
	} else {
		$("div[numcase=" + index + "]").removeClass("correct-guess").addClass("wrong-guess");
		state.currentGuessesOnTest[index] = false;
	}
});

// Submits and tests the users guesses
// against the correct answers for that test.
$(document).on('click', '#submit-test-answers', function() {
	let allCorrect = true;
	state.correctTestAnswers.forEach(function(currentValue, index) {
		if (currentValue != state.currentGuessesOnTest[index]) {
			allCorrect = false;
		}
	});

	if (allCorrect) {
		if (state.levelIsCompleted[state.currentLevel]) {
			state.numLevelsCompleted--;
		}
		completedLevel();
		state.inTest = false;
	} else {
		failedLevel();

	}
});


/*
* Marks level user is on as completed.
*/ 
function completedLevel() {
	if (state.currentLevel == 7) {
		$( "#input-level" ).addClass('success').removeClass("primary");
	}
	let level = state.currentLevel;
	$( '#case-' + (level + 1) ).removeClass("btn-info").addClass("btn-success");
	state.numLevelsCompleted++;
	$( '#case-completed' ).text("Cases Completed: " + state.numLevelsCompleted)
	state.levelIsCompleted[level] == true;
	if (state.numLevelsCompleted == 7) { gameWon(); }

	// Reset interface, clearing tests and re-showing containers
	$( '.form-group, .guesses-container, #guess-placeholder-text, #guess-label, .guessed-domino-holder, #domino-choices' ).show();
	$( '.testing-user-cases-container' ).empty();

	// Switch to next level
	if (state.currentLevel < 6) {
		levelChanged(state.currentLevel + 1);
	}
}

// If answers incorrect, asks user if they want to try again.
// If not, hides the user testing part of the game.
function failedLevel() {
	if (confirm("Your guesses were incorrect. Want to change your answers?")) {
		// Do nothing, let them change their answers
	} else {
		$( '.form-group, .guesses-container, #guess-placeholder-text, #guess-label, .guessed-domino-holder, #domino-choices' ).show();
		$( '.testing-user-cases-container' ).empty();
		state.inTest = false;

	}
}


/*** Test generation and test case evaluation ***/

/*
 * Takes in the three input values
 * and returns true if they satisfy the current
 * level's pattern.
 */
 function testCase(var1, var2, var3) {
 	if (state.currentLevel == 0) {
 		return testLevelOneInputs(var1, var2, var3);
 	} else if (state.currentLevel == 1) {
 		return testLevelTwoInputs(var1, var2, var3);
 	} else if (state.currentLevel == 2) {
 		return testLevelThreeInputs(var1, var2, var3);
 	} else if (state.currentLevel == 3) {
 		return testLevelFourInputs(var1, var2, var3);
 	} else if (state.currentLevel == 4) {
 		return testLevelFiveInputs(var1, var2, var3);
 	} else if (state.currentLevel == 5) {
 		return testLevelSixInputs(var1, var2, var3);
 	} else if (state.currentLevel == 6) {
 		return testLevelSevenInputs(var1, var2, var3);
 	} else if (state.currentLevel == 7) {
 		return myRule(var1, var2, var3);
 	}
 }

/*
 * Level 1:
 * Numbers must be increasing.
 */
 function testLevelOneInputs(var1, var2, var3) {
 	return var3 > var2 && var2 > var1;
 }

 /*
 * Level 2:
 * At least one number must be negative.
 */
 function testLevelTwoInputs(var1, var2, var3) {
 	return var1 < 0 | var2 < 0 | var3 < 0;
 }

 /*
 * Level 3:
 * Must include a '6'.
 */
 function testLevelThreeInputs(var1, var2, var3) {
 	return (var1 + '').indexOf('6') > -1 |
 	(var2 + '').indexOf('6') > -1 |
 	(var3 + '').indexOf('6') > -1;
 }

 /*
 * Level 4:
 * Last number must be an even number.
 */
 function testLevelFourInputs(var1, var2, var3) {
 	return var3 % 2 == 0;
 }

 /*

 * Level 5:
 * A number includes a closed circle.
 */
 function testLevelFiveInputs(var1, var2, var3) {
 	return containsClosedCircleNum(var1) | 
 	containsClosedCircleNum(var2) |
 	containsClosedCircleNum(var3);
 }

// Helper function that returns true
// if closed circle numbers present.
function containsClosedCircleNum(varInput) {
	let variable = varInput + "";
	return variable.indexOf("8") != -1 |
	variable.indexOf("0") != -1 |
	variable.indexOf("9") != -1 |
	variable.indexOf("6") != -1;
}

 /*
 * Level 6:
 * Numbers must all have integer square roots.
 */
 function testLevelSixInputs(var1, var2, var3) {
 	return Number.isInteger(Math.sqrt(var1)) &&
 	Number.isInteger(Math.sqrt(var2)) &&
 	Number.isInteger(Math.sqrt(var3));
 }

 /*
 * Level 7:
 * Numbers must sum to 0
 * where the first number is negated.
 */
 function testLevelSevenInputs(var1, var2, var3) {
 	return (-1*var1 + var2 + var3) == 0;
 }

/*
* Based on the current level the user is on,
* returns an array with details about a set of
* cases for testing if the user understands
* the level rule. 
* Note: not all can use generateTest
* because random test creation is too memory intensive.
*/
function generateLevelTest() {
	if (state.currentLevel == 0) {
		return generateTest(testLevelOneInputs);
	} else if (state.currentLevel == 1) {
		return {
			cases: [[0, 1, 2], 
			[-2, 123, -3], 
			[-3, -10, -84],
			[81, 9, 3],
			[12, -18, 4]],
			caseIsCorrect: [false, true, true, false, true]};
		} else if (state.currentLevel == 2) {
			return {
				cases: [[18, 90, 16], 
				[-6, 45, -1], 
				[3, 3, 8],
				[-1, 75, 88],
				[19, 0, 1]],
				caseIsCorrect: [true, true, false, false, false]};
			} else if (state.currentLevel == 3) {
				return generateTest(testLevelFourInputs);
			} else if (state.currentLevel == 4) {
				return {
					cases: [[18, 90, 16], 
					[-6, 45, -1], 
					[3, 3, 1],
					[-1, 75, 88],
					[19, 0, 11]],
					caseIsCorrect: [true, true, false, true, true]};
				} else if (state.currentLevel == 5) {
					return {
						cases: [[18, 90, 16], 
						[-6, 45, -1], 
						[64, 2, 36],
						[36, 4, 144],
						[19, 0, 11]],
						caseIsCorrect: [false, false, false, true, false]};
					} else if (state.currentLevel == 6) {
						return {
							cases: [[4, 2, 2], 
							[39, 13, 26], 
							[-9, -3, -6],
							[13, 4, 92],
							[19, 0, 11]],
							caseIsCorrect: [true, true, true, false, false]};
						} else if (state.currentLevel == 7) {
							return {cases: [7], caseIsCorrect: [false]}; 
						}
					}

/*
* Takes in a function and creates
* and returns arrays with test cases that either
* pass or fail based on the input function's rules.
* The function input returns true if the input variables
* satisfy the rule. The cases output will always include one
* true case and one false case.
*/
function generateTest(testLevelInputs) {
	let testArray = {
		cases: [],
		caseIsCorrect: [false, false, false, false, false]
	};

	for (var i = 0; i < 5; i++) {
		var needTrueCase = false;
		// Introduces a 1/10 chance of having a negative #
		let var1 = Math.floor((Math.random() - .3) * 100);
		let var2 = Math.floor((Math.random() - .3) * 100);
		let var3 = Math.floor((Math.random() - .3) * 100);
		let testPasses = testLevelInputs(var1, var2, var3);
		testArray.cases.push([var1,var2,var3]);
		testArray.caseIsCorrect[i] = testPasses;
	}

	// DOES NOT have a true and a false case, try again
	// This does not recurse to avoid causing a stack error
	if (testArray.caseIsCorrect.indexOf(true) == -1 | testArray.caseIsCorrect.indexOf(false) == -1) {
		return generateTest(testLevelInputs);
	}

	return testArray;
}

/*** End Test generation and test case evaluation ***/




/*** Timer code ***/
// On the first click of the first input box, 
// the timer starts.
$( document.body ).one("click", function () {
	if (state.isPaused) {
		state.isPaused = false;
	}
	$( '#pause-button' ).text('Pause Timer');

});

$( "#pause-button" ).click(function () {
	if (!state.isPaused) {
		state.isPaused = true;
		state.timePaused = Date.now();
		$( '#pause-button' ).text('Unpause');
	} else {
		state.isPaused = false;
		if (state.timePaused != 0) {
			$( '#pause-button' ).text('Pause Timer');
			state.totalTimePaused = state.totalTimePaused + (Date.now() - state.timePaused);
		}
	}
});

window.setInterval(updateTimer, 1000);

/*
* Gets difference in milliseconds between
* time started and time ended.
*/
function updateTimer() {
	if (state.isPaused == false) {
		if (state.timeBegan == 0) { state.timeBegan = new Date(); }
		state.timeElapsed = (new Date()) - state.timeBegan - state.totalTimePaused;
		$ ( '#time' ).text("Time Playing: " + Math.floor((state.timeElapsed / 1000) / 60) + ":" + Math.floor(state.timeElapsed / 1000)%60);
	}
}
/*** End timer code ***/



/*
* Executes when game is won.
* Resets variables in the state and display.
*
*/
function gameWon() {
	state.levelIsCompleted = [false, false, false, false, false, false];
	state.timeElapsed = 0;
	currentClickedInputButton = 1;
	state.totalTimePaused = 0;
	state.timePaused = 0;
	state.isPaused = false;
	state.timeBegan =  0;
	state.numLevelsCompleted = 0;
	state.currentLevel =  0;
	state.levelsGuessCount = [0,0,0,0,0,0,0];
	state.guessedTrueCasesPerLevel = [" ", " ", " ", " ", " ", " ", " "];
	state.guessedFalseCasesPerLevel = [" ", " ", " ", " ", " "," ", " "];
	$( '#case-completed' ).text("Cases Completed: " + state.numLevelsCompleted);

	for (var level = 0; level < 7; level++) {
		$( '#case-' + (level + 1) ).removeClass("btn-success").addClass("btn-info");
	}
	document.querySelector('.false').innerHTML = "";
	document.querySelector('.correct').innerHTML = "";

	levelChanged(0);

	$('#winModal').modal('show');
}


$( "#shake-domino" ).on("click", function () {
	// Chooses 1 of three possible shuffle-able base cases and displays it.
	$( "#current-base-case" ).html(convertCaseArrayToDomino(state.shuffleCases[state.currentLevel][Math.floor(Math.random() * 3)]));
});



/** User making own case handling **/

$( "#input-level" ).on("click", function () {
	if (state.inTest == false) {
		$( ".base-case-container" ).hide();
		$ ( "#make-a-level" ).show();
	}
});


// Only do-able once
$( "#render-user-input-case" ).one("click", function () {
	let inputFunction = $( "textarea#user-function" ).val();
	let inputState = $( "textarea#input-state" ).val();

	var script = "<script type=\"text/javascript\">" + inputFunction + inputState + "</script>";
 	// using jquery next
    $('body').append(script); //incorporates and executes

    // Redisplay main game components
    $( ".base-case-container" ).show();
    $ ( "#make-a-level" ).hide();

    state.currentLevel = 7;

    $( "#current-base-case" ).html(convertCaseArrayToDomino(cases.baseCase));
		// Save elements so that they can be replaced when switching between levels
		$( '#base-case-title' ).text('Your Level');

	});


/** end user making own case handling **/

// Button quick select for user inputting
// test cases. Code adapted from stack overflow
$(document).keypress(function(e) {
	console.log(e.which);
 if (e.which === 49) { //1 key
 	console.log("1");
 	$ ( '#task-input-1' ).click();
    } else if (e.which === 50) { //2 key
    	$ ( '#task-input-2' ).click();
    } else if (e.which === 51) { //3 key
    	$ ( '#task-input-3' ).click();
    }
});