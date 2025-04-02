document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".form-box.login");
  const signupForm = document.querySelector(".form-box.signup");
  const showSignUp = document.getElementById("showSignUp");
  const showLogin = document.getElementById("showLogin");
  const signupFormEl = document.getElementById("signupForm");
  const messageBox = document.getElementById("signup-message");
  const loginFormEl = document.getElementById("loginForm");
  const loginMessageBox = document.getElementById("login-message");

  // Show login form by default
  loginForm.classList.add("active");

  // Toggle login/signup view
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

  // Sign up form submit handler
  signupFormEl?.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(signupFormEl);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const text = await res.text();

      if (res.ok) {
        signupFormEl.reset();
        showMessage("🎉 Account created successfully!", "success");
      } else {
        showMessage("⚠️ " + text, "error");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      showMessage("Something went wrong. Please try again.", "error");
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `form-message ${type}`;
    setTimeout(() => {
      messageBox.className = "form-message";
      messageBox.textContent = "";
    }, 3000);
  }

  // Log in form submit handler
  loginFormEl?.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(loginFormEl);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const html = await res.text(); // welcome.ejs content
        document.open();
        document.write(html);
        document.close();
      } else {
        const text = await res.text();
        showLoginMessage("❌ " + text, "error");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      showLoginMessage("Something went wrong. Please try again.", "error");
    }
  });

  function showLoginMessage(text, type) {
    loginMessageBox.textContent = text;
    loginMessageBox.className = `form-message ${type}`;
    setTimeout(() => {
      loginMessageBox.className = "form-message";
      loginMessageBox.textContent = "";
    }, 3000);
  }
});
