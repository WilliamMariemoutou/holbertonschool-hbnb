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

    /* ==============================
       ADDITIONAL CODE FOR INDEX PAGE
       ============================== */

    checkAuthentication();

    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', filterPlacesByPrice);
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

/* =========================
   AUTHENTICATION & COOKIES
   ========================= */

/*
  Checks if user is authenticated
  Shows login link only if no JWT token is found
*/
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!loginLink) return;

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

/*
  Gets a cookie value by name
*/
function getCookie(name) {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}

/* =========================
   FETCH & DISPLAY PLACES
   ========================= */

/*
  Fetches places from API
*/
async function fetchPlaces(token) {
    try {
        const response = await fetch('https://your-api-url/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch places');
        }

        const places = await response.json();
        loadPriceFilterOptions();
        displayPlaces(places);

    } catch (error) {
        console.error(error);
    }
}

/*
  Displays places dynamically in index.html
*/
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '';

    places.forEach(place => {
        const card = document.createElement('article');
        card.className = 'place-card';
        card.dataset.price = place.price;

        card.innerHTML = `
            <h2>${place.name}</h2>
            <p>Price per night: $${place.price}</p>
            <a href="place.html" class="details-button">View Details</a>
        `;

        placesList.appendChild(card);
    });
}

/* =========================
   CLIENT-SIDE FILTERING
   ========================= */

/*
  Loads filter options
*/
function loadPriceFilterOptions() {
    const priceFilter = document.getElementById('price-filter');
    if (!priceFilter) return;

    priceFilter.innerHTML = `
        <option value="all">All</option>
        <option value="10">10</option>
        <option value="50">50</option>
        <option value="100">100</option>
    `;
}

/*
  Filters places by max price without reload
*/
function filterPlacesByPrice(event) {
    const selectedPrice = event.target.value;
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const price = Number(card.dataset.price);

        if (selectedPrice === 'all' || price <= Number(selectedPrice)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* =========================
   PLACE DETAILS PAGE LOGIC
   ========================= */

document.addEventListener('DOMContentLoaded', () => {
    const placeDetailsSection = document.getElementById('place-details');

    /* Run only on place.html */
    if (!placeDetailsSection) return;

    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    /* Show or hide add review form based on authentication */
    if (!token && addReviewSection) {
        addReviewSection.style.display = 'none';
    }

    if (placeId) {
        fetchPlaceDetails(token, placeId);
    }
});

/*
  Extracts place ID from URL
  Example: place.html?id=123
*/
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/*
  Fetch place details from API
*/
async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`https://your-api-url/places/${placeId}`, {
            method: 'GET',
            headers: token ? {
                'Authorization': `Bearer ${token}`
            } : {}
        });

        if (!response.ok) {
            throw new Error('Failed to fetch place details');
        }

        const place = await response.json();
        displayPlaceDetails(place);

    } catch (error) {
        console.error(error);
    }
}

/*
  Displays place details and reviews
*/
function displayPlaceDetails(place) {
    const detailsSection = document.getElementById('place-details');
    const reviewsSection = document.getElementById('reviews');

    if (!detailsSection) return;

    /* Place information */
    detailsSection.innerHTML = `
        <article class="place-details">
            <h1>${place.name}</h1>
            <div class="place-info">
                <p><strong>Price:</strong> $${place.price} / night</p>
                <p><strong>Description:</strong> ${place.description}</p>
                <p><strong>Amenities:</strong> ${place.amenities?.join(', ') || 'None'}</p>
            </div>
        </article>
    `;

    /* Reviews */
    if (reviewsSection && place.reviews) {
        reviewsSection.innerHTML = '<h2>Reviews</h2>';

        place.reviews.forEach(review => {
            const reviewCard = document.createElement('article');
            reviewCard.className = 'review-card';

            reviewCard.innerHTML = `
                <p>${review.comment}</p>
                <p><strong>User:</strong> ${review.user}</p>
                <p><strong>Rating:</strong> ${review.rating}/5</p>
            `;

            reviewsSection.appendChild(reviewCard);
        });
    }
}

/* =========================
   ADD REVIEW PAGE LOGIC
   ========================= */

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');

    /* Run only on add_review.html */
    if (!reviewForm) return;

    /* Check authentication */
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    /* Get place ID from URL */
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

        } catch (error) {
            alert('Error submitting review');
        }
    });
});

/*
  Sends review data to API
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

document.addEventListener('DOMContentLoaded', () => {
    const priceFilter = document.getElementById('price-filter');
    const placeCards = document.querySelectorAll('.place-card');

    // Prices available in your HTML
    const prices = [10, 50, 100];

    // Populate dropdown
    prices.forEach(price => {
        const option = document.createElement('option');
        option.value = price;
        option.textContent = `$${price}`;
        priceFilter.appendChild(option);
    });

    // Filter logic
    priceFilter.addEventListener('change', () => {
        const selectedPrice = priceFilter.value;

        placeCards.forEach(card => {
            const priceText = card.querySelector('p').textContent;
            const placePrice = parseInt(priceText.replace(/\D/g, ''));

            if (selectedPrice === 'All' || placePrice <= selectedPrice) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
