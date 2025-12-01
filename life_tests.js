// simple QA script made by Ted Athon
// to run, open the Conway's Game of Life game in your browser and type "runAllTests()" into the developer console

// helper that creates a small floating panel to show test results
function getTestOutputBox() {
	// try to find an existing output box in the document
	let box = document.getElementById("lifeTestOutput");
	if (!box) {
		// create the box if it does not exist yet
		box = document.createElement("div");
		box.id = "lifeTestOutput";
		// simple styling for the test output box
		box.style.position = "fixed";
		box.style.right = "10px";
		box.style.top = "10px";
		box.style.width = "280px";
		box.style.maxHeight = "60vh";
		box.style.overflowY = "auto";
		box.style.background = "rgba(0, 0, 0, 0.8)";
		box.style.color = "white";
		box.style.fontFamily = "monospace";
		box.style.fontSize = "12px";
		box.style.padding = "8px";
		box.style.borderRadius = "8px";
		box.style.zIndex = "9999";
		box.style.whiteSpace = "pre-wrap";
		box.style.pointerEvents = "auto";
		// attach the box to the page so the user can see it
		document.body.appendChild(box);
	}
	return box;
}

// helper that prints one line into the panel and into the console
function logTestLine(text) {
	// get the output panel so we can write into it
	const box = getTestOutputBox();
	// append the new line of text and add a newline character
	box.textContent += text + "\n";
	// also print the same line into the browser console
	console.log(text);
}

// helper that mutes sound for test runs so the tests do not spam audio
function muteSoundForTests() {
	// find the mute button from the game UI
	const muteBtn = document.getElementById("muteBtn");
	// only click the button if it is currently in the mute state
	if (muteBtn && muteBtn.textContent.trim() === "Mute") {
		muteBtn.click();
	}
}

// helper that makes sure we work with a clean 20 by 20 grid
function resetToEmptyBoard() {
	// pause the simulation so generations do not change during tests
	if (typeof pause === "function") {
		pause();
	}

	// force grid size to a known 20x20 so tests always use the same layout
	if (typeof applyGridSize === "function") {
		applyGridSize(20, 20);
		// update the number inputs to match the grid size
		const rowsInput = document.getElementById("rowsInput");
		const colsInput = document.getElementById("colsInput");
		if (rowsInput) {
		rowsInput.value = 20;
		}
		if (colsInput) {
		colsInput.value = 20;
		}
	}

	// make sure we are using single cell mode and not a shape
	const shapeSelect = document.getElementById("shapeSelect");
	if (shapeSelect) {
		if (shapeSelect.value !== "none") {
		shapeSelect.value = "none";
		// fire a change event so the game logic updates the selected shape
		const changeEvent = new Event("change", { bubbles: true });
		shapeSelect.dispatchEvent(changeEvent);
		}
	}

	// clear the grid using the same button the user clicks
	const clearBtn = document.getElementById("clearBtn");
	if (clearBtn) {
		clearBtn.click();
	}
}

// helper that returns an array of [row, col] for every alive cell
function getAliveCells() {
	// find all cells that are currently marked as alive
	const cells = document.querySelectorAll(".cell.alive");
	const alive = [];
	// convert each alive cell into a pair of row and column numbers
	cells.forEach((cell) => {
		const r = parseInt(cell.dataset.row, 10);
		const c = parseInt(cell.dataset.col, 10);
		alive.push([r, c]);
	});
	// sort the coordinates so test comparisons are stable
	alive.sort((a, b) => {
		if (a[0] !== b[0]) {
		return a[0] - b[0];
		}
		return a[1] - b[1];
	});
	// return the full list of alive cells
	return alive;
}

// helper that checks if a specific cell is alive
function isCellAlive(row, col) {
	// build a selector that matches a cell at the given row and column
	const selector = '.cell[data-row="' + row + '"][data-col="' + col + '"]';
	const cell = document.querySelector(selector);
	// if there is no matching cell we treat it as dead
	if (!cell) {
		return false;
	}
	// check if the cell has the alive class
	return cell.classList.contains("alive");
}

// helper that clicks a cell at a given row and column
function clickCell(row, col) {
	// build a selector string for the target cell
	const selector = '.cell[data-row="' + row + '"][data-col="' + col + '"]';
	const cell = document.querySelector(selector);
	// throw an error if the cell could not be found
	if (!cell) {
		throw new Error("could not find cell at row " + row + " col " + col);
	}
	// trigger a click event to reuse the normal game click logic
	cell.click();
}

// helper that clicks the next generation button once
function stepOneGeneration() {
	// locate the next generation button from the controls
	const nextBtn = document.getElementById("nextBtn");
	if (!nextBtn) {
		throw new Error("next generation button not found");
	}
	// trigger a click to advance the game by one generation
	nextBtn.click();
}

// helper that reads the current generation and population numbers from the page
function getStats() {
	// grab the text elements for generation and population
	const genEl = document.getElementById("genCount");
	const popEl = document.getElementById("popCount");
	// parse the numbers from the text content or default to zero
	const gen = genEl ? parseInt(genEl.textContent, 10) : 0;
	const pop = popEl ? parseInt(popEl.textContent, 10) : 0;
	// return an object that bundles both values
	return { generation: gen, population: pop };
}

// helper that compares two arrays of coordinate pairs
function coordsEqual(a, b) {
	// if the lengths are different they cannot be equal
	if (a.length !== b.length) {
		return false;
	}
	// compare every pair in order
	for (let i = 0; i < a.length; i++) {
		if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
		return false;
		}
	}
	// reach here only if all coordinates match
	return true;
}

// test that a 2 by 2 block stays the same over many generations
function testBlockStillLife() {
	resetToEmptyBoard(); // start from a fresh empty board

	// define the four cells that form the 2 by 2 block
	const cellsToTurnOn = [
		[5, 5],
		[5, 6],
		[6, 5],
		[6, 6],
	];
	// turn each of these cells on by clicking them
	cellsToTurnOn.forEach(([r, c]) => clickCell(r, c));

	// record the initial set of alive cells
	const initialAlive = getAliveCells();
	if (initialAlive.length !== 4) {
		return {
		name: "block still life",
		passed: false,
		details: "expected 4 alive cells at start",
		};
	}

	// run two generations and check that the shape does not change
	stepOneGeneration();
	stepOneGeneration();
	const afterAlive = getAliveCells();
	const passed = coordsEqual(initialAlive, afterAlive);

	// return a simple result object for this test
	return {
		name: "block still life",
		passed,
		details: passed
		? "2 by 2 block did not change after 2 generations"
		: "2 by 2 block changed when it should stay the same",
	};
}

// test that a blinker oscillates between vertical and horizontal
function testBlinkerOscillator() {
	resetToEmptyBoard(); // start from a fresh empty board

	// build a vertical blinker shape around the center position
	const vertical = [
		[5, 5],
		[6, 5],
		[7, 5],
	];
	vertical.forEach(([r, c]) => clickCell(r, c));

	// save the starting layout of the blinker
	const startAlive = getAliveCells();

	// first step should create a horizontal line
	stepOneGeneration();
	const aliveAfterOne = getAliveCells();
	const expectedHorizontal = [
		[6, 4],
		[6, 5],
		[6, 6],
	];
	// check whether the actual cells match the expected horizontal layout
	const horizontalMatches = coordsEqual(aliveAfterOne, expectedHorizontal);

	// second step should return to the original vertical line
	stepOneGeneration();
	const aliveAfterTwo = getAliveCells();
	const backToStart = coordsEqual(aliveAfterTwo, startAlive);

	// test passes only if both checks succeed
	const passed = horizontalMatches && backToStart;
	let detailText;
	if (!horizontalMatches) {
		detailText = "after 1 generation blinker did not become horizontal in the expected place";
	} else if (!backToStart) {
		detailText = "after 2 generations blinker did not return to its original shape";
	} else {
		detailText = "blinker changed from vertical to horizontal and then back again";
	}

	return {
		name: "blinker oscillator",
		passed,
		details: detailText,
	};
}

// test that a dead cell with exactly three neighbors becomes alive
function testReproductionRule() {
	resetToEmptyBoard(); // start from a fresh empty board

	// place three neighbors around the center where the new cell should appear
	const neighbors = [
		[4, 5],
		[5, 4],
		[5, 6],
	];
	neighbors.forEach(([r, c]) => clickCell(r, c));

	// record whether the center cell is alive before stepping
	const targetRow = 5;
	const targetCol = 5;
	const wasAliveBefore = isCellAlive(targetRow, targetCol);

	// advance the simulation by one generation
	stepOneGeneration();
	const isAliveAfter = isCellAlive(targetRow, targetCol);
	const passed = !wasAliveBefore && isAliveAfter;

	return {
		name: "reproduction rule",
		passed,
		details: passed
			? "dead center cell with three neighbors became alive after one generation"
			: "center cell did not follow the reproduction rule",
		};
}

// test that a lonely cell dies from underpopulation
function testUnderpopulationRule() {
	resetToEmptyBoard(); // start from a fresh empty board

	// turn on a single isolated cell
	const r = 5;
	const c = 5;
	clickCell(r, c);

	// check that the cell is alive before the step
	const aliveBefore = isCellAlive(r, c);
	// run one generation and then check again
	stepOneGeneration();
	const aliveAfter = isCellAlive(r, c);
	const passed = aliveBefore && !aliveAfter;

	return {
		name: "underpopulation rule",
		passed,
		details: passed
			? "single live cell died after one generation as expected"
			: "single live cell did not die from underpopulation",
		};
}

// test that a crowded cell dies from overpopulation
function testOverpopulationRule() {
	resetToEmptyBoard(); // start from a fresh empty board

	// define the center cell and its four neighbors
	const center = [5, 5];
	const neighbors = [
		[4, 5],
		[6, 5],
		[5, 4],
		[5, 6],
	];

	// turn on the center cell
	clickCell(center[0], center[1]);
	// turn on all surrounding neighbor cells
	neighbors.forEach(([r, c]) => clickCell(r, c));

	// confirm that the center cell is alive before stepping
	const aliveBefore = isCellAlive(center[0], center[1]);
	// advance one generation to trigger the rules
	stepOneGeneration();
	const aliveAfter = isCellAlive(center[0], center[1]);
	const passed = aliveBefore && !aliveAfter;

	return {
		name: "overpopulation rule",
		passed,
		details: passed
			? "center cell with more than three neighbors died after one generation"
			: "center cell with many neighbors did not die from overpopulation",
		};
}

// test that the clear button wipes the board and resets stats
function testClearButton() {
	resetToEmptyBoard(); // start from a fresh empty board

	// Add a few live cells
	clickCell(4, 4);
	clickCell(10, 10);
	clickCell(15, 15);

	//read stats so we know the board was not empty before clearing
	let statsBefore = getStats();
	if (statsBefore.population < 1) {
		return {
			name: "clear button",
			passed: false,
			details: "expected some live cells before clear but population was zero",
		};
	}

	// locate the clear button that should wipe the board
	const clearBtn = document.getElementById("clearBtn");
	if (!clearBtn) {
		return {
			name: "clear button",
			passed: false,
			details: "clear button was not found",
		};
	}

	//click clear and then inspect the board state
	clearBtn.click();
	const aliveAfter = getAliveCells();
	const statsAfter = getStats();

	// pass if there are no live cells and stats are all reset
	const passed =
		aliveAfter.length === 0 &&
		statsAfter.population === 0 &&
		statsAfter.generation === 0;

	return {
		name: "clear button",
		passed,
		details: passed
			? "clear button removed all live cells and reset stats"
			: "clear button did not fully reset the board or stats",
	};
}

// main entry that runs every test and prints a summary
function runAllTests() {
	// clear any previous output from the test box
	const box = getTestOutputBox();
	box.textContent = "";
	logTestLine("running game of life tests...");
	// mute sound so the tests run quietly
	muteSoundForTests();

	// list of all test functions to run
	const tests = [
		testBlockStillLife,
		testBlinkerOscillator,
		testReproductionRule,
		testUnderpopulationRule,
		testOverpopulationRule,
		testClearButton,
	];

	const results = [];
	let passedCount = 0;

	// run each test and handle failures or thrown errors
	tests.forEach((fn) => {
		try {
			const result = fn();
			results.push(result);
			if (result.passed) {
			passedCount += 1;
			logTestLine("PASS: " + result.name + " - " + result.details);
			} else {
			logTestLine("FAIL: " + result.name + " - " + result.details);
			}
		} catch (err) {
			logTestLine("ERROR in test " + fn.name + ": " + String(err));
			results.push({
			name: fn.name,
			passed: false,
			details: "threw error: " + String(err),
			});
		}
	});

	// print a final summary at the end
	logTestLine("");
	logTestLine(
		"summary: " + passedCount + " of " + tests.length + " tests passed"
	);

	return results;
}

window.runAllTests = runAllTests;
