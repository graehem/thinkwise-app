// ThinkWise - Basic JS Logic

function login() {
const email = document.getElementbyId('email').value
const pass = document.getElementbyId('password').value

if (email === "test@user.com" && pass === "1234") {
alert("Login Successful!);
 }else{
  alert("Invalid email or password!");
}
}

function signup() {
const email = document.getElementbyId('email').value;
const email = document.getElementbyId('password').value;
const confirmPassword = document.getElementById('confirm').value;

  if (password !== confirm password) {
   alert("Passwords do not match!");
    return;
  }

  alert("Account created! You can now log in."); 
  window.location.href = "login.html";
}
  
  
