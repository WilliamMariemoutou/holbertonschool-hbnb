/*
  script.js

  Responsibilities:
  - Handle user authentication (login + token storage)
  - Fetch and display places
  - Fetch and display place details
  - Control Add Review access
  - Submit reviews (authenticated users only)
*/

/* ==================================================
   DOM READY
   ================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================
       LOGIN FUNCTIONALITY (login.html)
       ================================================== */

    /*
      Handles login form submission.
      On success:
      - Stores JWT token in cookies
      - Redirects to index.html
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
                    document.cookie = `token=${data.access_token}; path=/`;
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
       GLOBAL AUTHENTICATION UI CHECK
       ================================================== */

    /*
      Hides login link when user is authenticated.
      Does NOT redirect users.
    */
    updateLoginVisibility();

    /* ==================================================
       PLACE DETAILS PAGE (place.html)
       ================================================== */

    /*
      Fetches place details when on place.html
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
       ADD REVIEW BUTTON (place.html)
       ================================================== */

    /*
      Controls Add Review button navigation:
      - Not authenticated → login.html
      - Authenticated → add_review.html?id=PLACE_ID
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
       ADD REVIEW PAGE (add_review.html)
       ================================================== */

    /*
      Protects add_review.html:
      - Redirects unauthenticated users to index.html
      - Submits review via API
    */
    const reviewForm = document.getElementById('review-form');

    if (reviewForm) {
        const token = getCookie('token');

        // REQUIRED by instructions
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const placeId = getPlaceIdFromURL();

        if (!placeId) {
            window.location.href = 'index.html';
            return;
        }

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
  Shows or hides login link based on authentication
*/
function updateLoginVisibility() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    if (loginLink && token) {
        loginLink.style.display = 'none';
    }
}

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

/* ==================================================
   API FUNCTIONS
   ================================================== */

/*
  Submits a review to the API
*/
async function submitReview(token, placeId, reviewText, rating) {
    return fetch('https://your-api-url/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            place_id: placeId,
            review: reviewText,
            rating: rating
        })
    });
}
