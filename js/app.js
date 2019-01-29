const deck = document.querySelector('.deck');
let flippedCards = [];
let turns = 0;
let timerOff = true;
let elapsedTime = 0;
let timerID;
let matchedPairs;

// creates deck array and calls shuffle function

function shuffleTheDeck(){
	const theDeck = Array.from(document.querySelectorAll('.deck li'));
	const shuffledDeck = shuffle(theDeck);
	for (card of shuffledDeck) {
		deck.appendChild(card);
	}
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}
}

shuffleTheDeck();

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// listens for click and flips the clicked card, adds to flipped card array, checks for match, adds a turn, and checks the score

deck.addEventListener('click', event => {
	const flip = event.target;
	if (checkClick(flip)) {
		if (timerOff){
			startTimer();
			timerOff = false;
		}
		cardFlip(flip);
		addFlippedCard(flip);
		if (flippedCards.length === 2){
			checkForMatch(flip);
			addTurn();
			scoreCheck();
		}
	}
});

// toggles the classes that show the "back" side of the card

function cardFlip(card) {
	card.classList.toggle('open');
	card.firstElementChild.classList.toggle('hide');
}

// adds the flipped card to an array

function addFlippedCard(card) {
	flippedCards.push(card);
}

// checks if the flipped cards match by comparing classes, toggles match class if a match, removes from flipped card array and increments # of matched pairs
function checkForMatch() {
	let matchedPairs = 0;
	if (
		flippedCards[0].firstElementChild.className ===
		flippedCards[1].firstElementChild.className
		) {
		flippedCards[0].classList.toggle('match');
		flippedCards[1].classList.toggle('match');
		flippedCards = [];
		matchedPairs++;
		}
		else {
			setTimeout(() => {
				cardFlip(flippedCards[0]);
				cardFlip(flippedCards[1]);
				flippedCards = [];
			}, 1000);
		}
}



function checkClick(flip) {
	return (
		flip.classList.contains('card') && !flip.classList.contains('match') && flippedCards.length < 2 && !flippedCards.includes(flip)
	);
}

// increments the turn counter

function addTurn() {
	turns++;
	const turnsText = document.querySelector('.moves');
	turnsText.innerHTML = turns;
}

// checks score to remove a star as needed

function scoreCheck() {
	if (turns === 16 || turns === 24) {
		removeStar();
	}

	let matchedCards = Array.from(document.querySelectorAll('.match'));
	if (matchedCards.length === 16){
		gameOver();
	}

}

// function to remove a star

function removeStar() {
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

// function to start the timer and display

function startTimer() {
	timerID = setInterval(() => {
		elapsedTime++;
		displayTime();
	}, 1000);	
}

// displays the timer in the html element

function displayTime() {
	const timer = document.querySelector('.timer');
	timer.innerHTML = elapsedTime;
}

//stops the timer

function stopTimer() {
	clearInterval(timerID);
}

// calls the functions needed to end the game

function gameOver(){
	stopTimer();
	showModal();
	modalStats();
}

// toggles the modal

function showModal() {
	const modal = document.querySelector('.modal-background');
	modal.classList.toggle('hide');
}

// displays the game stats on the modal

function modalStats() {
	const timeStat = document.querySelector('.modal-time');
	const gameTime = document.querySelector('.timer').innerHTML;
	const turnsStat = document.querySelector('.modal-moves');
	const starsStat = document.querySelector('.modal-stars');
	const stars = getStars();

	timeStat.innerHTML = `Time: ${gameTime}`;
	turnsStat.innerHTML = `Moves: ${turns}`;
	starsStat.innerHTML = `Stars: ${stars}`;
}

// gets the number of stars to display on the modal

function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	return starCount;
}

// closes the modal

document.querySelector('.modal-done').addEventListener('click', () => {
	showModal();
});

// closes modal and starts new game

document.querySelector('.modal-play').addEventListener('click', replay);

// closes the modal

document.querySelector('.modal-close').addEventListener('click', showModal);

// calls the functions needed to reset/replay the game

function resetGame() {
	resetTimerAndTime();
	resetTurns();
	resetStars();
	resetCards();
	reHideImgs();
	shuffleTheDeck();
}

// resets the timer and the displayed time

function resetTimerAndTime() {
	stopTimer();
	timerOff = true;
	elapsedTime = 0;
	displayTime();
}

// resets the number of turns

function resetTurns() {
	turns = 0;
	document.querySelector('.moves').innerHTML = turns;
}

// resets the stars

function resetStars() {
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		star.style.display = 'inline';
	}
}

// resets the cards by removing unneeded classes and clearing the number of matched pairs

function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	let matchedPairs = 0;
	}
}

// hides the images by triggering hide class

function reHideImgs() {
	const imgList = document.querySelectorAll('li img');
	for (img of imgList) {
		img.classList.add('hide');
	}
}

// calls the resetGame function on the restart icon

document.querySelector('.restart').addEventListener('click', resetGame);

// calls the resetGame function from the "play again" button and hides the modal

function replay() {
	resetGame();
	showModal();
}