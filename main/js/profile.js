// DOM Elements
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const appliedJobsList = document.getElementById("appliedJobsList");
const noAppliedJobs = document.getElementById("noAppliedJobs");
const loadingSpinner = document.getElementById("loadingSpinner");

// Test scores elements
const loadingTestScores = document.getElementById("loadingTestScores");
const testScoresList = document.getElementById("testScoresList");
const noTestScores = document.getElementById("noTestScores");

// Profile elements
const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileLocation = document.getElementById("profileLocation");
const profileJobRole = document.getElementById("profileJobRole");
const profileExperience = document.getElementById("profileExperience");
const profileSkills = document.getElementById("profileSkills");
const profileBio = document.getElementById("profileBio");
const editProfileBtn = document.getElementById("editProfileBtn");

// Modal elements
const editProfileModal = document.getElementById("editProfileModal");
const closeModal = document.querySelector(".close-modal");
const editProfileForm = document.getElementById("editProfileForm");
const btnCancel = document.querySelector(".btn-cancel");

// Edit form elements
const editFullName = document.getElementById("editFullName");
const editEmail = document.getElementById("editEmail");
const editPhone = document.getElementById("editPhone");
const editLocation = document.getElementById("editLocation");
const editJobRole = document.getElementById("editJobRole");
const editExperience = document.getElementById("editExperience");
const editSkills = document.getElementById("editSkills");
const editBio = document.getElementById("editBio");

// Global variable to store job data
let allJobs = [];
let currentUser = null;

// Fetch job data
async function fetchJobs() {
  try {
    // Try to fetch from JSON file first
    const response = await fetch("../data/jobs.json");
    if (response.ok) {
      const jobs = await response.json();
      allJobs = [...jobs];
    } else {
      // If JSON file doesn't exist, use sample data
      allJobs = [...sampleJobs];
    }

    // Get user's applications and render them
    const user = checkAuthStatus();
    if (user) {
      const applications =
        JSON.parse(localStorage.getItem("applications")) || [];
      const userApplications = applications.filter(
        (app) => app.userId === user.id,
      );

      // Render applied jobs
      renderAppliedJobs(user, userApplications);

      // Render test scores
      renderTestScores(user);
    }
  } catch (error) {
    console.error("Error fetching job data:", error);
    // If there's an error, use sample data
    allJobs = [...sampleJobs];

    // Get user's applications and render them
    const user = checkAuthStatus();
    if (user) {
      const applications =
        JSON.parse(localStorage.getItem("applications")) || [];
      const userApplications = applications.filter(
        (app) => app.userId === user.id,
      );

      // Render applied jobs
      renderAppliedJobs(user, userApplications);

      // Render test scores
      renderTestScores(user);
    }
  }
}

// Check if user is logged in
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    // Redirect to login page if not logged in
    window.location.href = "../login.html";
    return false;
  }

  // Store current user globally
  currentUser = user;

  // Display user information
  userName.textContent = user.name;
  userEmail.textContent = user.email;

  // Display profile information
  profileFullName.textContent = user.fullName || user.name;
  profileEmail.textContent = user.email;
  profilePhone.textContent = user.phone || "Not provided";
  profileLocation.textContent = user.location || "Not provided";
  profileJobRole.textContent = user.jobRole || "Not specified";
  profileExperience.textContent = user.experience || "Not specified";
  profileBio.textContent = user.bio || "No bio added yet";

  // Display skills
  if (user.skills && user.skills.length > 0) {
    profileSkills.innerHTML = user.skills
      .map((skill) => `<span class="skill-tag">${skill}</span>`)
      .join("");
  } else {
    profileSkills.innerHTML =
      '<span class="detail-value">No skills added yet</span>';
  }

  return user;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Render applied jobs in compact format
function renderAppliedJobs(user, applications) {
  console.log("Rendering applied jobs:", applications);

  if (applications.length === 0) {
    loadingSpinner.style.display = "none";
    appliedJobsList.style.display = "none";
    noAppliedJobs.style.display = "block";
    return;
  }

  // Get job details for each application
  const appliedJobs = applications
    .map((app) => {
      const job = allJobs.find((j) => j.id === app.jobId);
      return {
        ...job,
        appliedAt: app.appliedAt,
      };
    })
    .filter((job) => job); // Filter out any undefined jobs

  console.log("Applied jobs with details:", appliedJobs);

  if (appliedJobs.length === 0) {
    loadingSpinner.style.display = "none";
    appliedJobsList.style.display = "none";
    noAppliedJobs.style.display = "block";
    return;
  }

  appliedJobsList.innerHTML = appliedJobs
    .map(
      (job) => `
        <div class="applied-job-card" data-id="${job.id}">
            <div class="applied-job-header">
                <img src="${job.logo}" alt="${
                  job.companyName
                }" class="company-logo">
                <div class="company-info">
                    <h4>${job.companyName}</h4>
                    <p class="job-title">${job.role}</p>
                </div>
            </div>
            <div class="applied-job-details">
                <div class="job-detail">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>₹${job.monthlySalary}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location.split(",")[0]}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-laptop-house"></i>
                    <span>${job.workMode}</span>
                </div>
            </div>
            <div class="applied-date">
                <i class="fas fa-calendar-check"></i> Applied on ${formatDate(
                  job.appliedAt,
                )}
            </div>
        </div>
    `,
    )
    .join("");

  // Add click event to job cards
  document.querySelectorAll(".applied-job-card").forEach((card) => {
    card.addEventListener("click", () => {
      const jobId = parseInt(card.getAttribute("data-id"));
      window.location.href = `job-details.html?id=${jobId}`;
    });
  });

  // Hide loading spinner and show applied jobs
  loadingSpinner.style.display = "none";
  appliedJobsList.style.display = "grid";
  noAppliedJobs.style.display = "none";
}

// Render test scores
function renderTestScores(user) {
  // Get test scores from localStorage
  const testScores = JSON.parse(localStorage.getItem("testScores")) || [];
  const userTestScores = testScores.filter((score) => score.userId === user.id);

  if (userTestScores.length === 0) {
    loadingTestScores.style.display = "none";
    testScoresList.style.display = "none";
    noTestScores.style.display = "block";
    return;
  }

  // Sort test scores by date (most recent first)
  userTestScores.sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
  );

  testScoresList.innerHTML = userTestScores
    .map((testScore) => {
      // Determine score color based on percentage
      let scoreClass = "score-low";
      if (testScore.percentage >= 80) {
        scoreClass = "score-high";
      } else if (testScore.percentage >= 60) {
        scoreClass = "score-medium";
      }

      return `
        <div class="test-score-card">
            <div class="test-score-header">
                <h4>${testScore.testTitle}</h4>
                <div class="test-score ${scoreClass}">${
                  testScore.percentage
                }%</div>
            </div>
            <div class="test-score-details">
                <div class="test-score-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Correct Answers: ${testScore.score}/${
                      testScore.totalQuestions
                    }</span>
                </div>
                <div class="test-score-item">
                    <i class="fas fa-calendar"></i>
                    <span>Completed on: ${formatDate(
                      testScore.completedAt,
                    )}</span>
                </div>
            </div>
        </div>
    `;
    })
    .join("");

  // Hide loading spinner and show test scores
  loadingTestScores.style.display = "none";
  testScoresList.style.display = "grid";
  noTestScores.style.display = "none";
}

// Open edit profile modal
editProfileBtn.addEventListener("click", () => {
  // Populate form with current user data
  editFullName.value = currentUser.fullName || currentUser.name;
  editEmail.value = currentUser.email;
  editPhone.value = currentUser.phone || "";
  editLocation.value = currentUser.location || "";
  editJobRole.value = currentUser.jobRole || "";
  editExperience.value = currentUser.experience || "Fresher";
  editSkills.value = currentUser.skills ? currentUser.skills.join(", ") : "";
  editBio.value = currentUser.bio || "";

  // Open modal
  editProfileModal.classList.add("open");
});

// Close modal
closeModal.addEventListener("click", () => {
  editProfileModal.classList.remove("open");
});

btnCancel.addEventListener("click", () => {
  editProfileModal.classList.remove("open");
});

// Handle form submission
editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const skills = editSkills.value
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill !== "");

  // Update user object
  const updatedUser = {
    ...currentUser,
    fullName: editFullName.value,
    email: editEmail.value,
    phone: editPhone.value,
    location: editLocation.value,
    jobRole: editJobRole.value,
    experience: editExperience.value,
    skills: skills,
    bio: editBio.value,
  };

  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(updatedUser));

  // Update current user
  currentUser = updatedUser;

  // Update UI
  checkAuthStatus();

  // Close modal
  editProfileModal.classList.remove("open");

  // Show success message
  alert("Profile updated successfully!");
});

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuthStatus();
  if (user) {
    fetchJobs();
  }
});
