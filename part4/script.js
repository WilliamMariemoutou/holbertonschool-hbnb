/*
  script.js

  Handles:
  - Authentication (login + token handling)
  - Place listing and filtering
  - Place details display
  - Review submission
  - Add Review button access control
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================
       LOGIN FUNCTIONALITY
       ================================================== */

    /*
      Handles login form submission.
      On success:
      - Stores access token in cookies
      - Redirects user to the main page
    */
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('https://your-api-url/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Store authentication token in cookies
                    document.cookie = `token=${data.access_token}; path=/`;

                    // Redirect to main page after login
                    window.location.href = 'index.html';
                } else {
                    displayLoginError('Invalid email or password');
                }
            } catch {
                displayLoginError('Unable to connect to the server');
            }
        });
    }

    /* ==================================================
       AUTHENTICATION CHECK (GLOBAL)
       ================================================== */

    /*
      Checks if a token exists.
      - Hides login link when authenticated
      - Fetches places list
    */
    checkAuthentication();

    /* ==================================================
       PLACE DETAILS PAGE LOGIC
       ================================================== */

    /*
      Runs ONLY on place.html
      - Reads place ID from URL
      - Fetches place details from API
    */
    const placeDetailsSection = document.getElementById('place-details');

    if (placeDetailsSection) {
        const placeId = getPlaceIdFromURL();
        const token = getCookie('token');

        if (placeId) {
            fetchPlaceDetails(token, placeId);
        }
    }

    /* ==================================================
       ADD REVIEW BUTTON ACCESS CONTROL
       ================================================== */

    /*
      Controls Add Review button behavior:
      - If NOT authenticated → redirect to login.html
      - If authenticated → redirect to add_review.html?id=PLACE_ID
    */
    const addReviewBtn = document.getElementById('add-review-btn');

    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            const token = getCookie('token');
            const placeId = getPlaceIdFromURL();

            if (!token) {
                window.location.href = 'login.html';
            } else {
                window.location.href = `add_review.html?id=${placeId}`;
            }
        });
    }

    /* ==================================================
       ADD REVIEW FORM LOGIC
       ================================================== */

    /*
      Protects add_review.html:
      - Redirects unauthenticated users to login page
      - Submits review to API
    */
    const reviewForm = document.getElementById('review-form');

    if (reviewForm) {
        const token = getCookie('token');

        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const placeId = getPlaceIdFromURL();

        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('review').value;
            const rating = document.getElementById('rating')?.value;

            try {
                const response = await submitReview(token, placeId, reviewText, rating);

                if (response.ok) {
                    alert('Review submitted successfully!');
                    reviewForm.reset();
                } else {
                    alert('Failed to submit review');
                }
            } catch {
                alert('Error submitting review');
            }
        });
    }
});

/* ==================================================
   HELPER FUNCTIONS
   ================================================== */

/*
  Displays login error messages
*/
function displayLoginError(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        alert(message);
    }
}

/*
  Retrieves a cookie value by name
*/
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

/*
  Extracts place ID from URL query parameters
*/
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
