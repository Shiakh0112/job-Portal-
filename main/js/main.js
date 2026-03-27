// DOM Elements
const jobsList = document.getElementById("jobsList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearFiltersBtn = document.getElementById("clearFilters");
const noResults = document.getElementById("noResults");
const loadingSpinner = document.getElementById("loadingSpinner");
const resultsCount = document.getElementById("resultsCount");
const pagination = document.getElementById("pagination");

// Filter elements
const openFilters = document.getElementById("openFilters");
const closeFilters = document.getElementById("closeFilters");
const filterSidebar = document.getElementById("filterSidebar");
const locationFilters = document.getElementById("locationFilters");
const roleFilters = document.getElementById("roleFilters");

// Sidebar toggle
openFilters.onclick = () => filterSidebar.classList.add("open");
closeFilters.onclick = () => filterSidebar.classList.remove("open");

// Accordions
document.querySelectorAll(".accordion-title").forEach((title) => {
  title.addEventListener("click", () => {
    title.classList.toggle("open");
    title.nextElementSibling.classList.toggle("open");
  });
});

// Global variables
let allJobs = [];
let filteredJobs = [];
let currentPage = 1;
const jobsPerPage = 6;

// ================= FETCH JOBS =================
async function fetchJobs() {
  try {
    const response = await fetch("../data/jobs.json");

    if (!response.ok) throw new Error("Fetch failed");

    const data = await response.json();

    // ✅ IMPORTANT FIX
    allJobs = Array.isArray(data) ? data : data.jobs;

    filteredJobs = [...allJobs];

    populateFilters();

    loadingSpinner.style.display = "none";
    jobsList.style.display = "grid";

    renderJobs();
    updateResultsCount();
    renderPagination();
  } catch (error) {
    console.error(error);
    loadingSpinner.innerHTML = `<p>Failed to load jobs ❌</p>`;
  }
}

// ================= FILTER UI =================
function populateFilters() {
  const locations = [
    ...new Set(allJobs.map((job) => job.location.split(",")[0].trim())),
  ];

  const roles = [...new Set(allJobs.map((job) => job.role))];

  locationFilters.innerHTML = locations
    .map(
      (loc) =>
        `<label><input type="checkbox" name="location" value="${loc}"> ${loc}</label><br>`,
    )
    .join("");

  roleFilters.innerHTML = roles
    .map(
      (role) =>
        `<label><input type="checkbox" name="role" value="${role}"> ${role}</label><br>`,
    )
    .join("");
}

// ================= RENDER JOBS =================
function renderJobs() {
  if (filteredJobs.length === 0) {
    jobsList.innerHTML = "";
    noResults.style.display = "block";
    pagination.style.display = "none";
    return;
  }

  noResults.style.display = "none";

  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;

  const jobsToShow = filteredJobs.slice(start, end);

  jobsList.innerHTML = jobsToShow
    .map(
      (job) => `
      <div class="job-card">
        <div class="job-card-header">
          <img src="${job.logo}" alt="${job.companyName}" class="company-logo">
          <div class="company-info">
            <h3>${job.companyName}</h3>
            <p class="job-title">${job.role}</p>
          </div>
        </div>
        <div class="job-card-body">
          <div class="job-details">
            <div class="job-detail"><i class="fas fa-money-bill-wave"></i><span>₹${job.monthlySalary}</span></div>
            <div class="job-detail"><i class="fas fa-briefcase"></i><span>${job.vacancies} vacancies</span></div>
            <div class="job-detail"><i class="fas fa-map-marker-alt"></i><span>${job.location}</span></div>
            <div class="job-detail"><i class="fas fa-clock"></i><span>${job.jobTiming}</span></div>
            <div class="job-detail"><i class="fas fa-laptop-house"></i><span>${job.workMode}</span></div>
          </div>
          <div class="job-skills">
            ${job.skillsRequired
              .slice(0, 4)
              .map((s) => `<span class="skill-tag">${s}</span>`)
              .join("")}
          </div>
        </div>
        <div class="job-card-footer">
          <button class="view-details-btn" onclick="viewDetails(${job.id})">View Details</button>
        </div>
      </div>
    `,
    )
    .join("");
}

// View details
function viewDetails(id) {
  window.location.href = `job-details.html?id=${id}`;
}

// ================= PAGINATION =================
function renderPagination() {
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  let html = `<button ${currentPage === 1 ? "disabled" : ""} id="prev">&laquo;</button>`;

  // Always show: first, last, current, and 1 on each side of current
  const pages = new Set(
    [1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
      (p) => p >= 1 && p <= totalPages,
    ),
  );
  const sorted = [...pages].sort((a, b) => a - b);

  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) html += `<span class="pagination-dots">...</span>`;
    html += `<button class="${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
    prev = p;
  }

  html += `<button ${currentPage === totalPages ? "disabled" : ""} id="next">&raquo;</button>`;

  pagination.innerHTML = html;

  document.getElementById("prev")?.addEventListener("click", () => {
    currentPage--;
    renderJobs();
    renderPagination();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("next")?.addEventListener("click", () => {
    currentPage++;
    renderJobs();
    renderPagination();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = +btn.dataset.page;
      renderJobs();
      renderPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ================= FILTER LOGIC =================
function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(c => c.value);
}

function filterJobs() {
  const search = searchInput.value.toLowerCase();
  const salaries = getChecked("salary");
  const locations = getChecked("location");
  const roles = getChecked("role");
  const workModes = getChecked("workMode");
  const timings = getChecked("jobTiming");

  filteredJobs = allJobs.filter((job) => {
    // Search filter
    const matchSearch = !search ||
      job.companyName.toLowerCase().includes(search) ||
      job.role.toLowerCase().includes(search) ||
      job.skillsRequired.some((s) => s.toLowerCase().includes(search));

    // Salary filter
    const matchSalary = salaries.length === 0 || salaries.some(range => {
      const [min, max] = range.split("-").map(Number);
      const jobMin = parseInt(job.monthlySalary);
      if (range === "60000+") return jobMin >= 60000;
      return jobMin >= min && jobMin <= max;
    });

    // Location filter
    const matchLocation = locations.length === 0 ||
      locations.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()));

    // Role filter
    const matchRole = roles.length === 0 || roles.includes(job.role);

    // Work mode filter
    const matchWorkMode = workModes.length === 0 || workModes.includes(job.workMode);

    // Shift/timing filter
    const matchTiming = timings.length === 0 || timings.includes(job.jobTiming);

    return matchSearch && matchSalary && matchLocation && matchRole && matchWorkMode && matchTiming;
  });

  currentPage = 1;
  renderJobs();
  updateResultsCount();
  renderPagination();
}

// ================= CLEAR =================
function clearFilters() {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((c) => (c.checked = false));

  searchInput.value = "";
  filterJobs();
}

// ================= COUNT =================
function updateResultsCount() {
  resultsCount.textContent = filteredJobs.length;
}

// ================= EVENTS =================
searchBtn.addEventListener("click", filterJobs);

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") filterJobs();
});

clearFiltersBtn.addEventListener("click", clearFilters);

// Checkbox change pe filter apply ho
document.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") filterJobs();
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", fetchJobs);
