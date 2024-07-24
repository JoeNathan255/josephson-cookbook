let id = null;

let recipeNum = 0;

let MAX_RECIPE_NUM = 9;

let VERTICAL_SPEED = 10;

let MIN_RECIPE_WIDTH = 600; // in px

let IDEAL_RECIPE_WIDTH = 60; // in percent

var queryParam = new URLSearchParams(window.location.search);
if (queryParam.has("index")) {
	if (Boolean(Number(queryParam.get("index")))) {
		recipeNum = Number(queryParam.get("index")) - 1;
	}
}

function changeRecipe(goto, dir, letter, start) {

	let currentNum = recipeNum;

	if (goto == "one") {
		if (dir == "left") {
			recipeNum --;
		} else if (dir == "right") {
			recipeNum ++;
		}
	} else if (goto == "ten") {
		if (dir == "left") {
			recipeNum -= 10;
		} else if (dir == "right") {
			recipeNum += 10;
		}
	} else if (goto == "fav") {
		let loop = true;
		while (loop == true) {
			if (dir == "left") {
				recipeNum --;
			} else if (dir == "right") {
				recipeNum ++;
			}
			let newRecipe = document.getElementById("r" + recipeNum);
			if (newRecipe != null) {
				if (newRecipe.classList.contains("favorite")) {
					loop = false;
				}
			} else {
				return;
			}
		}
	} else if (goto == "let") {
		recipeNum = 0;
		let loop = true;
		while (loop == true) {
			recipeNum ++;
			let newRecipe = document.getElementById("r" + recipeNum);
			if (newRecipe.classList.contains(letter)) {
				loop = false;
			}
		}
		if (recipeNum < currentNum) {dir = "left";}
		else if (recipeNum > currentNum) {dir = "right";}
	}

	if (recipeNum < 1) {recipeNum = 1;}
	if (recipeNum > MAX_RECIPE_NUM) {recipeNum = MAX_RECIPE_NUM;}

	if (recipeNum == currentNum) {return;}

	document.body.style.overflowY = "hidden";

	recipeA = document.getElementById("recipeA");
	recipeB = document.getElementById("recipeB");

	let recipeAname = document.getElementById("recipeAname");
	let recipeBname = document.getElementById("recipeBname");
	let newTitle = document.getElementById("t" + recipeNum);
	recipeBname.innerHTML = newTitle.innerHTML;

	let recipeAtext = document.getElementById("recipeAtext");
	let recipeBtext = document.getElementById("recipeBtext");
	let newContent = document.getElementById("c" + recipeNum);
	recipeBtext.innerHTML = newContent.innerHTML;

	recipeB.style.opacity = "100%"

	if (start == true) {
		recipeA.style.opacity = "0%"
		recipeB.style.opacity = "0%"
	}

	if (dir == "left") {
		recipeB.style.left = `calc(calc(0% - min(100vw, max(${IDEAL_RECIPE_WIDTH}vw, ${MIN_RECIPE_WIDTH}px))) - 20px)`;
	} else if (dir == "right") {
		recipeB.style.left = `calc(100vw + 20px)`;
	}
	recipeA.style.left = `max(0px, calc(50vw - max(${IDEAL_RECIPE_WIDTH / 2}vw, ${MIN_RECIPE_WIDTH / 2}px)))`;

	let styleA = window.getComputedStyle(recipeA);
	let xPosA = parseInt(styleA.getPropertyValue("left"));
	let yPosA = parseInt(styleA.getPropertyValue("top"));
	let styleB = window.getComputedStyle(recipeB);
	let xPosB = parseInt(styleB.getPropertyValue("left"));
	let yPosB = parseInt(styleB.getPropertyValue("top"));

	finalX = xPosA;

	clearInterval(id);
	id = setInterval(move, 10);

	function move() {
		if (parseInt(styleB.getPropertyValue("left")) == (finalX)) {
			recipeB.style.left = finalX;

			clearInterval(id);

			recipeAname.innerHTML = recipeBname.innerHTML;
			recipeAtext.innerHTML = recipeBtext.innerHTML;

			recipeB.style.left = `calc(100vw + 20px)`; // just out of the way; gets moved again before next shift
			recipeA.style.left = `max(0px, calc(50vw - max(${IDEAL_RECIPE_WIDTH / 2}vw, ${MIN_RECIPE_WIDTH / 2}px)))`;
			recipeB.style.top = yPosA + "px";
			recipeA.style.top = "20%";

			document.body.style.minHeight = recipeA.clientHeight + 30 + "px";

			document.body.style.overflowY = "visible";

			recipeA.style.opacity = "100%";
			
			recipeB.style.opacity = "0%";

			queryParam.set("index", recipeNum);
			history.replaceState(null, null, "?"+queryParam.toString());
		} else {
			if (dir == "left") {
				xPosA += Math.sqrt(Math.abs(xPosB - finalX));
			} else if (dir == "right") {
				xPosA -= Math.sqrt(Math.abs(xPosB - finalX));
			}
			if (dir == "left") {
				xPosB += Math.sqrt(Math.abs(xPosB - finalX));
			} else if (dir == "right") {
				xPosB -= Math.sqrt(Math.abs(xPosB - finalX));
			}
			yPosA += Math.sqrt(Math.abs(xPosB - finalX)) / VERTICAL_SPEED;
			yPosB -= Math.sqrt(Math.abs(xPosB - finalX)) / VERTICAL_SPEED;

			recipeA.style.left = xPosA + "px";
			recipeA.style.top = yPosA + "px";
			recipeB.style.left = xPosB + "px";
			recipeB.style.top = yPosB + "px";
		}
	}
}

function showImages() {

	let checkbox = document.getElementById("imgCheckbox");

	let grayText = document.getElementById("imgCheck");

	let recipeImgs = document.getElementById("recipeImgs");

	if (checkbox.checked == true) {

		grayText.style.color = "darkslategray";

		let newImgs = document.getElementById("i" + recipeNum);

		recipeImgs.innerHTML = newImgs.innerHTML;
	} else {
		grayText.style.color = "darkgray";

		recipeImgs.innerHTML = ""
	}
}

changeRecipe("one", "right", undefined, true);