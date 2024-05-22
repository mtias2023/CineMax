document.getElementById('searchButton').addEventListener('click', async function() {
    const movieTitle = document.getElementById('movieTitle').value;
    if (movieTitle) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=e7449990`);
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            showError("Ha ocurrido un error durante la búsqueda. Por favor, inténtalo de nuevo.");
        }
    } else {
        Swal.fire({
            title: "Upss",
            text: "Por favor ingresa un título de película!",
            icon: "error"
        });
    }
});

function displayResults(data) {
    const results = document.getElementById('results');
    results.innerHTML = '';

    if (data.Response === "False") {
        showError(data.Error);
        return;
    }

    const movieInfo = `
        <h2>${data.Title}</h2>
        <p><strong>Año:</strong> ${data.Year}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <img src="${data.Poster !== "N/A" ? data.Poster : 'placeholder.jpg'}" alt="Póster de ${data.Title}">
    `;

    results.innerHTML = movieInfo;
    saveToHistory(data);
}

function showError(errorMessage) {
    const results = document.getElementById('results');
    let translatedMessage;

    switch (errorMessage) {
        case "Movie not found!":
            translatedMessage = "¡Película no encontrada!";
            break;
        case "Too many results.":
            translatedMessage = "Demasiados resultados.";
            break;
        default:
            translatedMessage = errorMessage;  // Mensaje de error genérico en inglés si no es uno de los anteriores
    }

    results.innerHTML = `<p class="error">${translatedMessage}</p>`;
}

function saveToHistory(movie) {
    let history = JSON.parse(sessionStorage.getItem('movieHistory')) || [];

    // Filtrar cualquier duplicado del historial
    history = history.filter(item => item.imdbID !== movie.imdbID);

    // Añadir la nueva película al inicio del historial
    history.unshift(movie);

    // Guardar en sessionStorage
    sessionStorage.setItem('movieHistory', JSON.stringify(history));
}


