'use strict';

let state = {
	levelIsCompleted: [false, false, false, false, false, false],
	timeElapsed: 0,
	numLevelsCompleted: 0,
	currentLevel: 0
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

	let guessIsCorrect = testCase(var1, var2, var3);
	renderUserGuess(var1, var2, var3, guessIsCorrect);
}

/*
 * Adds user input to list of past guesses.
 *
 */

function renderUserGuess(var1, var2, var3, wasCorrect) {
	let guessStringHtml = var1 + ", " + var2 + ", " + var3;
	let newGuess = $('<div class="guess"></div>');
	newGuess.text(guessStringHtml);


	// Set class so that it will be displayed as true or false
	if (wasCorrect) { newGuess.addClass('correct-guess'); } 
	else { newGuess.addClass('wrong-guess'); }
	$( ".guesses-container" ).append(newGuess);
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
 * Gives the user 5 test cases.
 * If the users correctly says that
 * each is true or false, they have completed the level.
 */
$( "#test-user" ).click(function() {

});


/*
 * Takes in the three input values
 * and returns true if they satisfy the current
 * level's pattern.
 */
function testCase(var1, var2, var3) {
	if (state.currentLevel == 0) {
		return testLevelOneInputs(var1, var2, var3);
	} else if (state.currentLevel == 1) {

	} else if (state.currentLevel == 2) {
		
	} else if (state.currentLevel == 3) {
		
	} else if (state.currentLevel == 4) {
		
	} else if (state.currentLevel == 5) {
		
	} else if (state.currentLevel == 6) {
		
	}
}

/*
 * Level 1:
 * Numbers must be increasing.
 */
function testLevelOneInputs(var1, var2, var3) {
	return var3 > var2 && var2 > var1;
}