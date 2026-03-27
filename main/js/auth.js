// DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Generate a unique ID for new users
function generateUserId() {
  return Math.floor(Math.random() * 1000000);
}

// Handle login form submission
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      // Store user info in localStorage (in a real app, you'd use a more secure method)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
      );

      // Redirect to home page
      window.location.href = "../index.html";
    } else {
      // Show error message
      const existingError = document.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }

      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = "Invalid email or password";

      loginForm.appendChild(errorElement);
    }
  });
}

// Handle registration form submission
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Clear previous error messages
    const existingErrors = document.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    // Validate passwords match
    if (password !== confirmPassword) {
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = "Passwords do not match";

      registerForm.appendChild(errorElement);
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = "Email already registered";

      registerForm.appendChild(errorElement);
      return;
    }

    // Create new user
    const newUser = {
      id: generateUserId(),
      name: name,
      email: email,
      password: password, // In a real app, you'd hash this password
    };

    // Add user to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Log in the user
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }),
    );

    // Show success message
    const successElement = document.createElement("div");
    successElement.className = "success-message";
    successElement.textContent = "Registration successful! Redirecting...";

    registerForm.appendChild(successElement);

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  });
}
