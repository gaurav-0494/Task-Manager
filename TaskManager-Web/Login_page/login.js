const wrapper = document.querySelector('.wrapper');
const loginlink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const loginForm = document.querySelector('.form-box.login form');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginlink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    // Perform login and password validation here
    if (email === 'e@gmail.com' && password === '1234') {
        // Redirect to success.html if valid
        window.location.href = '../index.html';
    } else {
        // Show an error message or handle invalid credentials
        alert('Invalid credentials');
    }
});
