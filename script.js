document.addEventListener('DOMContentLoaded', function() {
    // --- Recensioni Libri ---
    let bookReviews = JSON.parse(localStorage.getItem('bookReviews')) || [];
    let vinylReviews = JSON.parse(localStorage.getItem('vinylReviews')) || [];

    document.getElementById('bookForm')?.addEventListener('submit', function(e) {
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

    function displayBookReviews() {
        const container = document.getElementById('bookReviews');
        if (!container) return;
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

    window.deleteBookReview = function(id) {
        if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
            bookReviews = bookReviews.filter(review => review.id !== id);
            localStorage.setItem('bookReviews', JSON.stringify(bookReviews));
            displayBookReviews();
        }
    }

    // --- Recensioni Vinili ---
    document.getElementById('vinylForm')?.addEventListener('submit', function(e) {
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

    function displayVinylReviews() {
        const container = document.getElementById('vinylReviews');
        if (!container) return;
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

    window.deleteVinylReview = function(id) {
        if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
            vinylReviews = vinylReviews.filter(review => review.id !== id);
            localStorage.setItem('vinylReviews', JSON.stringify(vinylReviews));
            displayVinylReviews();
        }
    }

    window.showPurchaseModal = function(title, type) {
        const modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
        const modalTitle = document.querySelector('#purchaseModal .modal-title');
        modalTitle.textContent = `Acquista ${type}: ${title}`;
        modal.show();
    }

    displayBookReviews();
    displayVinylReviews();

    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- Carrello ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(title, price) {
        const existing = cart.find(item => item.title === title && item.price === price);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ title, price, quantity: 1 });
        }
        saveCart();
    }

    // Показать toast при добавлении товара в корзину (Bootstrap 4)
    function showCartToast(title) {
        const toastBody = document.getElementById('cart-toast-body');
        if (toastBody) {
            toastBody.innerHTML = `<span>\"${title}\" aggiunto al carrello!</span> <button id='go-to-cart-btn' class='btn btn-light btn-sm ml-3' style='white-space:nowrap;'>Vai al carrello</button>`;
        }
        const toastEl = $('#cart-toast');
        if (toastEl.length && toastEl.toast) {
            toastEl.toast('show');
        }
    }

    // Делегирование для кнопок 'Aggiungi al carrello'
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            const title = e.target.getAttribute('data-title');
            const price = parseFloat(e.target.getAttribute('data-price'));
            addToCart(title, price);
            showCartToast(title);
        }
    });

    // Переход на ordine.html при клике на корзину
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'ordine.html';
        });
    }

    // Обработчик для кнопки 'Vai al carrello' в toast
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'go-to-cart-btn') {
            window.location.href = 'ordine.html';
        }
    });

    // При нажатии 'Acquista' на карточке товара — корзина очищается, добавляется только выбранный товар, переход на ordine.html
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.purchase-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.purchase-btn');
            // Получаем данные товара
            let card = btn.closest('.card');
            let title = card.querySelector('.card-title')?.textContent?.trim();
            let priceText = card.querySelector('.card-text')?.textContent || '';
            let price = 0;
            // Ищем цену в тексте
            let match = priceText.match(/([\d,.]+)/);
            if (match) price = parseFloat(match[1].replace(',', '.'));
            if (title && price) {
                // Очищаем корзину и добавляем только выбранный товар
                let cart = [{ title, price, quantity: 1 }];
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.href = 'ordine.html';
            }
        }
    }, true);

    updateCartCount();
});

// Finestra modale del carrello
function renderCartModal() {
    let html = '<h5>Carrello</h5>';
    if (cart.length === 0) {
        html += '<p>Il carrello è vuoto</p>';
    } else {
        html += '<ul class="list-group mb-3">';
        cart.forEach((item, idx) => {
            html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.title} <small>x${item.quantity}</small></span>
                <span>€${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-sm btn-danger remove-item" data-idx="${idx}">&times;</button>
            </li>`;
        });
        html += '</ul>';
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        html += `<div class="mb-2">Totale: <strong>€${total.toFixed(2)}</strong></div>`;
        html += '<button class="btn btn-success btn-block" id="checkout-btn">Procedi all\'ordine</button>';
    }
    document.getElementById('cart-modal-body').innerHTML = html;
    // Rimozione prodotto dal carrello
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            cart.splice(this.getAttribute('data-idx'), 1);
            saveCart();
            renderCartModal();
        });
    });
} 