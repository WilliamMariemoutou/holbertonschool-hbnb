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
