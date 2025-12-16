/* 
  scripts.js
  Handles login functionality using the back-end API.
*/

document.addEventListener('DOMContentLoaded', () => {

    /* Get the login form */
    const loginForm = document.getElementById('login-form');

    /* Only run this code if we are on the login page */
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Stop normal form submit

            /* Get user input */
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                /* Send login request to API */
                const response = await fetch('https://your-api-url/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                /* If login is successful */
                if (response.ok) {
                    const data = await response.json();

                    /* Store JWT token in a cookie */
                    document.cookie = `token=${data.access_token}; path=/`;

                    /* Redirect to main page */
                    window.location.href = 'index.html';
                } else {
                    /* Login failed */
                    displayLoginError('Invalid email or password');
                }

            } catch (error) {
                /* Network or server error */
                displayLoginError('Unable to connect to the server');
            }
        });
    }
});

/*
  Displays login error message
*/
function displayLoginError(message) {
    const errorElement = document.getElementById('login-error');

    if (errorElement) {
        errorElement.textContent = message;
    } else {
        alert(message);
    }
}
