/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');
const cardBack = document.getElementsByTagName('img');
let flippedCards = [];
const totalPairs = 8;
let turns = 0;
let timerOff = true;
let elapsedTime = 0;
let timerID;
let matchedPairs;
// let matchedPairs = 0;

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

function cardFlip(card) {
	card.classList.toggle('open');
	card.firstElementChild.classList.toggle('hide');
}

function addFlippedCard(card) {
	flippedCards.push(card);
	console.log(flippedCards);
}

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
		console.log('match!');
		}
		else {
			setTimeout(() => {
				console.log('Not a match');
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

function addTurn() {
	turns++;
	const turnsText = document.querySelector('.moves');
	turnsText.innerHTML = turns;
}

function scoreCheck() {
	if (turns === 16 || turns === 24) {
		removeStar();
	}

	if (matchedPairs === totalPairs){
		console.log('game over');
		gameOver();
	}
}

function removeStar() {
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

function startTimer() {
	timerID = setInterval(() => {
		elapsedTime++;
		console.log(elapsedTime);
		displayTime();
	}, 1000);	
}

function displayTime() {
	const timer = document.querySelector('.timer');
	console.log(timer);
	timer.innerHTML = elapsedTime;
}

function stopTimer() {
	clearInterval(timerID);
	console.log('timer stopped');
}

function gameOver(){
	stopTimer();
	showModal();
	modalStats();
}

function showModal() {
	const modal = document.querySelector('.modal-background');
	modal.classList.toggle('hide');
}

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

function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}

	console.log(starCount);
	return starCount;
}

document.querySelector('.modal-done').addEventListener('click', () => {
	showModal();
});

document.querySelector('.modal-play').addEventListener('click', replay);

document.querySelector('.modal-close').addEventListener('click', showModal);

function resetGame() {
	resetTimerAndTime();
	resetTurns();
	resetStars();
	resetCards();
	reHideImgs();
	shuffleTheDeck();
}

function resetTimerAndTime() {
	stopTimer();
	timerOff = true;
	elapsedTime = 0;
	displayTime();
}

function resetTurns() {
	turns = 0;
	document.querySelector('.moves').innerHTML = turns;
}

function resetStars() {
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		star.style.display = 'inline';
	}
}

function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	let matchedPairs = 0;
	}
}

function reHideImgs() {
	const imgList = document.querySelectorAll('li img');
	for (img of imgList) {
		img.classList.add('hide');
	}
}

document.querySelector('.restart').addEventListener('click', resetGame);

function replay() {
	resetGame();
	showModal();
}