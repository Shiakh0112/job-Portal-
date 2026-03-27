// ==================== INDEX PAGE LOGIC ====================

async function loadTests() {
  const testListContainer = document.getElementById("test-list");
  const loadingMessage = document.getElementById("loading-message");

  const user = JSON.parse(localStorage.getItem("user"));

  const testScores = user
    ? JSON.parse(localStorage.getItem("testScores")) || []
    : [];

  const userTestScores = user
    ? testScores.filter((score) => score.userId === user.id)
    : [];

  try {
    // ✅ JSON fetch
    const response = await fetch("test.json");
    const data = await response.json();
    const tests = data.tests;

    loadingMessage.style.display = "none";
    testListContainer.innerHTML = "";

    tests.forEach((test) => {
      const card = document.createElement("div");
      card.className = "test-card";

      const completedTest = userTestScores.find(
        (score) => score.testId === test.id,
      );

      const isCompleted = completedTest !== undefined;

      card.innerHTML = `
        <img src="${test.image}" alt="${test.title}">
        <div class="test-card-content">
          <h2>${test.title}</h2>
          <p>${test.description}</p>
          <p><strong>Duration:</strong> ${test.duration}</p>
          <p><strong>Skills:</strong> ${test.skills.join(", ")}</p>
          ${
            isCompleted
              ? `<p class="completed-test">Completed - Score: ${completedTest.percentage}%</p>`
              : ""
          }
        </div>
        <div class="card-footer">
          <span>Questions: ${test.questions}</span>
          <button class="start-test-btn ${
            isCompleted ? "completed" : ""
          }" data-test-id="${test.id}">
            ${isCompleted ? "Retake Test" : "Start Test"}
          </button>
        </div>
      `;

      testListContainer.appendChild(card);
    });

    // ✅ Button click
    testListContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("start-test-btn")) {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          alert("Please login first!");
          window.location.href = "../../login.html";
          return;
        }

        const testId = parseInt(event.target.getAttribute("data-test-id"));

        const selectedTest = tests.find((t) => t.id === testId);

        localStorage.setItem("currentTest", JSON.stringify(selectedTest));
        window.location.href = "test.html";
      }
    });
  } catch (error) {
    loadingMessage.textContent =
      "Failed to load tests. Please try again later.";
    loadingMessage.style.color = "red";
    console.error("Error:", error);
  }
}

// ==================== TEST PAGE LOGIC ====================

let currentTest;
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

// ✅ Save score
function saveTestScore(testId, testTitle, score, totalQuestions) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const testScores = JSON.parse(localStorage.getItem("testScores")) || [];

  const existingIndex = testScores.findIndex(
    (s) => s.userId === user.id && s.testId === testId,
  );

  const percentage = Math.round((score / totalQuestions) * 100);

  const newScore = {
    userId: user.id,
    testId,
    testTitle,
    score,
    totalQuestions,
    percentage,
    completedAt: new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    if (percentage > testScores[existingIndex].percentage) {
      testScores[existingIndex] = newScore;
    }
  } else {
    testScores.push(newScore);
  }

  localStorage.setItem("testScores", JSON.stringify(testScores));
}

// ✅ Start quiz
function startQuiz() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login!");
    window.location.href = "../login.html";
    return;
  }

  const testData = localStorage.getItem("currentTest");

  if (!testData) {
    window.location.href = "index.html";
    return;
  }

  currentTest = JSON.parse(testData);
  currentQuestionIndex = 0;
  score = 0;

  if (!currentTest.testQuestions || currentTest.testQuestions.length === 0) {
    alert("No questions found!");
    window.location.href = "index.html";
    return;
  }

  displayTestInfo();
  displayQuestion();
  startTimer();
}

// ✅ Test title
function displayTestInfo() {
  document.getElementById("test-info").innerHTML =
    `<h2>${currentTest.title}</h2>`;
}

// ✅ Show question
function displayQuestion() {
  const questionContainer = document.getElementById("question-container");
  const optionsContainer = document.getElementById("options-container");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const q = currentTest.testQuestions[currentQuestionIndex];

  questionContainer.innerHTML = `
    <p>Q${currentQuestionIndex + 1}/${currentTest.testQuestions.length}: ${q.question}</p>
  `;

  optionsContainer.innerHTML = "";

  q.options.forEach((opt, i) => {
    optionsContainer.innerHTML += `
      <label>
        <input type="radio" name="answer" value="${opt}">
        ${opt}
      </label>
    `;
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent =
    currentQuestionIndex === currentTest.testQuestions.length - 1
      ? "Submit"
      : "Next";
}

// ✅ Timer
function startTimer() {
  const timerElement = document.getElementById("time-left");

  let timeLeft = parseInt(currentTest.duration) * 60;

  timerInterval = setInterval(() => {
    timeLeft--;

    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    timerElement.textContent = `${min}:${sec}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

// ✅ Next
function nextQuestion() {
  const selected = document.querySelector('input[name="answer"]:checked');

  if (!selected) {
    alert("Select answer!");
    return;
  }

  if (
    selected.value ===
    currentTest.testQuestions[currentQuestionIndex].correctAnswer
  ) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < currentTest.testQuestions.length) {
    displayQuestion();
  } else {
    submitQuiz();
  }
}

// ✅ Prev
function previousQuestion() {
  currentQuestionIndex--;
  displayQuestion();
}

// ✅ Submit
function submitQuiz() {
  clearInterval(timerInterval);

  const total = currentTest.testQuestions.length;
  const percent = Math.round((score / total) * 100);

  document.getElementById("quiz-content").style.display = "none";
  document.getElementById("result-container").style.display = "block";

  document.getElementById("score-display").textContent =
    `${percent}% (${score}/${total})`;

  document.getElementById("result-message").textContent =
    percent >= 60 ? "Good job!" : "Keep practicing!";

  saveTestScore(currentTest.id, currentTest.title, score, total);

  localStorage.removeItem("currentTest");
}

// ==================== EVENTS ====================

document.getElementById("next-btn")?.addEventListener("click", nextQuestion);
document
  .getElementById("prev-btn")
  ?.addEventListener("click", previousQuestion);

document.getElementById("restart-btn")?.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// ✅ Init
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("test-list")) {
    loadTests();
  }

  if (document.getElementById("quiz-content")) {
    startQuiz();
  }
});
