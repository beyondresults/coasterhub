
// --- DATA CONFIGURATION ---
// Loaded at runtime so venues and global content can change without editing this file.
const DEFAULT_VENUE_ID = 'the-palace-south-melb';
const DATA_PATHS = {
  venues: './venues.json',
  global: './global.json'
};

let VENUE_DATA;
let GLOBAL_DATA;


// --- STATE ---
let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;
let isSpinning = false;
let currentRotation = 0;
let cooldownInterval;
let wheelSegmentsData = []; // To store prize data with angles
let birthdaySignupStorageKey = 'birthdayClubSignedUp'; // Defaults until venue is resolved
let spinWheelStorageKey = 'activePrize';
let stopClockStorageKey = 'stopClockActivePrize';
let currentVenueId = DEFAULT_VENUE_ID;

// Stop the clock game state
let stopClockInterval = null;
let stopClockStartTime = 0;
let stopClockGameState = 'idle'; // 'idle', 'running', 'stopped'
let stopClockCooldownInterval;

// Trivia game state
let triviaTimerInterval = null;
let triviaStartTime = 0;
let triviaDurationMs = 0;
let triviaScoreSubmitted = false;
let lastSubmittedPlayerName = '';


// --- DOM ELEMENTS ---
// Header & Cards
const pubLogo = document.getElementById('pub-logo');
const pubName = document.getElementById('pub-name');
const pubAddress = document.getElementById('pub-address');
const pubInstagramLink = document.getElementById('pub-instagram-link');
const pubFacebookLink = document.getElementById('pub-facebook-link');
const pubInstagramHandle = document.getElementById('pub-instagram-handle');
const copyHandleButton = document.getElementById('copy-handle-button');
const copyHandleText = document.getElementById('copy-handle-text');
const copyIconWrapper = document.getElementById('copy-icon-wrapper');
const checkIconWrapper = document.getElementById('check-icon-wrapper');
const openInstagramLink = document.getElementById('open-instagram-link');
const googleReviewLink = document.getElementById('google-review-link');
const mainContent = document.querySelector('main');
const layoutContainer = document.querySelector('.container');

// Stop The Clock Game
const stopClockTimer = document.getElementById('stop-clock-timer');
const stopClockResult = document.getElementById('stop-clock-result');
const stopClockButton = document.getElementById('stop-clock-button');
const showStopClockTermsButton = document.getElementById('show-stop-clock-terms-button');
const stopClockTermsModal = document.getElementById('stop-clock-terms-modal');
const closeStopClockTermsButton = document.getElementById('close-stop-clock-terms-button');

// Stop The Clock Prize Modal
const stopClockPrizeModal = document.getElementById('stop-clock-prize-modal');
const stopClockPrizeWonText = document.getElementById('stop-clock-prize-won');
const stopClockPrizeExpiryEl = document.getElementById('stop-clock-prize-expiry');
const stopClockPrizeInitialView = document.getElementById('stop-clock-prize-initial-view');
const stopClockPrizeConfirmationView = document.getElementById('stop-clock-prize-confirmation-view');
const stopClockPrizeRedeemedView = document.getElementById('stop-clock-prize-redeemed-view');
const stopClockRedeemNowButton = document.getElementById('stop-clock-redeem-now-button');
const stopClockRedeemLaterButton = document.getElementById('stop-clock-redeem-later-button');
const stopClockConfirmRedemptionButton = document.getElementById('stop-clock-confirm-redemption-button');
const stopClockCancelRedemptionButton = document.getElementById('stop-clock-cancel-redemption-button');

// Spin Wheel
const spinButton = document.getElementById('spin-button');
const wheel = document.getElementById('wheel');
const wheelSegmentsContainer = document.getElementById('wheel-segments');
const prizeModal = document.getElementById('prize-modal');
const prizeWonText = document.getElementById('prize-won');
const prizeExpiryEl = document.getElementById('prize-expiry');
const showSpinWheelTermsButton = document.getElementById('show-spin-wheel-terms-button');
const spinWheelTermsModal = document.getElementById('spin-wheel-terms-modal');
const closeSpinWheelTermsButton = document.getElementById('close-spin-wheel-terms-button');

// Prize Modal Views
const prizeInitialView = document.getElementById('prize-initial-view');
const prizeConfirmationView = document.getElementById('prize-confirmation-view');
const prizeRedeemedView = document.getElementById('prize-redeemed-view');

// Prize Modal Buttons
const redeemNowButton = document.getElementById('redeem-now-button');
const redeemLaterButton = document.getElementById('redeem-later-button');
const confirmRedemptionButton = document.getElementById('confirm-redemption-button');
const cancelRedemptionButton = document.getElementById('cancel-redemption-button');

// Trivia Game
const triviaStartScreen = document.getElementById('trivia-start-screen');
const triviaPlayingScreen = document.getElementById('trivia-playing-screen');
const triviaFinishedScreen = document.getElementById('trivia-finished-screen');
const startTriviaButton = document.getElementById('start-trivia-button');
const playAgainButton = document.getElementById('play-again-button');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const answerOptionsContainer = document.getElementById('answer-options');
const finalScore = document.getElementById('final-score');
const totalQuestions = document.getElementById('total-questions');
const scorePercentage = document.getElementById('score-percentage');
const showTriviaTermsButton = document.getElementById('show-trivia-terms-button');
const triviaTermsModal = document.getElementById('trivia-terms-modal');
const closeTriviaTermsButton = document.getElementById('close-trivia-terms-button');
const triviaTimer = document.getElementById('trivia-timer');
const finalTimeDisplay = document.getElementById('final-time-display');
const triviaPlayerNameInput = document.getElementById('trivia-player-name');
const viewScoreboardButton = document.getElementById('view-scoreboard-button');
const triviaScoreboardContainer = document.getElementById('trivia-scoreboard');
const triviaLeaderboardList = document.getElementById('trivia-leaderboard-list');
const triviaLeaderboardMessage = document.getElementById('trivia-leaderboard-message');
const triviaTheme = document.getElementById('trivia-theme');

// Review/Feedback Card
const reviewCardTitle = document.getElementById('review-card-title');
const reviewCardSubtitle = document.getElementById('review-card-subtitle');
const reviewInitialState = document.getElementById('review-initial-state');
const reviewEmojiButtons = document.querySelectorAll('#review-emoji-ratings button');
const reviewFeedbackForm = document.getElementById('review-feedback-form');
const reviewFeedbackFormNameInput = document.getElementById('review-feedback-form-name-input');
const reviewFeedbackThanks = document.getElementById('review-feedback-thanks');
const reviewFeedbackTextarea = document.getElementById('review-feedback-textarea');
const reviewSubmitFeedbackButton = document.getElementById('review-submit-feedback-button');

// Birthday Club
const birthdayInitialView = document.getElementById('birthday-initial-view');
const birthdayThanksView = document.getElementById('birthday-thanks-view');
const birthdayForm = document.getElementById('birthday-form');
const birthdayEmailInput = document.getElementById('birthday-email');
const birthdayMonthInput = document.getElementById('birthday-month');
const birthdayCard = document.getElementById('birthday-club-card');
const birthdayDayInput = document.getElementById('birthday-day');
const birthdayError = document.getElementById('birthday-error');
const birthdaySubmitButton = document.getElementById('birthday-submit-button');
const birthdaySpinner = document.getElementById('birthday-spinner');
const birthdayButtonText = document.getElementById('birthday-button-text');
const customMonthSelect = document.getElementById('custom-month-select');
const customMonthSelectButton = document.getElementById('custom-month-select-button');
const customMonthSelectValue = document.getElementById('custom-month-select-value');
const customMonthSelectOptions = document.getElementById('custom-month-select-options');
const showTermsButton = document.getElementById('show-terms-button');
const termsModal = document.getElementById('terms-modal');
const closeTermsButton = document.getElementById('close-terms-button');
const birthdayClubDescription = document.getElementById('birthday-club-description');


// --- FUNCTIONS ---

/**
 * Copies the pub's Instagram handle to the clipboard and shows feedback.
 */
function copyHandleToClipboard() {
  const handle = VENUE_DATA?.pubDetails?.instagramHandle;
  if (!handle) return;

  const showSuccess = () => {
    copyHandleText.textContent = 'Copied!';
    copyIconWrapper.classList.add('hidden');
    checkIconWrapper.classList.remove('hidden');

    setTimeout(() => {
      copyHandleText.textContent = `Copy Handle ${handle}`;
      copyIconWrapper.classList.remove('hidden');
      checkIconWrapper.classList.add('hidden');
    }, 2000);
  };

  const showFailure = () => {
    copyHandleText.textContent = 'Copy not supported on this device';
    copyIconWrapper.classList.remove('hidden');
    checkIconWrapper.classList.add('hidden');
  };

  const fallbackCopy = () => {
    const tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.value = handle;
    tempInput.setAttribute('aria-hidden', 'true');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();

    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (error) {
      successful = false;
    } finally {
      document.body.removeChild(tempInput);
    }

    if (successful) {
      showSuccess();
    } else {
      showFailure();
    }
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(handle)
      .then(showSuccess)
      .catch(() => fallbackCopy());
  } else {
    fallbackCopy();
  }
}

/**
 * Formats milliseconds into HH:MM:SS string for the cooldown timer.
 * @param {number} ms - The time in milliseconds.
 * @returns {string} The formatted time string.
 */
function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// --- STOP THE CLOCK FUNCTIONS ---
function getActiveStopClockPrize() {
    const prizeData = localStorage.getItem(stopClockStorageKey);
    if (!prizeData) return null;
    try {
        const prize = JSON.parse(prizeData);
        if (Date.now() > prize.expiry) {
            localStorage.removeItem(stopClockStorageKey);
            return null;
        }
        return prize;
    } catch (e) {
        return null;
    }
}

function showStopClockPrizeModal() {
    const prize = getActiveStopClockPrize();
    if (!prize) return;
    stopClockPrizeWonText.textContent = prize.text;
    const expiryDate = new Date(prize.expiry);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    stopClockPrizeExpiryEl.textContent = `Offer expires: ${expiryDate.toLocaleDateString('en-AU', dateOptions)} at ${expiryDate.toLocaleTimeString('en-AU', timeOptions)}`;
    stopClockPrizeInitialView.classList.remove('hidden');
    stopClockPrizeConfirmationView.classList.add('hidden');
    stopClockPrizeRedeemedView.classList.add('hidden');
    stopClockPrizeModal.classList.remove('hidden');
}

function hideStopClockPrizeModal() {
    stopClockPrizeModal.classList.add('hidden');
}

function startStopClockCooldownTimer(expiryTime) {
    if (stopClockCooldownInterval) clearInterval(stopClockCooldownInterval);
    stopClockButton.disabled = true;
    const activePrize = getActiveStopClockPrize();
    
    const update = () => {
        const timeLeft = expiryTime - Date.now();
        if (timeLeft <= 0) {
            clearInterval(stopClockCooldownInterval);
            localStorage.removeItem(stopClockStorageKey);
            resetStopClock();
        } else {
             if (activePrize && !activePrize.redeemed) {
                stopClockButton.textContent = 'View Your Prize';
                stopClockButton.disabled = false;
                stopClockButton.classList.remove('bg-pink-500', 'hover:bg-pink-600', 'bg-gray-400');
                stopClockButton.classList.add('bg-purple-600', 'hover:bg-purple-700');
                clearInterval(stopClockCooldownInterval);
                return;
            }
            stopClockButton.textContent = `Play again in ${formatTime(timeLeft)}`;
        }
    };
    
    update();
    stopClockCooldownInterval = setInterval(update, 1000);
}

function handleStopClockRedeemLater() {
    hideStopClockPrizeModal();
    const prize = getActiveStopClockPrize();
    if (prize && !prize.redeemed) {
        startStopClockCooldownTimer(prize.expiry);
    }
}

function handleStopClockRedeemNow() {
    stopClockPrizeInitialView.classList.add('hidden');
    stopClockPrizeConfirmationView.classList.remove('hidden');
}

function handleStopClockCancelRedemption() {
    stopClockPrizeConfirmationView.classList.add('hidden');
    stopClockPrizeInitialView.classList.remove('hidden');
}

function handleStopClockConfirmRedemption() {
    let prize = getActiveStopClockPrize();
    if (prize) {
        prize.redeemed = true;
        localStorage.setItem(stopClockStorageKey, JSON.stringify(prize));
        stopClockPrizeConfirmationView.classList.add('hidden');
        stopClockPrizeRedeemedView.classList.remove('hidden');
        setTimeout(() => {
            hideStopClockPrizeModal();
            startStopClockCooldownTimer(prize.expiry);
        }, 2500);
    }
}

function updateStopClockTimer() {
    const elapsedTime = Date.now() - stopClockStartTime;
    stopClockTimer.textContent = (elapsedTime / 1000).toFixed(2);
}

function startStopClock() {
    stopClockStartTime = Date.now();
    stopClockResult.textContent = '';
    stopClockInterval = setInterval(updateStopClockTimer, 10);
    stopClockButton.textContent = 'Stop!';
    stopClockButton.classList.remove('bg-pink-500', 'hover:bg-pink-600');
    stopClockButton.classList.add('bg-red-500', 'hover:bg-red-600');
    stopClockGameState = 'running';
}

function stopStopClock() {
    clearInterval(stopClockInterval);
    const finalTime = parseFloat(stopClockTimer.textContent);
    
    if (finalTime.toFixed(2) === '10.00') {
        stopClockResult.textContent = 'Perfect timing! You won! 🏆';
        stopClockResult.classList.add('text-green-600');
        stopClockResult.classList.remove('text-gray-700');
        
        const cooldownMs = VENUE_DATA.stopTheClock.cooldownDurationHours * 60 * 60 * 1000;
        const expiryTime = Date.now() + cooldownMs;
        const prizeData = { text: VENUE_DATA.stopTheClock.prizeText, expiry: expiryTime, redeemed: false };
        localStorage.setItem(stopClockStorageKey, JSON.stringify(prizeData));
        
        setTimeout(() => {
            showStopClockPrizeModal();
            startStopClockCooldownTimer(expiryTime);
        }, 500);
    } else {
        stopClockResult.textContent = `So close! You stopped at ${finalTime.toFixed(2)}s.`;
        stopClockResult.classList.add('text-gray-700');
        stopClockResult.classList.remove('text-green-600');
        stopClockButton.textContent = 'Play Again';
        stopClockButton.classList.remove('bg-red-500', 'hover:bg-red-600');
        stopClockButton.classList.add('bg-gray-500', 'hover:bg-gray-600');
        stopClockGameState = 'stopped';
    }
}

function resetStopClock() {
    stopClockTimer.textContent = '0.00';
    stopClockResult.textContent = '';
    stopClockButton.textContent = 'Start';
    stopClockButton.disabled = false;
    stopClockButton.classList.remove('bg-gray-500', 'hover:bg-gray-600', 'bg-purple-600', 'hover:bg-purple-700', 'bg-gray-400');
    stopClockButton.classList.add('bg-pink-500', 'hover:bg-pink-600');
    stopClockGameState = 'idle';
}

function handleStopClockButtonClick() {
    const prize = getActiveStopClockPrize();
    if (prize && !prize.redeemed) {
        showStopClockPrizeModal();
        return;
    }
    if (stopClockButton.disabled) return;

    if (stopClockGameState === 'idle') {
        startStopClock();
    } else if (stopClockGameState === 'running') {
        stopStopClock();
    } else { // 'stopped'
        resetStopClock();
    }
}

// --- SVG & WHEEL HELPERS ---
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "L", start.x, start.y,
        "Z"
    ].join(" ");
    return d;
}

function generateWheelSegments() {
    const prizes = Array.isArray(VENUE_DATA?.spinWheel?.prizes) ? VENUE_DATA.spinWheel.prizes : [];
    const colors = ["#ef4444", "#f97316", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899"];
    let currentAngle = 0;
    
    wheelSegmentsData = []; // Reset segment data
    wheelSegmentsContainer.innerHTML = ''; // Clear existing segments

    if (!prizes.length) {
        return;
    }

    const oddsTotal = prizes.reduce((sum, prize) => {
        const numericOdds = Number(prize.odds);
        return Number.isFinite(numericOdds) ? sum + numericOdds : sum;
    }, 0);
    const useEvenSplit = oddsTotal <= 0;

    prizes.forEach((prize, index) => {
        const numericOdds = Number(prize.odds);
        const normalizedOdds = useEvenSplit
            ? 1 / prizes.length
            : (Number.isFinite(numericOdds) ? numericOdds / oddsTotal : 0);
        const angle = normalizedOdds * 360;
        const maxAngle = index === prizes.length - 1 ? 360 : currentAngle + angle;
        const segmentData = {
            prize: prize,
            minAngle: currentAngle,
            maxAngle: maxAngle
        };
        wheelSegmentsData.push(segmentData);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", describeArc(100, 100, 100, currentAngle, maxAngle));
        path.setAttribute("fill", colors[index % colors.length]);
        wheelSegmentsContainer.appendChild(path);

        currentAngle = maxAngle;
    });
}


// --- SPIN WHEEL FUNCTIONS ---
function formatSpinTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `Spin again in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startCooldownTimer(expiryTime) {
    if (cooldownInterval) clearInterval(cooldownInterval);
    isSpinning = true;
    spinButton.disabled = true;
    const activePrize = getActivePrize();
    
    const update = () => {
        const now = Date.now();
        const timeLeft = expiryTime - now;
        if (timeLeft <= 0) {
            clearInterval(cooldownInterval);
            spinButton.disabled = false;
            spinButton.textContent = 'Spin!';
            isSpinning = false;
            localStorage.removeItem(spinWheelStorageKey);
        } else {
             if (activePrize && !activePrize.redeemed) {
                spinButton.textContent = 'View Your Prize';
                spinButton.disabled = false;
                spinButton.onclick = showPrizeModal;
                clearInterval(cooldownInterval);
                return;
            }
            spinButton.textContent = formatSpinTime(timeLeft);
        }
    };

    update();
    cooldownInterval = setInterval(update, 1000);
}

function spinTheWheel() {
    if (isSpinning) return;
    if (!Array.isArray(VENUE_DATA?.spinWheel?.prizes) || VENUE_DATA.spinWheel.prizes.length === 0) {
        spinButton.disabled = true;
        spinButton.textContent = 'No prizes configured';
        return;
    }
    const cooldownMs = VENUE_DATA.spinWheel.cooldownDurationHours * 60 * 60 * 1000;
    const expiryTime = Date.now() + cooldownMs;
    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'Spinning...';
    spinButton.onclick = null;

    const randomStopAngle = Math.floor(Math.random() * 360);
    const fullRotations = 5;
    const newRotation = (fullRotations * 360) + randomStopAngle;
    currentRotation += newRotation;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    wheel.addEventListener('transitionend', () => {
        const effectiveAngle = (360 - (currentRotation % 360)) % 360;
        const winningSegment = wheelSegmentsData.find(seg => effectiveAngle >= seg.minAngle && effectiveAngle < seg.maxAngle);
        
        const prizeData = { 
            text: winningSegment ? winningSegment.prize.text : "Try Again!", 
            expiry: expiryTime, 
            redeemed: false 
        };
        localStorage.setItem(spinWheelStorageKey, JSON.stringify(prizeData));
        showPrizeModal();
        startCooldownTimer(expiryTime);
    }, { once: true });
}

function getActivePrize() {
    const prizeData = localStorage.getItem(spinWheelStorageKey);
    if (!prizeData) return null;
    try {
        const prize = JSON.parse(prizeData);
        if (Date.now() > prize.expiry) {
            localStorage.removeItem(spinWheelStorageKey);
            return null;
        }
        return prize;
    } catch (e) {
        return null;
    }
}

function showPrizeModal() {
    const prize = getActivePrize();
    if (!prize) return;
    prizeWonText.textContent = prize.text;
    const expiryDate = new Date(prize.expiry);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    prizeExpiryEl.textContent = `Offer expires: ${expiryDate.toLocaleDateString('en-AU', dateOptions)} at ${expiryDate.toLocaleTimeString('en-AU', timeOptions)}`;
    prizeInitialView.classList.remove('hidden');
    prizeConfirmationView.classList.add('hidden');
    prizeRedeemedView.classList.add('hidden');
    prizeModal.classList.remove('hidden');
}

function hidePrizeModal() {
    prizeModal.classList.add('hidden');
}

function handleRedeemLater() {
    hidePrizeModal();
    const prize = getActivePrize();
    if (prize && !prize.redeemed) {
        spinButton.textContent = 'View Your Prize';
        spinButton.disabled = false;
        spinButton.onclick = showPrizeModal;
    }
}

function handleRedeemNow() {
    prizeInitialView.classList.add('hidden');
    prizeConfirmationView.classList.remove('hidden');
}

function handleCancelRedemption() {
    prizeConfirmationView.classList.add('hidden');
    prizeInitialView.classList.remove('hidden');
}

function handleConfirmRedemption() {
    let prize = getActivePrize();
    if (prize) {
        prize.redeemed = true;
        localStorage.setItem(spinWheelStorageKey, JSON.stringify(prize));
        prizeConfirmationView.classList.add('hidden');
        prizeRedeemedView.classList.remove('hidden');
        setTimeout(() => {
            hidePrizeModal();
            startCooldownTimer(prize.expiry);
        }, 2500);
    }
}

// --- TRIVIA FUNCTIONS ---
function displayQuestion() {
  isAnswered = false;
  const currentQuestion = GLOBAL_DATA.trivia.questions[currentQuestionIndex];
  
  questionCounter.textContent = `${currentQuestionIndex + 1}/${GLOBAL_DATA.trivia.questions.length}`;
  questionText.textContent = currentQuestion.question;
  answerOptionsContainer.innerHTML = '';

  currentQuestion.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.className = 'w-full text-left p-4 rounded-xl font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 text-gray-800';
    button.addEventListener('click', () => selectAnswer(option, currentQuestion.correctAnswer, button));
    answerOptionsContainer.appendChild(button);
  });
}

function selectAnswer(selectedOption, correctAnswer, buttonElement) {
  if (isAnswered) return;
  isAnswered = true;

  const isCorrect = selectedOption === correctAnswer;
  if (isCorrect) score++;

  const allOptionButtons = answerOptionsContainer.querySelectorAll('button');
  allOptionButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.className = 'w-full text-left p-4 rounded-xl font-medium transition-all duration-300 bg-green-500 text-white animate-pulse';
    } else if (btn.textContent === selectedOption && !isCorrect) {
      btn.className = 'w-full text-left p-4 rounded-xl font-medium transition-all duration-300 bg-red-500 text-white';
    } else {
      btn.className = 'w-full text-left p-4 rounded-xl font-medium transition-all duration-300 bg-gray-100 text-gray-500 opacity-70';
    }
  });

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < GLOBAL_DATA.trivia.questions.length) {
      displayQuestion();
    } else {
      endGame();
    }
  }, 1200);
}

function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  resetTriviaScoreboardState();
  triviaStartScreen.classList.add('hidden');
  triviaFinishedScreen.classList.add('hidden');
  triviaPlayingScreen.classList.remove('hidden');
  
  triviaTimer.textContent = '0.00s';
  finalTimeDisplay.textContent = '';
  triviaStartTime = Date.now();
  triviaTimerInterval = setInterval(() => {
      const elapsedTime = ((Date.now() - triviaStartTime) / 1000).toFixed(2);
      triviaTimer.textContent = `${elapsedTime}s`;
  }, 10);

  displayQuestion();
}

function endGame() {
  clearInterval(triviaTimerInterval);
  triviaDurationMs = Math.max(0, Date.now() - triviaStartTime);
  const finalTime = (triviaDurationMs / 1000).toFixed(2);
  const totalQuestionCount = GLOBAL_DATA.trivia.questions.length;
  const percentage = Math.round((score / totalQuestionCount) * 100);

  finalScore.textContent = score;
  totalQuestions.textContent = totalQuestionCount;
  scorePercentage.textContent = `(${percentage}%)`;
  finalTimeDisplay.innerHTML = `Your time: <span class="font-bold text-gray-800">${finalTime}s</span>`;

  triviaPlayingScreen.classList.add('hidden');
  triviaFinishedScreen.classList.remove('hidden');
  handleTriviaNameInput();

  if (triviaPlayerNameInput) {
    triviaPlayerNameInput.focus({ preventScroll: true });
  }
}

function restartGame() {
    if (triviaTimerInterval) clearInterval(triviaTimerInterval);
    resetTriviaScoreboardState();
    triviaFinishedScreen.classList.add('hidden');
    triviaStartScreen.classList.remove('hidden');
}

// --- TRIVIA LEADERBOARD FUNCTIONS ---
function formatSecondsFromMs(ms) {
  if (!Number.isFinite(ms) || ms < 0) {
    return '—';
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function resetTriviaScoreboardUI() {
  if (triviaPlayerNameInput) {
    triviaPlayerNameInput.value = '';
    triviaPlayerNameInput.disabled = false;
    triviaPlayerNameInput.classList.remove('bg-gray-100', 'cursor-not-allowed', 'text-gray-500');
  }

  if (viewScoreboardButton) {
    viewScoreboardButton.disabled = true;
    viewScoreboardButton.textContent = 'View scoreboard';
    delete viewScoreboardButton.dataset.loading;
  }

  if (triviaLeaderboardMessage) {
    triviaLeaderboardMessage.textContent = '';
  }

  if (triviaLeaderboardList) {
    triviaLeaderboardList.innerHTML = '';
  }

  if (triviaScoreboardContainer) {
    triviaScoreboardContainer.classList.add('hidden');
  }
}

function resetTriviaScoreboardState() {
  triviaDurationMs = 0;
  triviaScoreSubmitted = false;
  lastSubmittedPlayerName = '';
  resetTriviaScoreboardUI();
}

function handleTriviaNameInput() {
  if (!triviaPlayerNameInput || !viewScoreboardButton) {
    return;
  }

  const hasName = triviaPlayerNameInput.value.trim().length > 0;
  viewScoreboardButton.disabled = !hasName;
}

async function submitTriviaScore(playerName) {
  const payload = {
    pubId: currentVenueId,
    playerName,
    score,
    timeMs: triviaDurationMs
  };

  if (!payload.pubId) {
    throw new Error('Missing venue identifier.');
  }

  if (!Number.isFinite(payload.score)) {
    throw new Error('Missing score value.');
  }

  if (!Number.isFinite(payload.timeMs)) {
    throw new Error('Missing time value.');
  }

  const response = await fetch('/.netlify/functions/submit-trivia-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Unable to submit score.');
  }
}

function renderTriviaLeaderboard(items, highlight) {
  if (!triviaLeaderboardList) {
    return;
  }

  triviaLeaderboardList.innerHTML = '';

  if (!items.length) {
    if (triviaLeaderboardMessage) {
      triviaLeaderboardMessage.textContent = 'No scores yet. Be the first to play!';
    }
    return;
  }

  if (triviaLeaderboardMessage) {
    triviaLeaderboardMessage.textContent = 'Top players this week';
  }

  const shouldHighlight =
    highlight &&
    typeof highlight.playerName === 'string' &&
    highlight.playerName.length > 0;

  items.forEach((item, index) => {
    const li = document.createElement('li');
    const isHighlight =
      shouldHighlight &&
      item.playerName === highlight.playerName &&
      item.score === highlight.score &&
      item.timeMs === highlight.timeMs;

    li.className = [
      'flex items-center justify-between rounded-xl px-4 py-3 bg-gray-100',
      isHighlight ? 'border border-[#004225] bg-[#E8F5EE]' : ''
    ]
      .filter(Boolean)
      .join(' ');

    li.innerHTML = `
      <div class="flex items-baseline space-x-3">
        <span class="text-sm font-semibold text-gray-500">${index + 1}.</span>
        <span class="text-lg font-semibold text-gray-800">${item.playerName || 'Player'}</span>
      </div>
      <div class="text-right text-sm text-gray-600">
        <p class="font-semibold text-gray-700">${item.score} correct</p>
        <p class="text-xs text-gray-500">${formatSecondsFromMs(item.timeMs)}</p>
      </div>
    `;

    triviaLeaderboardList.appendChild(li);
  });
}

async function loadTriviaLeaderboard({ reveal = false, highlightSubmission = false } = {}) {
  if (!currentVenueId) {
    throw new Error('Missing venue identifier.');
  }

  if (reveal && triviaScoreboardContainer) {
    triviaScoreboardContainer.classList.remove('hidden');
  }

  if (triviaLeaderboardMessage) {
    triviaLeaderboardMessage.textContent = 'Loading scoreboard...';
  }

  const query = new URLSearchParams({
    pubId: currentVenueId,
    limit: '20'
  });

  const response = await fetch(
    `/.netlify/functions/get-trivia-leaderboard?${query.toString()}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Unable to load leaderboard.');
  }

  const data = await response.json();
  const items = Array.isArray(data.items) ? data.items : [];

  renderTriviaLeaderboard(
    items,
    highlightSubmission
      ? {
          playerName: lastSubmittedPlayerName,
          score,
          timeMs: triviaDurationMs
        }
      : null
  );

  if (triviaScoreboardContainer) {
    triviaScoreboardContainer.classList.remove('hidden');
  }
}

async function handleViewScoreboardClick() {
  if (!triviaPlayerNameInput || !viewScoreboardButton) {
    return;
  }

  const isLoading = viewScoreboardButton.dataset.loading === 'true';
  if (isLoading) {
    return;
  }

  const playerName = triviaPlayerNameInput.value.trim();
  if (!playerName) {
    return;
  }

  viewScoreboardButton.dataset.loading = 'true';
  viewScoreboardButton.disabled = true;
  viewScoreboardButton.textContent = triviaScoreSubmitted
    ? 'Refreshing...'
    : 'Submitting...';

  if (triviaLeaderboardMessage) {
    triviaLeaderboardMessage.textContent = 'Loading scoreboard...';
  }

  try {
    if (!triviaScoreSubmitted) {
      await submitTriviaScore(playerName);
      triviaScoreSubmitted = true;
      lastSubmittedPlayerName = playerName;

      triviaPlayerNameInput.disabled = true;
      triviaPlayerNameInput.classList.add('bg-gray-100', 'cursor-not-allowed', 'text-gray-500');
    }

    await loadTriviaLeaderboard({
      reveal: true,
      highlightSubmission: true
    });

    viewScoreboardButton.textContent = 'Refresh scoreboard';
  } catch (error) {
    console.error('Trivia scoreboard error:', error);
    viewScoreboardButton.textContent = 'View scoreboard';
    if (triviaLeaderboardMessage) {
      triviaLeaderboardMessage.textContent =
        'Sorry, we could not update the scoreboard. Please try again.';
    }
  } finally {
    viewScoreboardButton.disabled = false;
    viewScoreboardButton.dataset.loading = 'false';
  }
}

// --- FEEDBACK & BIRTHDAY FUNCTIONS ---
function handleReviewEmojiClick(event) {
    const sentiment = event.currentTarget.dataset.sentiment;

    if (sentiment === 'positive') {
        window.open(googleReviewLink.href, '_blank', 'noopener,noreferrer');
    } else {
        reviewInitialState.classList.add('hidden');
        reviewCardTitle.textContent = 'Tell us about your visit';
        reviewCardSubtitle.textContent = 'Your feedback is valuable to us.';
        reviewFeedbackForm.classList.remove('hidden');
    }
}

async function handleFeedbackSubmit(event) {
    event.preventDefault();

    reviewSubmitFeedbackButton.disabled = true;
    reviewSubmitFeedbackButton.textContent = 'Submitting...';

    const submitUrl = GLOBAL_DATA?.feedback?.submitUrl || '/.netlify/functions/submit-feedback';
    const message = reviewFeedbackTextarea.value?.trim() || '';

    if (!message) {
        alert('Please add a short note so we can help.');
        reviewSubmitFeedbackButton.disabled = false;
        reviewSubmitFeedbackButton.textContent = 'Submit Feedback';
        return;
    }

    try {
        const response = await fetch(submitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                venue_id: currentVenueId,
                message
            })
        });

        if (!response.ok) {
            throw new Error(`Feedback webhook responded with status ${response.status}`);
        }

        reviewFeedbackForm.classList.add('hidden');
        reviewCardTitle.textContent = 'Thank You!';
        reviewCardSubtitle.classList.add('hidden');
        reviewFeedbackThanks.classList.remove('hidden');
        reviewFeedbackTextarea.value = '';
    } catch (error) {
        alert('Sorry, there was an error submitting your feedback.');
        console.error('Feedback submission failed', error);
    } finally {
        reviewSubmitFeedbackButton.disabled = false;
        reviewSubmitFeedbackButton.textContent = 'Submit Feedback';
    }
}

function hideBirthdayCard() {
    if (birthdayCard) {
        birthdayCard.classList.add('hidden');
        birthdayCard.setAttribute('hidden', '');
    }
}

function showBirthdaySuccessToast() {
    if (!document.body) return;

    const existingToast = document.getElementById('birthday-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'birthday-toast';
    Object.assign(wrapper.style, {
        position: 'fixed',
        left: '50%',
        bottom: '24px',
        transform: 'translateX(-50%)',
        zIndex: '1000',
        transition: 'opacity 0.3s ease',
        opacity: '0',
        pointerEvents: 'none'
    });

    const toast = document.createElement('div');
    Object.assign(toast.style, {
        backgroundColor: '#047857',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '9999px',
        boxShadow: '0 10px 25px rgba(4, 120, 87, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontWeight: '600',
        pointerEvents: 'auto'
    });

    const icon = document.createElement('span');
    icon.textContent = '✓';
    Object.assign(icon.style, {
        fontSize: '18px',
        lineHeight: '1'
    });

    const message = document.createElement('span');
    message.textContent = 'Thanks for joining the Birthday Club! Keep an eye on your inbox.';

    toast.appendChild(icon);
    toast.appendChild(message);
    wrapper.appendChild(toast);
    document.body.appendChild(wrapper);

    requestAnimationFrame(() => {
        wrapper.style.opacity = '1';
    });

    setTimeout(() => {
        wrapper.style.opacity = '0';
        setTimeout(() => {
            if (wrapper.parentNode) {
                wrapper.parentNode.removeChild(wrapper);
            }
        }, 300);
    }, 4000);
}

function handleBirthdaySignup(event) {
    event.preventDefault();
    birthdayError.textContent = '';

    birthdaySubmitButton.disabled = true;
    birthdaySpinner.classList.remove('hidden');
    birthdayButtonText.textContent = 'Signing Up...';

    const email = birthdayEmailInput.value;
    const month = parseInt(birthdayMonthInput.value, 10);
    const day = parseInt(birthdayDayInput.value, 10);

    const resetSubmitButton = () => {
        birthdaySubmitButton.disabled = false;
        birthdaySpinner.classList.add('hidden');
        birthdayButtonText.textContent = 'Sign Me Up!';
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        birthdayError.textContent = 'Please enter a valid email address.';
        resetSubmitButton();
        return;
    }
    
    if (birthdayMonthInput.value === "") {
        birthdayError.textContent = 'Please select your birth month.';
        resetSubmitButton();
        return;
    }

    if (!day || day < 1 || day > 31) {
        birthdayError.textContent = 'Please enter a valid day (1-31).';
        resetSubmitButton();
        return;
    }

    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month - 1]) {
        birthdayError.textContent = `That month only has ${daysInMonth[month - 1]} days.`;
        resetSubmitButton();
        return;
    }

    const { url: mailchimpUrl, tagId, botField } = VENUE_DATA.mailchimp;
    
    const params = new URLSearchParams({
        EMAIL: email,
        'BIRTHDAY[month]': month,
        'BIRTHDAY[day]': day,
        'tags': tagId,
        [botField]: ''
    });

    const callbackName = `jsonp_callback_${Date.now()}`;
    const url = `${mailchimpUrl}&${params.toString()}&c=${callbackName}`;
    
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);

    const cleanup = () => {
        if (window[callbackName]) {
            delete window[callbackName];
        }
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };

    const handleSignupFailure = (message = 'Sorry, we could not complete your signup. Please try again.') => {
        birthdayError.textContent = message;
        cleanup();
        resetSubmitButton();
    };

    const timeoutId = window.setTimeout(() => {
        handleSignupFailure('Request timed out. Please check your connection and try again.');
    }, 10000); // Fall back after 10 seconds if Mailchimp never responds

    script.onerror = () => {
        window.clearTimeout(timeoutId);
        handleSignupFailure('We could not reach the signup service. Please try again in a moment.');
    };

    window[callbackName] = (data) => {
        window.clearTimeout(timeoutId);
        cleanup();
        
        if (data.result === 'success') {
            const storageKey = birthdaySignupStorageKey || 'birthdayClubSignedUp';
            localStorage.setItem(storageKey, 'true');
            birthdayInitialView.classList.add('hidden');
            birthdayThanksView.classList.remove('hidden');
            hideBirthdayCard();
            showBirthdaySuccessToast();
        } else {
            const errorMessage = data.msg.replace(/<[^>]*>?/gm, '').replace(/^\d+\s-\s/, '');
            handleSignupFailure(errorMessage);
        }
    };
}


function clearNotice() {
    const notice = document.getElementById('app-notice');
    if (notice) {
        notice.remove();
    }
    if (mainContent) {
        mainContent.classList.remove('hidden');
    }
    [pubInstagramLink, pubFacebookLink].forEach(link => {
        if (!link) return;
        link.removeAttribute('aria-disabled');
        link.style.pointerEvents = '';
        link.style.opacity = '';
    });
}

function updateHeaderForMessage(title, subtitle) {
    if (pubLogo) {
        pubLogo.removeAttribute('src');
        pubLogo.alt = title;
    }
    if (pubName) {
        pubName.textContent = title;
    }
    if (pubAddress) {
        pubAddress.textContent = subtitle;
    }
    if (pubInstagramHandle) {
        pubInstagramHandle.textContent = '';
    }
    [pubInstagramLink, pubFacebookLink].forEach(link => {
        if (!link) return;
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.5';
    });
    if (copyHandleText) {
        copyHandleText.textContent = 'Copy Handle';
    }
}

function renderNotice(title, message, extraLines = []) {
    if (mainContent) {
        mainContent.classList.add('hidden');
    }
    if (!layoutContainer) return;

    let notice = document.getElementById('app-notice');
    if (notice) {
        notice.remove();
    }

    notice = document.createElement('div');
    notice.id = 'app-notice';
    notice.className = 'bg-white rounded-2xl p-6 shadow-lg text-center space-y-3';

    const headingEl = document.createElement('h2');
    headingEl.className = 'text-2xl font-bold text-gray-800';
    headingEl.textContent = title;
    notice.appendChild(headingEl);

    const fragment = document.createDocumentFragment();
    const mainParagraph = document.createElement('p');
    mainParagraph.className = 'text-gray-600';
    mainParagraph.textContent = message;
    fragment.appendChild(mainParagraph);

    extraLines
        .filter(Boolean)
        .forEach(line => {
            const paragraph = document.createElement('p');
            paragraph.className = 'text-sm text-gray-500';
            paragraph.textContent = line;
            fragment.appendChild(paragraph);
        });

    notice.appendChild(fragment);
    layoutContainer.appendChild(notice);
}

function renderVenueNotFound(requestedId, availableIds = []) {
    const venueList = availableIds.filter(Boolean);
    const availableMessage = venueList.length
        ? `Available venue codes: ${venueList.join(', ')}`
        : '';

    updateHeaderForMessage(
        'Venue not found',
        requestedId
            ? `We couldn't find details for "${requestedId}".`
            : 'No venue was specified.'
    );

    const extraLines = [
        'Please double-check the link or contact the venue for the correct QR code.',
        availableMessage
    ];

    renderNotice('Venue not found', 'We could not load the requested venue details.', extraLines);
}

function renderDataLoadError() {
    updateHeaderForMessage('Unable to load venue', 'Please refresh the page to try again.');
    renderNotice(
        'Something went wrong',
        'We had trouble loading the venue information. Please check your connection and try again.'
    );
}

/**
 * Initializes the application.
 */
async function init() {
    const params = new URLSearchParams(window.location.search);
    const requestedVenueId = params.get('venue');
    const venueId = requestedVenueId || DEFAULT_VENUE_ID;
    birthdaySignupStorageKey = `birthdayClubSignedUp:${venueId}`;
    spinWheelStorageKey = `activePrize:${venueId}`;
    stopClockStorageKey = `stopClockActivePrize:${venueId}`;
    currentVenueId = venueId;

    try {
        const [venuesResponse, globalResponse] = await Promise.all([
            fetch(DATA_PATHS.venues),
            fetch(DATA_PATHS.global)
        ]);

        if (!venuesResponse.ok || !globalResponse.ok) {
            throw new Error('Failed to fetch configuration files.');
        }

        const venues = await venuesResponse.json();
        const globalData = await globalResponse.json();
        const selectedVenue = venues[venueId];

        if (!selectedVenue) {
            renderVenueNotFound(requestedVenueId, Object.keys(venues));
            return;
        }

        VENUE_DATA = selectedVenue;
        GLOBAL_DATA = globalData;
    } catch (error) {
        console.error('Error loading configuration data', error);
        renderDataLoadError();
        return;
    }

    clearNotice();

    const { pubDetails } = VENUE_DATA;
    pubLogo.src = pubDetails.logo;
    pubLogo.alt = `${pubDetails.name} logo`;
    pubName.textContent = pubDetails.name;
    pubAddress.textContent = pubDetails.address;
    pubInstagramLink.href = pubDetails.instagramUrl;
    pubFacebookLink.href = pubDetails.facebookUrl;
    pubInstagramHandle.textContent = pubDetails.instagramHandle;
    copyHandleText.textContent = `Copy Handle ${pubDetails.instagramHandle}`;
    openInstagramLink.href = `https://www.instagram.com/${pubDetails.instagramHandle.substring(1)}/`;
    googleReviewLink.href = VENUE_DATA.googleReviewLink;
    reviewCardTitle.textContent = `Enjoying your time at ${pubDetails.name}?`;

    reviewFeedbackForm.setAttribute('name', VENUE_DATA.feedbackFormId);
    reviewFeedbackFormNameInput.value = VENUE_DATA.feedbackFormId;

    if (GLOBAL_DATA?.trivia?.theme) {
        triviaTheme.textContent = GLOBAL_DATA.trivia.theme;
    }
    if (VENUE_DATA?.birthdayClub?.rewardText) {
        birthdayClubDescription.textContent = VENUE_DATA.birthdayClub.rewardText;
    }

    generateWheelSegments();
    if (!Array.isArray(VENUE_DATA.spinWheel?.prizes) || VENUE_DATA.spinWheel.prizes.length === 0) {
        spinButton.disabled = true;
        spinButton.textContent = 'No prizes configured';
        spinButton.onclick = null;
    } else if (!isSpinning) {
        spinButton.disabled = false;
        spinButton.textContent = 'Spin!';
        spinButton.onclick = null;
    }

    copyHandleButton.addEventListener('click', copyHandleToClipboard);
    startTriviaButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', restartGame);

    if (triviaPlayerNameInput && viewScoreboardButton) {
        triviaPlayerNameInput.addEventListener('input', handleTriviaNameInput);
        viewScoreboardButton.addEventListener('click', (event) => {
            event.preventDefault();
            handleViewScoreboardClick();
        });
        resetTriviaScoreboardState();
    }

    reviewEmojiButtons.forEach(button => button.addEventListener('click', handleReviewEmojiClick));
    reviewFeedbackForm.addEventListener('submit', handleFeedbackSubmit);

    if (localStorage.getItem('birthdayClubSignedUp') === 'true' && !localStorage.getItem(birthdaySignupStorageKey)) {
        localStorage.setItem(birthdaySignupStorageKey, 'true');
        localStorage.removeItem('birthdayClubSignedUp');
    }

    if (!localStorage.getItem(spinWheelStorageKey)) {
        const legacySpinPrize = localStorage.getItem('activePrize');
        if (legacySpinPrize) {
            localStorage.setItem(spinWheelStorageKey, legacySpinPrize);
            localStorage.removeItem('activePrize');
        }
    }

    if (!localStorage.getItem(stopClockStorageKey)) {
        const legacyStopClockPrize = localStorage.getItem('stopClockActivePrize');
        if (legacyStopClockPrize) {
            localStorage.setItem(stopClockStorageKey, legacyStopClockPrize);
            localStorage.removeItem('stopClockActivePrize');
        }
    }

    if (localStorage.getItem(birthdaySignupStorageKey) === 'true') {
        birthdayInitialView.classList.add('hidden');
        birthdayThanksView.classList.remove('hidden');
        hideBirthdayCard();
    } else {
        birthdayForm.addEventListener('submit', handleBirthdaySignup);

        customMonthSelectButton.addEventListener('click', () => {
            const isExpanded = customMonthSelectButton.getAttribute('aria-expanded') === 'true';
            customMonthSelectButton.setAttribute('aria-expanded', String(!isExpanded));
            customMonthSelectOptions.classList.toggle('hidden');
        });

        customMonthSelectOptions.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', () => {
                customMonthSelectValue.textContent = option.textContent;
                customMonthSelectButton.classList.remove('text-gray-500');
                birthdayMonthInput.value = option.dataset.value;
                customMonthSelectOptions.classList.add('hidden');
                customMonthSelectButton.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (event) => {
            if (!customMonthSelect.contains(event.target)) {
                customMonthSelectOptions.classList.add('hidden');
                customMonthSelectButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    showTermsButton.addEventListener('click', () => termsModal.classList.remove('hidden'));
    closeTermsButton.addEventListener('click', () => termsModal.classList.add('hidden'));
    termsModal.addEventListener('click', (e) => { if (e.target === termsModal) termsModal.classList.add('hidden'); });

    showStopClockTermsButton.addEventListener('click', () => stopClockTermsModal.classList.remove('hidden'));
    closeStopClockTermsButton.addEventListener('click', () => stopClockTermsModal.classList.add('hidden'));
    stopClockTermsModal.addEventListener('click', (e) => { if (e.target === stopClockTermsModal) stopClockTermsModal.classList.add('hidden'); });

    showSpinWheelTermsButton.addEventListener('click', () => spinWheelTermsModal.classList.remove('hidden'));
    closeSpinWheelTermsButton.addEventListener('click', () => spinWheelTermsModal.classList.add('hidden'));
    spinWheelTermsModal.addEventListener('click', (e) => { if (e.target === spinWheelTermsModal) spinWheelTermsModal.classList.add('hidden'); });

    showTriviaTermsButton.addEventListener('click', () => triviaTermsModal.classList.remove('hidden'));
    closeTriviaTermsButton.addEventListener('click', () => triviaTermsModal.classList.add('hidden'));
    triviaTermsModal.addEventListener('click', (e) => { if (e.target === triviaTermsModal) triviaTermsModal.classList.add('hidden'); });

    stopClockButton.addEventListener('click', handleStopClockButtonClick);
    stopClockRedeemLaterButton.addEventListener('click', handleStopClockRedeemLater);
    stopClockRedeemNowButton.addEventListener('click', handleStopClockRedeemNow);
    stopClockCancelRedemptionButton.addEventListener('click', handleStopClockCancelRedemption);
    stopClockConfirmRedemptionButton.addEventListener('click', handleStopClockConfirmRedemption);

    const activeStopClockPrize = getActiveStopClockPrize();
    if (activeStopClockPrize) {
        startStopClockCooldownTimer(activeStopClockPrize.expiry);
    }

    spinButton.addEventListener('click', spinTheWheel);
    redeemLaterButton.addEventListener('click', handleRedeemLater);
    redeemNowButton.addEventListener('click', handleRedeemNow);
    cancelRedemptionButton.addEventListener('click', handleCancelRedemption);
    confirmRedemptionButton.addEventListener('click', handleConfirmRedemption);

    const activePrize = getActivePrize();
    if (activePrize) {
        startCooldownTimer(activePrize.expiry);
    }
}

// --- APP START ---
document.addEventListener('DOMContentLoaded', init);

