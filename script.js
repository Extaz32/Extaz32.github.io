// Salva le recensioni in localStorage
let bookReviews = JSON.parse(localStorage.getItem('bookReviews')) || [];
let vinylReviews = JSON.parse(localStorage.getItem('vinylReviews')) || [];

// Gestione dell'invio del modulo recensione libri
document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = this.querySelector('input[placeholder="Titolo del libro"]').value;
    const author = this.querySelector('input[placeholder="Autore"]').value;
    const price = this.querySelector('input[placeholder="Prezzo (€)"]').value;
    const rating = this.querySelector('select').value;
    
    const review = {
        id: Date.now(),
        title,
        author,
        price: parseFloat(price).toFixed(2),
        rating: parseInt(rating),
        date: new Date().toLocaleDateString('it-IT')
    };
    
    bookReviews.unshift(review);
    localStorage.setItem('bookReviews', JSON.stringify(bookReviews));
    
    displayBookReviews();
    this.reset();
});

// Visualizza le recensioni dei libri
function displayBookReviews() {
    const container = document.getElementById('bookReviews');
    container.innerHTML = '';
    
    bookReviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        const reviewElement = document.createElement('div');
        reviewElement.className = 'col-md-6 mb-4';
        reviewElement.innerHTML = `
            <div class="review-card">
                <h5>${review.title}</h5>
                <p class="text-muted">di ${review.author}</p>
                <div class="stars">${stars}</div>
                <div class="price">€${review.price}</div>
                <button class="btn btn-primary purchase-btn btn-block" onclick="showPurchaseModal('${review.title}', 'libro')">
                    <i class="fas fa-shopping-cart"></i> Acquista
                </button>
                <button class="btn btn-sm btn-danger mt-2" onclick="deleteBookReview(${review.id})">
                    <i class="fas fa-trash"></i> Elimina
                </button>
            </div>
        `;
        
        container.appendChild(reviewElement);
    });
}

// Elimina una recensione di libro
function deleteBookReview(id) {
    if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
        bookReviews = bookReviews.filter(review => review.id !== id);
        localStorage.setItem('bookReviews', JSON.stringify(bookReviews));
        displayBookReviews();
    }
}

// Gestione dell'invio del modulo recensione vinili
document.getElementById('vinylForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = this.querySelector('input[placeholder="Titolo dell\'album"]').value;
    const artist = this.querySelector('input[placeholder="Artista"]').value;
    const year = this.querySelector('input[placeholder="Anno di pubblicazione"]').value;
    const price = this.querySelector('input[placeholder="Prezzo (€)"]').value;
    const rating = this.querySelector('select').value;
    
    const review = {
        id: Date.now(),
        title,
        artist,
        year: parseInt(year),
        price: parseFloat(price).toFixed(2),
        rating: parseInt(rating),
        date: new Date().toLocaleDateString('it-IT')
    };
    
    vinylReviews.unshift(review);
    localStorage.setItem('vinylReviews', JSON.stringify(vinylReviews));
    
    displayVinylReviews();
    this.reset();
});

// Visualizza le recensioni dei vinili
function displayVinylReviews() {
    const container = document.getElementById('vinylReviews');
    container.innerHTML = '';
    
    vinylReviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        const reviewElement = document.createElement('div');
        reviewElement.className = 'col-md-6 mb-4';
        reviewElement.innerHTML = `
            <div class="review-card">
                <h5>${review.title}</h5>
                <p class="text-muted">di ${review.artist} (${review.year})</p>
                <div class="stars">${stars}</div>
                <div class="price">€${review.price}</div>
                <button class="btn btn-success purchase-btn btn-block" onclick="showPurchaseModal('${review.title}', 'vinile')">
                    <i class="fas fa-shopping-cart"></i> Acquista
                </button>
                <button class="btn btn-sm btn-danger mt-2" onclick="deleteVinylReview(${review.id})">
                    <i class="fas fa-trash"></i> Elimina
                </button>
            </div>
        `;
        
        container.appendChild(reviewElement);
    });
}

// Elimina una recensione di vinile
function deleteVinylReview(id) {
    if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
        vinylReviews = vinylReviews.filter(review => review.id !== id);
        localStorage.setItem('vinylReviews', JSON.stringify(vinylReviews));
        displayVinylReviews();
    }
}

// Mostra la finestra modale per l'acquisto
function showPurchaseModal(title, type) {
    const modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
    const modalTitle = document.querySelector('#purchaseModal .modal-title');
    modalTitle.textContent = `Acquista ${type}: ${title}`;
    modal.show();
}

// Inizializza la visualizzazione e i tooltip
document.addEventListener('DOMContentLoaded', function() {
    displayBookReviews();
    displayVinylReviews();
    
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}); 