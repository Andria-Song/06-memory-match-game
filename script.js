// Array of emojis (each emoji appears once, we'll duplicate them)
const emojis = ['🐶', '🐱', '🐸', '🦊', '🐵', '🐼', '🐨', '🐷'];

// Game state variables
let gameBoard = [];
let flippedCards = [];
let matchedCards = [];
let moveCount = 0;
let timerStarted = false;
let timerInterval = null;
let timerSeconds = 0;
let isCheckingCards = false;

// Get HTML elements
const gameBoardElement = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const winMessage = document.getElementById('winMessage');
const finalStats = document.getElementById('finalStats');

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    startGame();
});

// Function to start/restart the game
function startGame() {
    // Reset game state
    gameBoard = [];
    flippedCards = [];
    matchedCards = [];
    moveCount = 0;
    timerStarted = false;
    timerSeconds = 0;
    isCheckingCards = false;
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset display
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0s';
    winMessage.classList.remove('visible');
    
    // Clear game board
    gameBoardElement.textContent = '';
    
    // Create shuffled emoji array (duplicate each emoji for pairs)
    const shuffledEmojis = createShuffledEmojis();
    
    // Create cards
    createCards(shuffledEmojis);
    
    // Add restart button listener
    restartBtn.addEventListener('click', startGame);
}

// Function to create shuffled emoji array
function createShuffledEmojis() {
    // Duplicate each emoji to create pairs
    const pairedEmojis = [];
    for (let i = 0; i < emojis.length; i++) {
        pairedEmojis.push(emojis[i]);
        pairedEmojis.push(emojis[i]);
    }
    
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = pairedEmojis.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        
        // Swap elements
        const temp = pairedEmojis[i];
        pairedEmojis[i] = pairedEmojis[randomIndex];
        pairedEmojis[randomIndex] = temp;
    }
    
    return pairedEmojis;
}

// Function to create cards and add them to the board
function createCards(shuffledEmojis) {
    // Create a card for each emoji
    for (let i = 0; i < shuffledEmojis.length; i++) {
        const card = document.createElement('div');
        
        // Set card properties
        card.classList.add('card');
        card.textContent = '?';
        card.dataset.emoji = shuffledEmojis[i];
        card.dataset.id = i;
        
        // Add click event listener
        card.addEventListener('click', function() {
            flipCard(card);
        });
        
        // Add card to game board
        gameBoardElement.appendChild(card);
        gameBoard.push(card);
    }
}

// Function to flip a card
function flipCard(card) {
    // Don't flip if checking cards, card already flipped, or card already matched
    if (isCheckingCards || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Start timer on first card flip
    if (!timerStarted) {
        timerStarted = true;
        startTimer();
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(function() {
        timerSeconds = timerSeconds + 1;
        timerDisplay.textContent = timerSeconds + 's';
    }, 1000);
}

// Function to check if two flipped cards match
function checkForMatch() {
    // Set flag to prevent more clicks
    isCheckingCards = true;
    
    // Get the two flipped cards
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    // Increase move count
    moveCount = moveCount + 1;
    movesDisplay.textContent = moveCount;
    
    // Check if emojis match
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Cards match!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        
        // Reset flipped cards
        flippedCards = [];
        isCheckingCards = false;
        
        // Check if game is won
        if (matchedCards.length === gameBoard.length) {
            endGame();
        }
    } else {
        // Cards don't match - flip back after 800ms
        setTimeout(function() {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            
            // Reset flipped cards
            flippedCards = [];
            isCheckingCards = false;
        }, 800);
    }
}

// Function to end the game when all cards are matched
function endGame() {
    // Stop timer
    clearInterval(timerInterval);
    
    // Show win message
    winMessage.classList.add('visible');
    finalStats.textContent = `You completed the game in ${moveCount} moves and ${timerSeconds} seconds!`;
}
