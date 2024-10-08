

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const questionContainer = document.getElementById("questionContainer");
  const submitQuizButton = document.getElementById("submitQuiz");
  const resultsContainer = document.getElementById("resultsContainer");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const errorMessage = document.getElementById("errorMessage");
  const quizTopic = document.getElementById("quizTopic");
  const score = document.getElementById("score");
  const questionReview = document.getElementById("questionReview");
  const newQuizButton = document.getElementById("newQuiz");
  const timerDisplay = document.getElementById("timerDisplay");

  let currentQuestions = [];
  let allQuestions = []; // Store all questions to avoid repetition
  let startTime;
  let timerInterval;
  let elapsedTime = 0;

  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const topic = urlParams.get("topic");
  const difficulty = urlParams.get("difficulty");
  const numQuestions = urlParams.get("numQuestions");

  // Check if there's a saved quiz state
  const savedState = JSON.parse(localStorage.getItem("quizState"));
  if (
    savedState &&
    savedState.topic === topic &&
    savedState.difficulty === difficulty &&
    savedState.numQuestions === numQuestions
  ) {
    currentQuestions = savedState.questions;
    allQuestions = savedState.allQuestions || [];
    elapsedTime = savedState.elapsedTime;
    displayQuiz(topic, currentQuestions);
    restoreUserAnswers(savedState.userAnswers);
    startTimer(elapsedTime);
  } else if (topic && difficulty && numQuestions) {
    fetchQuizQuestions(topic, difficulty, numQuestions);
  } else {
    showError("Invalid quiz parameters. Please start a new quiz.");
  }

  async function fetchQuizQuestions(topic, difficulty, numQuestions, existingQuestions = []) {
    try {
      showLoading();
      const response = await fetch("api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions: parseInt(numQuestions),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      hideLoading();
      if (data && data.length > 0) {
        // Filter out any questions that already exist
        const newQuestions = data.filter(
          (question) =>
            !existingQuestions.some((eq) => eq.question === question.question)
        );
  
        // If we don't have enough new questions, fetch more
        if (newQuestions.length < numQuestions) {
          const additionalQuestions = await fetchAdditionalQuestions(
            topic,
            difficulty,
            numQuestions - newQuestions.length,
            [...existingQuestions, ...newQuestions]
          );
          newQuestions.push(...additionalQuestions);
        }
  
        currentQuestions = newQuestions.slice(0, numQuestions);
        allQuestions = [...existingQuestions, ...newQuestions];
        displayQuiz(topic, currentQuestions);
        startTimer();
        saveQuizState();
      } else {
        showError(
          "No questions were generated. Please try a different topic or difficulty."
        );
      }
    } catch (error) {
      hideLoading();
      showError("Failed to fetch quiz questions: " + error.message);
    }
  }

// Add a new helper function to fetch additional questions if needed
async function fetchAdditionalQuestions(topic, difficulty, numNeeded, existingQuestions) {
    let attempts = 0;
    const maxAttempts = 3;
    let additionalQuestions = [];
  
    while (additionalQuestions.length < numNeeded && attempts < maxAttempts) {
      attempts++;
      const response = await fetch("api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions: numNeeded,
        }),
      });
  
      if (!response.ok) continue;
  
      const data = await response.json();
      if (!data || !data.length) continue;
  
      const newQuestions = data.filter(
        (question) =>
          !existingQuestions.some((eq) => eq.question === question.question) &&
          !additionalQuestions.some((aq) => aq.question === question.question)
      );
  
      additionalQuestions.push(...newQuestions);
    }
  
    return additionalQuestions;
  }

  function displayQuiz(topic, questions) {
    if (quizContainer) quizContainer.style.display = "block";
    if (resultsContainer) resultsContainer.style.display = "none";
    if (quizTopic) quizTopic.textContent = `Quiz on ${topic}`;

    if (questionContainer) {
      questionContainer.innerHTML = questions
        .map(
          (question, index) => `
                <div class="question mb-4">
                    <p class="fw-bold">${index + 1}. ${question.question}</p>
                    ${question.options
                      .map(
                        (option, optionIndex) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="q${index}" id="q${index}o${optionIndex}" value="${optionIndex}">
                            <label class="form-check-label" for="q${index}o${optionIndex}">
                                ${option}
                            </label>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `
        )
        .join("");
    }

    if (submitQuizButton) submitQuizButton.style.display = "block";

    // Add event listeners to save state on answer change
    const radioButtons = questionContainer.querySelectorAll(
      'input[type="radio"]'
    );
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", saveQuizState);
    });
  }

  function startTimer(savedTime = 0) {
    startTime = Date.now() - savedTime;
    if (timerDisplay) {
      timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        timerDisplay.textContent = `Time: ${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        saveQuizState();
      }, 1000);
    }
  }

  function stopTimer() {
    clearInterval(timerInterval);
    return elapsedTime;
  }

  function saveQuizState() {
    const userAnswers = getUserAnswers();
    const state = {
      topic: urlParams.get("topic"),
      difficulty: urlParams.get("difficulty"),
      numQuestions: urlParams.get("numQuestions"),
      questions: currentQuestions,
      allQuestions: allQuestions,
      userAnswers: userAnswers,
      elapsedTime: elapsedTime,
    };
    localStorage.setItem("quizState", JSON.stringify(state));
  }

  function getUserAnswers() {
    return Array.from(
      questionContainer.querySelectorAll('input[type="radio"]:checked')
    ).map((input) => parseInt(input.value));
  }

  function restoreUserAnswers(userAnswers) {
    userAnswers.forEach((answer, index) => {
      const radio = document.getElementById(`q${index}o${answer}`);
      if (radio) radio.checked = true;
    });
  }

  if (submitQuizButton) {
    submitQuizButton.addEventListener("click", () => {
      const answers = getUserAnswers();
      if (answers.length !== currentQuestions.length) {
        alert("Please answer all questions before submitting.");
        return;
      }

      const totalTime = stopTimer();
      const results = currentQuestions.map((question, index) => ({
        question: question.question,
        userAnswer: question.options[answers[index]],
        correctAnswer: question.options[question.correctAnswer],
        isCorrect: answers[index] === question.correctAnswer,
      }));

      displayResults(results, totalTime);
      localStorage.removeItem("quizState"); // Clear saved state after submission

      // Scroll to the results section
      resultsContainer.scrollIntoView({ behavior: "smooth" });
    });
  }

  function displayResults(results, totalTime) {
    if (quizContainer) quizContainer.style.display = "none";
    if (resultsContainer) resultsContainer.style.display = "block";

    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const totalQuestions = results.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    const avgTimePerQuestion = (totalTime / totalQuestions / 1000).toFixed(2);

    if (resultsContainer) {
      resultsContainer.innerHTML = `
                <h2 class="mb-4">Quiz Results</h2>
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">Performance Summary</h3>
                        <p class="card-text">Score: ${correctAnswers} out of ${totalQuestions} (${percentage}%)</p>
                        <p class="card-text">Time taken: ${timeString}</p>
                        <p class="card-text">Average time per question: ${avgTimePerQuestion} seconds</p>
                       <div class="mt-4">
                          <button id="moreQuestionsButton" class="btn btn-secondary me-2">Generate More Questions</button>
                          <button id="newQuizButton" class="btn btn-primary">Start New Quiz</button>
                        </div>
                    </div>
                    <div class= "space"> </div>
                </div>
                    </div>
                </div>
                <h3 class="mt-4">Question Review</h3>
                <div id="questionReview"></div>
            `;
    }

    const questionReview = document.getElementById("questionReview");
    if (questionReview) {
      questionReview.innerHTML = results
        .map(
          (result, index) => `
            <div class="card mb-3 review-question ${
              result.isCorrect ? "correct" : "incorrect"
            }">
              <div class="card-body">
                <h5 class="card-title">Question ${index + 1}</h5>
                <p class="card-text">${result.question}</p>
                <p class="card-text user-answer ${
                  result.isCorrect ? "text-success" : "text-danger"
                }">
                  Your answer: ${result.userAnswer}
                </p>
                <p class="card-text correct-answer">
                  Correct answer: ${result.correctAnswer}
                </p>
              </div>
            </div>
          `
        )
        .join("");
    }

    saveResultsToServer(correctAnswers, totalQuestions, totalTime);

    const newQuizButton = document.getElementById("newQuizButton");
    if (newQuizButton) {
      newQuizButton.addEventListener("click", startNewQuiz);
    }

    const moreQuestionsButton = document.getElementById("moreQuestionsButton");
    if (moreQuestionsButton) {
      moreQuestionsButton.addEventListener("click", generateMoreQuestions);
    }

    const newTopicButton = document.getElementById("newTopicButton");
    if (newTopicButton) {
      newTopicButton.addEventListener("click", startNewTopic);
    }
  }

  async function saveResultsToServer(score, totalQuestions, totalTime) {
    try {
      const topic = quizTopic
        ? quizTopic.textContent.replace("Quiz on ", "")
        : "Unknown Topic";
      const difficulty = urlParams.get("difficulty") || "Unknown Difficulty";

      const response = await fetch("results.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty,
          score: score,
          totalQuestions: totalQuestions,
          timeTaken: totalTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Results saved:", data);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  }

  function startNewQuiz() {
    localStorage.removeItem("quizState");
    window.location.href = "index.php";
  }

  function startNewTopic() {
    localStorage.removeItem("quizState");
    window.location.href = "index.php";
  }

// Find and modify the generateMoreQuestions function
function generateMoreQuestions() {
    const topic = urlParams.get("topic");
    const difficulty = urlParams.get("difficulty");
    const numQuestions = urlParams.get("numQuestions");
  
    // Hide results container and show quiz container
    if (resultsContainer) resultsContainer.style.display = "none";
    if (quizContainer) quizContainer.style.display = "block";
    
    // Show loading indicator
    showLoading();
    
    // Clear previous questions
    if (questionContainer) questionContainer.innerHTML = '';
    
    fetchQuizQuestions(topic, difficulty, numQuestions, allQuestions);
  }

  function showLoading() {
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
      // Ensure the loading indicator is visible within the quiz container
      if (quizContainer) {
        quizContainer.style.position = 'relative';
        loadingIndicator.style.position = 'absolute';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.zIndex = '1000';
      }
    }
    if (errorMessage) errorMessage.style.display = "none";
  }

  function hideLoading() {
    if (loadingIndicator) loadingIndicator.style.display = "none";
  }

  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
      setTimeout(() => {
        if (errorMessage) errorMessage.style.display = "none";
      }, 5000); // Hide error message after 5 seconds
    }
    console.error("Error:", message);
  }
});
