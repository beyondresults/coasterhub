
    // --- DATA CONFIGURATION ---
// In a multi-venue setup, these would be loaded from external JSON files.

const VENUE_DATA = {
  "pubDetails": {
    "name": "The Palace",
    "address": "505-507 City Rd, South Melbourne VIC 3205",
    "logo": "https://cdn.prod.website-files.com/6105ed3c5ed41e814ab426cd/68d79bff223cfd256eb4c20f_images%20(5).png",
    "instagramHandle": "@thepalacehotel",
    "instagramUrl": "https://www.instagram.com/thepalacehotel/",
    "facebookUrl": "https://www.facebook.com/thepalacehotelsouthmelbourne/"
  },
  "googleReviewLink": "https://www.google.com/search?q=The+Palace+Hotel+South+Melbourne",
  "feedbackFormId": "the-palace-feedback",
  "mailchimp": {
    "url": "https://beyondresults.us14.list-manage.com/subscribe/post-json?u=f7e66d56d4c9bf137a316d28c&id=313f667833",
    "tagId": "7327771",
    "botField": "b_f7e66d56d4c9bf137a316d28c_313f667833"
  },
  "birthdayClub": {
    "rewardText": "We'll send you a voucher for a free drink during your birthday week!"
  },
  "spinWheel": {
    "cooldownDurationHours": 2,
    "prizes": [
      { "text": "$10 off food when you spend $50+", "odds": 0.4 },
      { "text": "Free chips with any drink purchase", "odds": 0.2 },
      { "text": "Pay schooner price for a pint", "odds": 0.2 },
      { "text": "Free soft drink", "odds": 0.2 }
    ]
  },
  "stopTheClock": {
    "cooldownDurationHours": 2,
    "prizeText": "A free pot of beer (or soft drink)"
  }
};

const GLOBAL_DATA = {
  "trivia": {
    "theme": "AFL (Australian Football League)",
    "questions": [
        {
            "question": "Which club holds the record for the most VFL/AFL Premierships?",
            "options": ["Carlton", "Collingwood", "Essendon", "Richmond"],
            "correctAnswer": "Carlton"
        },
        {
            "question": "Who has kicked the most goals in VFL/AFL history?",
            "options": ["Gary Ablett Sr.", "Jason Dunstall", "Gordon Coventry", "Tony Lockett"],
            "correctAnswer": "Tony Lockett"
        },
        {
            "question": "Which player has won the most Brownlow Medals?",
            "options": ["Dick Reynolds", "Haydn Bunton Sr.", "Ian Stewart", "Nat Fyfe"],
            "correctAnswer": "Nat Fyfe"
        },
        {
            "question": "What year was the Australian Football League (AFL) officially formed, succeeding the VFL?",
            "options": ["1985", "1990", "1995", "2000"],
            "correctAnswer": "1990"
        },
        {
            "question": "Which team won the inaugural AFLW premiership in 2017?",
            "options": ["Brisbane Lions", "Adelaide Crows", "Western Bulldogs", "Collingwood"],
            "correctAnswer": "Adelaide Crows"
        },
        {
            "question": "What is the nickname of the Hawthorn Football Club?",
            "options": ["The Eagles", "The Hawks", "The Power", "The Suns"],
            "correctAnswer": "The Hawks"
        },
        {
            "question": "The 'Grand Final' is traditionally played at which stadium?",
            "options": ["Optus Stadium", "The Gabba", "Adelaide Oval", "MCG"],
            "correctAnswer": "MCG"
        },
        {
            "question": "Who is the current CEO of the AFL?",
            "options": ["Gillon McLachlan", "Andrew Dillon", "Eddie McGuire", "Jeff Kennett"],
            "correctAnswer": "Andrew Dillon"
        },
        {
            "question": "Which two teams compete in the 'Showdown'?",
            "options": ["West Coast & Fremantle", "Sydney & GWS", "Adelaide & Port Adelaide", "Collingwood & Carlton"],
            "correctAnswer": "Adelaide & Port Adelaide"
        },
        {
            "question": "A 'torpedo' or 'torp' is a type of what in AFL?",
            "options": ["Tackle", "Kick", "Handball", "Mark"],
            "correctAnswer": "Kick"
        }
    ]
  }
};


// --- STATE ---
let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;
let isSpinning = false;
let currentRotation = 0;
let cooldownInterval;
let wheelSegmentsData = []; // To store prize data with angles

// Stop the clock game state
let stopClockInterval = null;
let stopClockStartTime = 0;
let stopClockGameState = 'idle'; // 'idle', 'running', 'stopped'
let stopClockCooldownInterval;

// Trivia game state
let triviaTimerInterval = null;
let triviaStartTime = 0;


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
  navigator.clipboard.writeText(VENUE_DATA.pubDetails.instagramHandle).then(() => {
    copyHandleText.textContent = 'Copied!';
    copyIconWrapper.classList.add('hidden');
    checkIconWrapper.classList.remove('hidden');

    setTimeout(() => {
      copyHandleText.textContent = `Copy Handle ${VENUE_DATA.pubDetails.instagramHandle}`;
      copyIconWrapper.classList.remove('hidden');
      checkIconWrapper.classList.add('hidden');
    }, 2000);
  });
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
    const prizeData = localStorage.getItem('stopClockActivePrize');
    if (!prizeData) return null;
    try {
        const prize = JSON.parse(prizeData);
        if (Date.now() > prize.expiry) {
            localStorage.removeItem('stopClockActivePrize');
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
            localStorage.removeItem('stopClockActivePrize');
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
        localStorage.setItem('stopClockActivePrize', JSON.stringify(prize));
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
        localStorage.setItem('stopClockActivePrize', JSON.stringify(prizeData));
        
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
    const prizes = VENUE_DATA.spinWheel.prizes;
    const colors = ["#ef4444", "#f97316", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899"];
    let currentAngle = 0;
    
    wheelSegmentsData = []; // Reset segment data
    wheelSegmentsContainer.innerHTML = ''; // Clear existing segments

    prizes.forEach((prize, index) => {
        const angle = prize.odds * 360;
        const segmentData = {
            prize: prize,
            minAngle: currentAngle,
            maxAngle: currentAngle + angle
        };
        wheelSegmentsData.push(segmentData);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", describeArc(100, 100, 100, currentAngle, currentAngle + angle));
        path.setAttribute("fill", colors[index % colors.length]);
        wheelSegmentsContainer.appendChild(path);

        currentAngle += angle;
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
            localStorage.removeItem('activePrize');
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
        localStorage.setItem('activePrize', JSON.stringify(prizeData));
        showPrizeModal();
        startCooldownTimer(expiryTime);
    }, { once: true });
}

function getActivePrize() {
    const prizeData = localStorage.getItem('activePrize');
    if (!prizeData) return null;
    try {
        const prize = JSON.parse(prizeData);
        if (Date.now() > prize.expiry) {
            localStorage.removeItem('activePrize');
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
        localStorage.setItem('activePrize', JSON.stringify(prize));
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
  const finalTime = ((Date.now() - triviaStartTime) / 1000).toFixed(2);
  const totalQuestionCount = GLOBAL_DATA.trivia.questions.length;
  const percentage = Math.round((score / totalQuestionCount) * 100);

  finalScore.textContent = score;
  totalQuestions.textContent = totalQuestionCount;
  scorePercentage.textContent = `(${percentage}%)`;
  finalTimeDisplay.innerHTML = `Your time: <span class="font-bold text-gray-800">${finalTime}s</span>`;

  triviaPlayingScreen.classList.add('hidden');
  triviaFinishedScreen.classList.remove('hidden');
}

function restartGame() {
    if (triviaTimerInterval) clearInterval(triviaTimerInterval);
    triviaFinishedScreen.classList.add('hidden');
    triviaStartScreen.classList.remove('hidden');
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

function handleFeedbackSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    reviewSubmitFeedbackButton.disabled = true;
    reviewSubmitFeedbackButton.textContent = 'Submitting...';

    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        reviewFeedbackForm.classList.add('hidden');
        reviewCardTitle.textContent = 'Thank You!';
        reviewCardSubtitle.classList.add('hidden');
        reviewFeedbackThanks.classList.remove('hidden');
    })
    .catch((error) => {
        alert('Sorry, there was an error submitting your feedback.');
        console.error(error);
    })
    .finally(() => {
        reviewSubmitFeedbackButton.disabled = false;
        reviewSubmitFeedbackButton.textContent = 'Submit Feedback';
    });
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

    window[callbackName] = (data) => {
        delete window[callbackName];
        document.head.removeChild(script);
        
        if (data.result === 'success') {
            localStorage.setItem('birthdayClubSignedUp', 'true');
            birthdayInitialView.classList.add('hidden');
            birthdayThanksView.classList.remove('hidden');
        } else {
            const errorMessage = data.msg.replace(/<[^>]*>?/gm, '').replace(/^\d+\s-\s/, '');
            birthdayError.textContent = errorMessage;
            resetSubmitButton();
        }
    };
}


/**
 * Initializes the application.
 */
function init() {
  // Populate pub details
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
  
  // Configure Netlify form
  reviewFeedbackForm.setAttribute('name', VENUE_DATA.feedbackFormId);
  reviewFeedbackFormNameInput.value = VENUE_DATA.feedbackFormId;

  // Populate dynamic text
  triviaTheme.textContent = GLOBAL_DATA.trivia.theme;
  birthdayClubDescription.textContent = VENUE_DATA.birthdayClub.rewardText;

  // Generate wheel
  generateWheelSegments();
  
  // Add event listeners
  copyHandleButton.addEventListener('click', copyHandleToClipboard);
  startTriviaButton.addEventListener('click', startGame);
  playAgainButton.addEventListener('click', restartGame);
  
  reviewEmojiButtons.forEach(button => button.addEventListener('click', handleReviewEmojiClick));
  reviewFeedbackForm.addEventListener('submit', handleFeedbackSubmit);

  // Birthday Club
  if (localStorage.getItem('birthdayClubSignedUp') === 'true') {
      birthdayInitialView.classList.add('hidden');
      birthdayThanksView.classList.remove('hidden');
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

  // Modal listeners
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

  // Stop the clock game listeners
  stopClockButton.addEventListener('click', handleStopClockButtonClick);
  stopClockRedeemLaterButton.addEventListener('click', handleStopClockRedeemLater);
  stopClockRedeemNowButton.addEventListener('click', handleStopClockRedeemNow);
  stopClockCancelRedemptionButton.addEventListener('click', handleStopClockCancelRedemption);
  stopClockConfirmRedemptionButton.addEventListener('click', handleStopClockConfirmRedemption);
  
  const activeStopClockPrize = getActiveStopClockPrize();
  if (activeStopClockPrize) {
      startStopClockCooldownTimer(activeStopClockPrize.expiry);
  }

  // Spin wheel and prize modal listeners
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
