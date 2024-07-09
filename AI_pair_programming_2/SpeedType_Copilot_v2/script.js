// Declare variables for elements
const textToType = document.getElementById('text-to-type');
const typingArea = document.getElementById('typing-input');
const timer = document.getElementById('timer');
const wpm = document.getElementById('wpm');
const accuracy = document.getElementById('accuracy');
const startButton = document.getElementById('start-button');
const shareButton = document.getElementById('share-button');
const testDuration = 60; // Example: 60 seconds
let startTime;
let interval;
let isTestRunning = false;

// Function to generate random text based on difficulty
const textExamples = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "Actions speak louder than words.",
        // ...
    ],
    medium: [
        "To be or not to be, that is the question.",
        "I have a dream that one day this nation will rise up and live out the true meaning of its creed.",
        // ...
    ],
    hard: [
        "I am the master of my fate: I am the captain of my soul.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
        // ...
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
    if (isTestRunning) {
        // Stop the test if it's already running
        endTest();
    } else {
        // Start a new test
        isTestRunning = true;
        startButton.textContent = "Stop Test";
        startButton.classList.add('btn-warning');
        startButton.classList.remove('btn-primary');

        // Reset the typing area, metrics, and disable the start button
        typingArea.value = '';
        wpm.textContent = '0';
        accuracy.textContent = '100%';
        startButton.disabled = false;

        // Generate random text and set it for typing
        const randomText = generateRandomText(document.getElementById('difficulty').value);
        textToType.textContent = randomText;

        // Calculate the start time, set the timer, and focus on the typing area
        startTime = new Date();
        interval = setInterval(updateTimer, 100); // Update timer every 100 milliseconds
        typingArea.disabled = false; // Ensure typing area is enabled
        typingArea.focus(); // Focus on the typing area to start typing immediately
    }
}

function endTest() {
    isTestRunning = false;
    clearInterval(interval); // Stop the timer
    startButton.textContent = "Start Test";
    startButton.classList.remove('btn-warning');
    startButton.classList.add('btn-primary');
    calculateResults();
    typingArea.disabled = true; // Disable typing area to prevent further typing
}

function calculateResults() {
    const wordsPerMinute = calculateTypingSpeed(typingArea.value.trim().split(' ').length, (new Date() - startTime) / 1000);
    const accuracyPercentage = calculateAccuracyPercentage(typingArea.value, textToType.textContent);

    // Display results
    wpm.textContent = wordsPerMinute;
    accuracy.textContent = `${accuracyPercentage}%`;

    // Enable and display the share button
    shareButton.style.display = 'inline-block';
    shareButton.removeAttribute('disabled'); // Use removeAttribute for disabling
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