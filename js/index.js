'use strict';

let state = {
	levelIsCompleted: [false, false, false, false, false, false],
	timeElapsed: 0,
	numLevelsCompleted: 0,
	currentLevel: 0,
	levelsGuessCount: [0,0,0,0,0,0,0],
	baseCases: ["2 4 6", "2 2 2", "3 3 3", "4 4 4", "5 5 5", "6 6 6", "7 7 7"],
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

 	let guessIsCorrect = testCase(var1, var2, var3);
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

 function levelChanged(newLevel) {
 	if (newLevel != state.currentLevel) {
 		$( "#current-base-case" ).text(state.baseCases[newLevel]);

		// Save elements so that they can be replaced when switching between levels
		state.guessedFalseCasesPerLevel[state.currentLevel] = document.querySelector('.false').innerHTML;
		state.guessedTrueCasesPerLevel[state.currentLevel] = document.querySelector('.correct').innerHTML;
		// Set HTML to the previous set of guesses
		state.currentLevel = newLevel;
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
 	let testHolder = $( ".testing-user-cases-container");

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
	if (isTrue == "true") {
		$("p[numcase=" + index + "]").removeClass("wrong-guess").addClass("correct-guess");
		state.currentGuessesOnTest[index] == true;
	} else {
		$("p[numcase=" + index + "]").removeClass("correct-guess").addClass("wrong-guess");
		state.currentGuessesOnTest[index] == false;
	}
});

$(document).on('click', '#submit-test-answers', function() {
	let allCorrect = true;
	state.correctTestAnswers.forEach(function(currentValue, index) {
		if (currentValue != state.currentGuessesOnTest) {
			allCorrect = false;
		}
	})

	if (allCorrect) {
		completedLevel();
	} else {
		failedLevel();
	}
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

 function generateLevelTest() {
 	if (state.currentLevel == 0) {
 		return generateLevelOneTest();
 	} else if (state.currentLevel == 1) {

 	} else if (state.currentLevel == 2) {

 	} else if (state.currentLevel == 3) {

 	} else if (state.currentLevel == 4) {

 	} else if (state.currentLevel == 5) {

 	} else if (state.currentLevel == 6) {

 	}
 }


 function generateLevelOneTest() {
 	let testArray = {
 		cases: [],
 		caseIsCorrect: [false, false, false, false, false]
 	};

 	for (var i = 0; i < 5; i++) {
 		var needTrueCase = false;
 		let var1 = Math.floor(Math.random() * 100);
 		let var2 = Math.floor(Math.random() * 100);
 		let var3 = Math.floor(Math.random() * 100);
 		let testPasses = testLevelOneInputs(var1, var2, var3);
 		testArray.cases.push(var1 + ", " + var2 + ", " + var3);
 		testArray.caseIsCorrect[i] = testPasses;
 	}

 	// DOES NOT have a true and a false case, try again
 	if (testArray.caseIsCorrect.indexOf(true) == -1 && testArray.caseIsCorrect.indexOf(false) == -1) {
 		return generateLevelOneTest;
 	}

 	state.correctTestAnswers = testArray.caseIsCorrect;
 	return testArray;
 }