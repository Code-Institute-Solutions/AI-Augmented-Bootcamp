// Declare variables for elements
const textToType = document.getElementById('text-to-type');
const typingArea = document.getElementById('typing-input');
const timer = document.getElementById('timer');
const wpm = document.getElementById('wpm');
const accuracy = document.getElementById('accuracy');
const startButton = document.getElementById('start-button');
const shareButton = document.getElementById('share-button');
const timerElement = document.getElementById('timer');
const testDuration = 60; // Example: 60 seconds
let startTime;
let interval;

// Function to generate random text based on difficulty
const textExamples = {
    easy: [
            "The quick brown fox jumps over the lazy dog.",
            "A journey of a thousand miles begins with a single step.",
            "Actions speak louder than words.",
            "All that glitters is not gold.",
            "Better late than never.",
            "Every cloud has a silver lining.",
            "Good things come to those who wait.",
            "Honesty is the best policy.",
            "Laughter is the best medicine.",
            "Practice makes perfect.",
            "Slow and steady wins the race.",
            "Time flies when you're having fun.",
            "Where there's a will, there's a way.",
            "You can't judge a book by its cover.",
            "A picture is worth a thousand words."
        ],
        medium: [
            "To be or not to be, that is the question.",
            "I have a dream that one day this nation will rise up and live out the true meaning of its creed.",
            "Ask not what your country can do for you – ask what you can do for your country.",
            "The only way to do great work is to love what you do.",
            "In the end, it's not the years in your life that count. It's the life in your years.",
            "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
            "Life is what happens to you while you're busy making other plans.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.",
            "The only impossible journey is the one you never begin.",
            "Believe you can and you're halfway there.",
            "It does not matter how slowly you go as long as you do not stop.",
            "The best way to predict the future is to create it.",
            "Strive not to be a success, but rather to be of value."
        ],
        hard: [
            "I am the master of my fate: I am the captain of my soul.",
            "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
            "Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.",
            "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights.",
            "The only thing we have to fear is fear itself—nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance.",
            "It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better.",
            "Ask not what your country can do for you — ask what you can do for your country. My fellow citizens of the world: ask not what America will do for you, but what together we can do for the freedom of man.",
            "I have a dream that one day this nation will rise up and live out the true meaning of its creed: 'We hold these truths to be self-evident, that all men are created equal.'",
            "Fourscore and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.",
            "The problems of the world cannot possibly be solved by skeptics or cynics whose horizons are limited by the obvious realities. We need men who can dream of things that never were.",
            "It is not the strength of the body that counts, but the strength of the spirit.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "I learned that courage was not the absence of fear, but the triumph over it. The brave man is not he who does not feel afraid, but he who conquers that fear.",
            "The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy.",
            "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway."
        ]
    };

function generateRandomText(difficulty) {
    const texts = textExamples[difficulty];
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
    const timeRemaining = testDuration - elapsedTime;

    if (timeRemaining >= 0) {
        // Update the timer on the screen
        timer.textContent = timeRemaining.toFixed(2);
    } else {
        // Time is up
        clearInterval(interval);
        // Enable the start button for a new test
        startButton.disabled = false;
        // Call function to calculate WPM and accuracy
        calculateResults();
        // Call endTest here, as the test is now complete
        endTest();
    }
}

function startTypingTest() {
    // Reset the typing area, metrics, and disable the start button
    typingArea.value = '';
    wpm.textContent = '0';
    accuracy.textContent = '100%';
    startButton.disabled = true;

    // Generate random text and set it for typing
    const randomText = generateRandomText(document.getElementById('difficulty').value);
    textToType.textContent = randomText;

    // Calculate the start time, set the timer, and focus on the typing area
    startTime = new Date();
    interval = setInterval(updateTimer, 100); // Update timer every 100 milliseconds
    typingArea.disabled = false; // Ensure typing area is enabled
    typingArea.focus(); // Focus on the typing area to start typing immediately
}

startButton.addEventListener('click', startTypingTest);

function formatTime(seconds) {
    // Format time as mm:ss
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function endTest() {
    console.log("endTest function called"); // Verify the function is called

    // Assuming calculation of wordsPerMinute and accuracy is done here
    const wordsPerMinute = calculateTypingSpeed(typingArea.value.trim().split(' ').length, (new Date() - startTime) / 1000);
    const accuracy = calculateAccuracyPercentage(typingArea.value, textToType.textContent);

    // Display results
    wpm.textContent = wordsPerMinute;
    accuracy.textContent = `${accuracy}%`;

    // Call shareResults to add sharing functionality
    shareResults(wordsPerMinute, accuracy);
    
    // Enable and display the start button
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.style.display = 'inline-block';
        startButton.textContent = 'Restart Test';
        startButton.removeAttribute('disabled'); // Use removeAttribute for disabling
    } else {
        console.error("Start button not found");
    }

    // Enable and display the share button
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
        shareButton.style.display = 'inline-block';
        shareButton.removeAttribute('disabled'); // Use removeAttribute for disabling
    } else {
        console.error("Share button not found");
    }
}

function calculateAccuracyPercentage(typedText, originalText) {
    const typedWords = typedText.trim().split(' ');
    const originalWords = originalText.trim().split(' ');
    const totalWords = originalWords.length;
    let correctWords = 0;

    typedWords.forEach((word, index) => {
        if (word === originalWords[index]) {
            correctWords++;
        }
    });

    return ((correctWords / totalWords) * 100).toFixed(2);
}

function calculateTypingSpeed(wordCount, elapsedTime) {
    const minutes = elapsedTime / 60;
    const wordsPerMinute = Math.round(wordCount / minutes);
    return wordsPerMinute;
}

function shareResults(wordsPerMinute, accuracy) {
    // Get the share button element
    const shareButton = document.getElementById('share-button');

    // Update the button text and display style
    shareButton.textContent = 'Share Results';
    shareButton.style.display = 'inline';

    // Add click event listener to the share button
    shareButton.addEventListener('click', function() {
        const tweetText = `I typed ${wordsPerMinute} words per minute with an accuracy of ${accuracy}% on this typing test!`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, '_blank'); // Open Twitter in a new tab
    });
}

function startTypingTest() {
    // Reset the typing area, metrics, and disable the start button
    typingArea.value = '';
    wpm.textContent = '0';
    accuracy.textContent = '100%';
    startButton.disabled = true;

    // Generate random text and set it for typing
    const randomText = generateRandomText(document.getElementById('difficulty').value);
    textToType.textContent = randomText;

    // Calculate the start time, set the timer, and focus on the typing area
    startTime = new Date();
    interval = setInterval(updateTimer, 100); // Update timer every 100 milliseconds
    typingArea.disabled = false; // Ensure typing area is enabled
    typingArea.focus(); // Focus on the typing area to start typing immediately
}

// Simplified event listener for start button click
startButton.addEventListener('click', startTypingTest);
// Event listener for typing input
typingArea.addEventListener('input', function() {
    // Get the current text from the typing area and the expected text
    const typedText = typingArea.value;
    const originalText = textToType.textContent;

    // Compare the two texts character by character
    let displayText = '';
    let isCorrectSoFar = true;
    for (let i = 0; i < originalText.length; i++) {
        const typedChar = typedText[i];
        const originalChar = originalText[i];

        // If the typed character exists and matches the original character, mark as correct; otherwise, incorrect
        const charClass = (typedChar && typedChar === originalChar) ? 'correct' : 'incorrect';
        // Only apply incorrect class if a character has been typed
        const effectiveClass = typedChar ? charClass : '';
        displayText += `<span class="${effectiveClass}">${originalChar}</span>`;

        if (charClass === 'incorrect') isCorrectSoFar = false;
    }

    // Update the text in the text-to-type area with the formatted display text
    textToType.innerHTML = displayText;

    // Check if the entire text has been typed correctly
    if (isCorrectSoFar && typedText.length === originalText.length) {
        // Stop the timer
        clearInterval(interval); // Assuming 'interval' is the timer variable
        // Call endTest here, as the test is now complete
        endTest();
        // Optionally, disable the typing area to prevent further typing
        typingArea.disabled = true;
    }
});

// Function to calculate accuracy percentage
function calculateAccuracyPercentage(typedText, originalText) {
    const typedWords = typedText.trim().split(' ');
    const originalWords = originalText.trim().split(' ');
    const totalWords = originalWords.length;
    let correctWords = 0;

    for (let i = 0; i < typedWords.length; i++) {
        if (typedWords[i] === originalWords[i]) {
            correctWords++;
        }
    }

    return ((correctWords / totalWords) * 100).toFixed(2);
}

// Function to calculate typing speed (words per minute)
function calculateTypingSpeed(wordCount, elapsedTime) {
    const minutes = elapsedTime / 60;
    const typingSpeed = Math.round(wordCount / minutes);
    return typingSpeed;
}
