document.addEventListener('DOMContentLoaded', function() {
  const sampleText = "The quick brown fox jumps over the lazy dog.";
  const sampleTextDiv = document.getElementById('sample-text');
  const typingInput = document.getElementById('typing-input');
  const startTestButton = document.getElementById('start-test');
  let startTime, endTime;

  // Display the sample text
  sampleTextDiv.textContent = sampleText;

  // Function to start the test
  function startTest() {
    typingInput.value = '';
    typingInput.removeAttribute('disabled');
    typingInput.focus();
    startTime = new Date();
    startTestButton.setAttribute('disabled', true);
  }

  // Function to end the test and calculate speed
  function endTest() {
    endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // in seconds
    const wordsTyped = typingInput.value.trim().split(/\s+/).length;
    const speed = Math.round(wordsTyped / timeDiff * 60); // words per minute
    alert(`Your typing speed is ${speed} words per minute.`);
    startTestButton.removeAttribute('disabled');
  }

  // Event listener for the start button
  startTestButton.addEventListener('click', startTest);

  // Event listener for input to check if the typed text matches the sample text
  typingInput.addEventListener('input', function() {
    if (typingInput.value === sampleText) {
      typingInput.setAttribute('disabled', true);
      endTest();
    }
  });
});
