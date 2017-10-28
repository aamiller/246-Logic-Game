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
	levelsGuessCount: [0,0,0,0,0,0,0],
	baseCases: ["2, 4, 6", "-1, 0, 1", "12, 16, 4", "2, 4, 8", "8, 1, 3", "4, 4, 4", "4, 2, 2"],
	guessedTrueCasesPerLevel: [" ", " ", " ", " ", " ", " ", " "],
	guessedFalseCasesPerLevel: [" ", " ", " ", " ", " "," ", " "],
	currentGuessesOnTest: [false, false, false, false, false],
	correctTestAnswers: []
}

/*
 * Resets the input values and
 * registers the input, adding it
 * to the list of guesses the user has made on this
 * level.
 */
 function processInputs(var1, var2, var3) {
 	$( "#task-input-1" ).val('');
 	$( "#task-input-2" ).val('');
 	$( "#task-input-3" ).val('');

	// Increment guesses
	state.levelsGuessCount[state.currentLevel]++;

	let guessIsCorrect = testCase(parseInt(var1), parseInt(var2), parseInt(var3));
	renderUserGuess(var1, var2, var3, guessIsCorrect);
}

/*
 * Adds user input to list of past guesses.
 *
 */

 function renderUserGuess(var1, var2, var3, wasCorrect) {
 	let guessStringHtml = var1 + ", " + var2 + ", " + var3;
 	let newGuess = $('<p class="guess"></p>');
 	newGuess.text(guessStringHtml);


	// Set class so that it will be displayed as true or false
	if (wasCorrect) {
		newGuess.addClass('correct-guess');
		$( ".correct" ).append(newGuess);
	} else { 
		newGuess.addClass('wrong-guess'); 
		$( ".false" ).append(newGuess);
	}

}


/* 
 * Gets values from the inputs on
 * the user interface.
 */
 $( "#submit-test-case" ).click(function() {
 	let firstVal = document.getElementById('task-input-1').value;
 	let secondVal = document.getElementById('task-input-2').value;
 	let thirdVal = document.getElementById('task-input-3').value;

	// If values aren't numbers or any value is empty
	if ((isNaN(firstVal) | isNaN(secondVal) | isNaN(thirdVal)) |
		(firstVal == "" || secondVal == "" | thirdVal == "")) {
		// Do something to tell user there is an issue
} else {
	processInputs(firstVal, secondVal, thirdVal);
}
});


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
	if (newLevel != state.currentLevel) {
		$( "#current-base-case" ).text(state.baseCases[newLevel]);

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
	// Hides users previous guesses, saving them first
	state.guessedFalseCasesPerLevel[state.currentLevel] = document.querySelector('.false').innerHTML;
	state.guessedTrueCasesPerLevel[state.currentLevel] = document.querySelector('.correct').innerHTML;
	document.getElementById('c').innerHTML = ('');
	document.getElementById('f').innerHTML = ('');

	// Hides buttons and input boxes to make space for test cases
	$('.form-group, .guesses-container').hide();

	// Generates 5 cases that the user can select as correct/incorrect

	let levelTestCases = generateLevelTest();
	state.correctTestAnswers = levelTestCases.caseIsCorrect;

	let testHolder = $( ".testing-user-cases-container");

	// Add each test case and a T/F button
	levelTestCases.cases.forEach(function(currentValue, index) {
		let newCase = $('<p class="guess"></p>');
		newCase.text(currentValue);
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
		$("p[numcase=" + index + "]").removeClass("wrong-guess").addClass("correct-guess");
		state.currentGuessesOnTest[index] = true;
	} else {
		$("p[numcase=" + index + "]").removeClass("correct-guess").addClass("wrong-guess");
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
	} else {
		failedLevel();

	}
});


/*
* Marks level user is on as completed.
*/ 
function completedLevel() {
	let level = state.currentLevel;
	$( '#case-' + (level + 1) ).removeClass("btn-info").addClass("btn-success");
	state.numLevelsCompleted++;
	$( '#case-completed' ).text("Cases Completed: " + state.numLevelsCompleted)
	state.levelIsCompleted[level] == true;
	if (state.numLevelsCompleted == 7) { gameWon(); }

	// Reset interface, clearing tests and re-showing containers
	$( '.form-group, .guesses-container' ).show();
	$( '.testing-user-cases-container' ).empty();

	// Switch to next level
	if (state.currentLevel < 6) {
		levelChanged(state.currentLevel + 1);
	} else {
	// Some congrats for finishing all the levels
	}
}

// If answers incorrect, asks user if they want to try again.
// If not, hides the user testing part of the game.
function failedLevel() {
	if (confirm("Your guesses were incorrect. Want to change your answers?")) {
		// Do nothing, let them change their answers
	} else {
		$( '.form-group, .guesses-container' ).show();
		$( '.testing-user-cases-container' ).empty();
	}
}


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
			cases: ["0, 1, 2", 
			"-2, 123, -3", 
			"-3, -10, -84",
			"81, 9, 3",
			"12, -18, 4"],
			caseIsCorrect: [false, true, true, false, true]};
		} else if (state.currentLevel == 2) {
			return {
				cases: ["18, 90, 16", 
				"-6, 45, -1", 
				"3, 3, 8",
				"-1, 75, 88",
				"19, 0, 1"],
				caseIsCorrect: [true, true, false, false, false]};
			} else if (state.currentLevel == 3) {
				return generateTest(testLevelFourInputs);
			} else if (state.currentLevel == 4) {
				return {
					cases: ["18, 90, 16", 
					"-6, 45, -1", 
					"3, 3, 1",
					"-1, 75, 88",
					"19, 0, 11"],
					caseIsCorrect: [true, true, false, true, true]};
				} else if (state.currentLevel == 5) {
					return {
						cases: ["18, 90, 16", 
						"-6, 45, -1", 
						"64, 2, 36",
						"36, 4, 144",
						"19, 0, 11"],
						caseIsCorrect: [false, false, false, true, false]};
					} else if (state.currentLevel == 6) {
						return {
							cases: ["4, 2, 2", 
							"39, 13, 26", 
							"-9, -3, -6",
							"13, 4, 92",
							"19, 0, 11"],
							caseIsCorrect: [true, true, true, false, false]};
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
		testArray.cases.push(var1 + ", " + var2 + ", " + var3);
		testArray.caseIsCorrect[i] = testPasses;
	}

	// DOES NOT have a true and a false case, try again
	// This does not recurse to avoid causing a stack error
	if (testArray.caseIsCorrect.indexOf(true) == -1 | testArray.caseIsCorrect.indexOf(false) == -1) {
		return generateTest(testLevelInputs);
	}

	return testArray;
}



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