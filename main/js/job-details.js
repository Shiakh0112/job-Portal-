// DOM Elements
const jobDetailsContainer = document.getElementById("jobDetails");
const loginPrompt = document.getElementById("loginPrompt");
const loadingSpinner = document.getElementById("loadingSpinner");

// Authentication elements - Fixed selectors
const authDiv = document.getElementById("auth");
const profileDiv = document.getElementById("profile");
const logoutBtn = document.getElementById("logout");

// Global variable to store job data
let allJobs = [];

// Fetch job data from JSON file
async function fetchJobs() {
  try {
    // Try with absolute path first
    let response = await fetch("../data/jobs.json");

    // If that fails, try relative path
    if (!response.ok) {
      response = await fetch("../data/jobs.json");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch job data");
    }

    const jobs = await response.json();

    // Generate more job data to simulate 150 companies
    const moreJobs = generateMoreJobs(145); // We already have 5 jobs in JSON
    allJobs = [...jobs, ...moreJobs];

    // Get job ID from URL and render job details
    const jobId = getJobIdFromUrl();
    if (jobId) {
      await renderJobDetails(jobId);
    } else {
      jobDetailsContainer.innerHTML = "<p>Job not found.</p>";
      loadingSpinner.style.display = "none";
      jobDetailsContainer.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching job data:", error);
    loadingSpinner.innerHTML =
      "<p>Failed to load job data. Please try again later.</p>";
  }
}

// Generate more job data to simulate 150 companies
function generateMoreJobs(count) {
  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Digital Marketer",
    "Product Manager",
    "UI/UX Designer",
    "DevOps Engineer",
    "QA Engineer",
    "Business Analyst",
  ];
  const companies = [
    "IBM",
    "Oracle",
    "SAP",
    "Adobe",
    "Cisco",
    "Intel",
    "HP",
    "Dell",
    "Samsung",
    "Sony",
    "Netflix",
    "Twitter",
    "LinkedIn",
    "Salesforce",
    "VMware",
    "Tesla",
    "SpaceX",
    "Airbnb",
    "Uber",
    "Lyft",
  ];
  const locations = [
    "Hyderabad, India",
    "Bengaluru, India",
    "Mumbai, India",
    "Delhi, India",
    "Pune, India",
    "Chennai, India",
    "Kolkata, India",
    "Gurgaon, India",
    "Noida, India",
    "Ahmedabad, India",
  ];
  const workModes = ["remote", "in-office", "hybrid"];
  const jobTimings = ["dayshift", "nightshift", "flexible"];
  const positions = ["Junior", "Mid", "Senior"];
  const categories = [
    "Engineering",
    "Data Science",
    "Marketing",
    "Product",
    "Design",
    "Operations",
    "Sales",
    "HR",
  ];

  const moreJobs = [];

  for (let i = 1; i <= count; i++) {
    const companyIndex = Math.floor(Math.random() * companies.length);
    const roleIndex = Math.floor(Math.random() * roles.length);
    const locationIndex = Math.floor(Math.random() * locations.length);
    const workModeIndex = Math.floor(Math.random() * workModes.length);
    const jobTimingIndex = Math.floor(Math.random() * jobTimings.length);
    const positionIndex = Math.floor(Math.random() * positions.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);

    const minSalary = Math.floor(Math.random() * 60000) + 5000;
    const maxSalary = minSalary + Math.floor(Math.random() * 20000) + 5000;

    const job = {
      id: 5 + i, // Start from ID 6 since we already have 5 jobs in JSON
      companyName: companies[companyIndex],
      logo: `https://logo.clearbit.com/${companies[
        companyIndex
      ].toLowerCase()}.com`,
      vacancies: Math.floor(Math.random() * 10) + 1,
      monthlySalary: `${minSalary}-${maxSalary}`,
      jobType: Math.random() > 0.2 ? "full time" : "part time",
      jobTiming: jobTimings[jobTimingIndex],
      workMode: workModes[workModeIndex],
      experienceRequired:
        Math.random() > 0.3
          ? `${Math.floor(Math.random() * 10) + 1} years`
          : "fresher",
      description: `${companies[companyIndex]} is looking for a talented ${roles[roleIndex]} to join our team. This is an exciting opportunity to work on cutting-edge projects and make a real impact. We offer competitive compensation, great benefits, and a collaborative work environment where you can grow your career.`,
      role: roles[roleIndex],
      position: positions[positionIndex],
      category: categories[categoryIndex],
      qualifications: [
        "Bachelor's degree or equivalent",
        "Relevant experience preferred",
      ],
      skillsRequired: [
        "JavaScript",
        "Problem-solving",
        "Communication",
        "Teamwork",
      ],
      softSkillsRequired: [
        "Adaptability",
        "Critical thinking",
        "Collaboration",
      ],
      responsibilities: [
        "Develop and maintain applications",
        "Collaborate with team members",
        "Participate in code reviews",
      ],
      location: locations[locationIndex],
      website: `https://www.${companies[companyIndex].toLowerCase()}.com`,
      contactEmail: `careers@${companies[companyIndex].toLowerCase()}.com`,
    };

    moreJobs.push(job);
  }

  return moreJobs;
}

// Check if user is logged in
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    authDiv.style.display = "none";
    profileDiv.style.display = "flex";
    return true;
  } else {
    authDiv.style.display = "flex";
    profileDiv.style.display = "none";
    return false;
  }
}

// Logout functionality
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  checkAuthStatus();
  alert("You have been logged out successfully.");
});

// Get job ID from URL
function getJobIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id"));
}

// Apply for a job
function applyForJob(jobId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Show alert before displaying login prompt
    alert("Please login to apply for this job.");
    loginPrompt.style.display = "block";
    return;
  }

  // Get existing applications or create empty array
  let applications = JSON.parse(localStorage.getItem("applications")) || [];

  // Check if already applied
  if (
    applications.some((app) => app.userId === user.id && app.jobId === jobId)
  ) {
    alert("You have already applied for this job.");
    return;
  }

  // Add new application
  applications.push({
    userId: user.id,
    jobId: jobId,
    appliedAt: new Date().toISOString(),
  });

  // Save to localStorage
  localStorage.setItem("applications", JSON.stringify(applications));

  alert("Application submitted successfully!");

  // Disable apply button
  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.textContent = "Applied";
    applyBtn.disabled = true;
  }
}

// Render job details
async function renderJobDetails(jobId) {
  const isLoggedIn = checkAuthStatus();

  // Find job with the given ID
  const job = allJobs.find((j) => j.id === jobId);

  if (!job) {
    jobDetailsContainer.innerHTML = "<p>Job not found.</p>";
    loadingSpinner.style.display = "none";
    jobDetailsContainer.style.display = "block";
    return;
  }

  // Check if user has already applied for this job
  const user = JSON.parse(localStorage.getItem("user"));
  let hasApplied = false;

  if (user) {
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    hasApplied = applications.some(
      (app) => app.userId === user.id && app.jobId === job.id
    );
  }

  jobDetailsContainer.innerHTML = `
        <div class="job-header">
            <img src="${job.logo}" alt="${
    job.companyName
  }" class="company-logo">
            <div class="job-title-section">
                <h2>${job.role} at ${job.companyName}</h2>
                <div class="job-meta">
                    <div class="job-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-briefcase"></i>
                        <span>${job.position} Level</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${job.jobTiming}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-laptop-house"></i>
                        <span>${job.workMode}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="job-content">
            <div class="job-main-content">
                <div class="job-section">
                    <h3>Job Description</h3>
                    <p>${job.description}</p>
                </div>
                
                <div class="job-section">
                    <h3>Responsibilities</h3>
                    <ul>
                        ${job.responsibilities
                          .map((responsibility) => `<li>${responsibility}</li>`)
                          .join("")}
                    </ul>
                </div>
                
                <div class="job-section">
                    <h3>Qualifications</h3>
                    <ul>
                        ${job.qualifications
                          .map((qualification) => `<li>${qualification}</li>`)
                          .join("")}
                    </ul>
                </div>
                
                <div class="job-section">
                    <h3>Skills Required</h3>
                    <div class="skills-list">
                        ${job.skillsRequired
                          .map(
                            (skill) => `<span class="skill-tag">${skill}</span>`
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="job-section">
                    <h3>Soft Skills Required</h3>
                    <div class="skills-list">
                        ${job.softSkillsRequired
                          .map(
                            (skill) => `<span class="skill-tag">${skill}</span>`
                          )
                          .join("")}
                    </div>
                </div>
            </div>
            
            <div class="job-sidebar">
                <div class="job-summary">
                    <div class="job-summary-item">
                        <span class="job-summary-label">Vacancies:</span>
                        <span class="job-summary-value">${job.vacancies}</span>
                    </div>
                    <div class="job-summary-item">
                        <span class="job-summary-label">Salary:</span>
                        <span class="job-summary-value">₹${
                          job.monthlySalary
                        }</span>
                    </div>
                    <div class="job-summary-item">
                        <span class="job-summary-label">Job Type:</span>
                        <span class="job-summary-value">${job.jobType}</span>
                    </div>
                    <div class="job-summary-item">
                        <span class="job-summary-label">Experience:</span>
                        <span class="job-summary-value">${
                          job.experienceRequired
                        }</span>
                    </div>
                    <div class="job-summary-item">
                        <span class="job-summary-label">Category:</span>
                        <span class="job-summary-value">${job.category}</span>
                    </div>
                </div>
                
                <button id="applyBtn" class="apply-btn" ${
                  hasApplied ? "disabled" : ""
                }>
                    ${hasApplied ? "Applied" : "Apply Now"}
                </button>
                
                <div class="job-section" style="margin-top: 20px;">
                    <h3>Contact Information</h3>
                    <p><strong>Email:</strong> ${job.contactEmail}</p>
                    <p><strong>Website:</strong> <a href="${
                      job.website
                    }" target="_blank">${job.website}</a></p>
                </div>
            </div>
        </div>
    `;

  // Add event listener to apply button
  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn && !hasApplied) {
    applyBtn.addEventListener("click", () => applyForJob(job.id));
  }

  // Show/hide login prompt based on auth status
  if (!isLoggedIn) {
    loginPrompt.style.display = "block";
  } else {
    loginPrompt.style.display = "none";
  }

  // Hide loading spinner and show job details
  loadingSpinner.style.display = "none";
  jobDetailsContainer.style.display = "block";
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  fetchJobs();
});
