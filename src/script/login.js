document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".form-box.login");
  const signupForm = document.querySelector(".form-box.signup");
  const showSignUp = document.getElementById("showSignUp");
  const showLogin = document.getElementById("showLogin");

  // Show login form by default
  loginForm.classList.add("active");

  showSignUp?.addEventListener("click", e => {
    e.preventDefault();
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  });

  showLogin?.addEventListener("click", e => {
    e.preventDefault();
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
  });
});
