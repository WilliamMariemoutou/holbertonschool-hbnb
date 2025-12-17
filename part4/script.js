/* 
  scripts.js
  Handles login, place display, filtering, and reviews
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       LOGIN FUNCTIONALITY
       ============================== */
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

    /* ==============================
       AUTHENTICATION & FETCH PLACES
       ============================== */
    checkAuthentication();

    /* ==============================
       PLACE DETAILS LOGIC
       ============================== */
    const placeDetailsSection = document.getElementById('place-details');
    if (placeDetailsSection) {
        const placeId = getPlaceIdFromURL();
        const token = getCookie('token');
        const addReviewSection = document.getElementById('add-review');

        if (!token && addReviewSection) addReviewSection.style.display = 'none';
        if (placeId) fetchPlaceDetails(token, placeId);
    }

    /* ==============================
       ADD REVIEW LOGIC
       ============================== */
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        const token = getCookie('token');
        if (!token) {
            window.location.href = 'index.html';
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

/* ==============================
   HELPER FUNCTIONS
   ============================== */
function displayLoginError(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) errorElement.textContent = message;
    else alert(message);
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/* ==============================
   FETCH PLACES & DISPLAY
   ============================== */
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    if (loginLink) loginLink.style.display = token ? 'none' : 'block';
    if (token) fetchPlaces(token);
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('https://your-api-url/places', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch places');
        const places = await response.json();
        displayPlaces(places);
        setupPriceFilter(places);
    } catch (error) {
        console.error(error);
    }
}

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
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        placesList.appendChild(card);
    });
}

/* ==============================
   DYNAMIC PRICE FILTER
   ============================== */
function setupPriceFilter(places) {
    const priceFilter = document.getElementById('price-filter');
    if (!priceFilter) return;

    // Generate unique price options
    const prices = [...new Set(places.map(p => p.price))].sort((a, b) => a - b);

    priceFilter.innerHTML = `<option value="all">All</option>`;
    prices.forEach(price => {
        const option = document.createElement('option');
        option.value = price;
        option.textContent = `$${price}`;
        priceFilter.appendChild(option);
    });

    priceFilter.addEventListener('change', () => {
        const selectedPrice = priceFilter.value;
        const placeCards = document.querySelectorAll('.place-card');

        placeCards.forEach(card => {
            const cardPrice = Number(card.dataset.price);
            if (selectedPrice === 'all' || cardPrice === Number(selectedPrice)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/* ==============================
   PLACE DETAILS & REVIEWS
   ============================== */
async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`https://your-api-url/places/${placeId}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!response.ok) throw new Error('Failed to fetch place details');
        const place = await response.json();
        displayPlaceDetails(place);
    } catch (error) {
        console.error(error);
    }
}

function displayPlaceDetails(place) {
    const detailsSection = document.getElementById('place-details');
    const reviewsSection = document.getElementById('reviews');
    if (!detailsSection) return;

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

/* ==============================
   SUBMIT REVIEW
   ============================== */
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
