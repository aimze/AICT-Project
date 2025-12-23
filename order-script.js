var cart = {};

document.addEventListener('DOMContentLoaded', function() {
    var filterBtns = document.querySelectorAll('.product-filter .filter-btn');
    var quantityInputs = document.querySelectorAll('.qty-input');
    var deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    var checkoutBtn = document.getElementById('checkoutBtn');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', handleFilterClick);
    });
    
    quantityInputs.forEach(function(input) {
        input.addEventListener('change', handleQuantityChange);
    });
    
    deliveryRadios.forEach(function(radio) {
        radio.addEventListener('change', handleDeliveryChange);
    });
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    updateDisplay();
});

function handleFilterClick(event) {
    var filterType = event.target.getAttribute('data-filter');
    var filterBtns = document.querySelectorAll('.product-filter .filter-btn');
    
    filterBtns.forEach(function(btn) {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    var cards = document.querySelectorAll('.product-card');
    cards.forEach(function(card) {
        var category = card.getAttribute('data-category');
        if (filterType === 'all' || category === filterType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleQuantityChange(event) {
    if (event.target.value < 0) {
        event.target.value = 0;
    }
    updateDisplay();
}

function handleDeliveryChange() {
    updateDisplay();
}

function handleCheckout() {
    if (Object.keys(cart).length === 0) {
        alert('Please add items to your order');
        return;
    }

    var deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    var deliveryType = deliveryRadio ? deliveryRadio.value : 'pickup';
    var subtotalText = document.getElementById('subtotal').textContent;
    var taxText = document.getElementById('tax').textContent;
    var totalText = document.getElementById('total').textContent;
    
    var orderData = {
        items: cart,
        deliveryType: deliveryType,
        subtotal: parseFloat(subtotalText.replace('$', '')),
        tax: parseFloat(taxText.replace('$', '')),
        total: parseFloat(totalText.replace('$', ''))
    };
    
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    alert('Order confirmed! Total: ' + totalText);
    window.location.href = 'contact.html';
}

function updateDisplay() {
    updateCart();
    renderCart();
    calculateTotals();
}

function updateCart() {
    cart = {};
    var cards = document.querySelectorAll('.product-card');
    
    cards.forEach(function(card) {
        var input = card.querySelector('.qty-input');
        var qty = parseInt(input.value) || 0;
        
        if (qty > 0) {
            var id = card.getAttribute('data-id');
            var name = card.getAttribute('data-name');
            var price = parseFloat(card.getAttribute('data-price'));
            
            cart[id] = {
                name: name,
                price: price,
                qty: qty
            };
        }
    });
}

function renderCart() {
    var container = document.getElementById('cartItems');
    
    if (Object.keys(cart).length === 0) {
        container.innerHTML = '<p class="empty-cart">No items added yet</p>';
        return;
    }
    
    var html = '';
    for (var id in cart) {
        var item = cart[id];
        var itemTotal = (item.price * item.qty).toFixed(2);
        html += '<div class="cart-item">' +
                '<div class="cart-item-info">' +
                '<h4>' + item.name + '</h4>' +
                '<p class="cart-item-qty">Qty: ' + item.qty + '</p>' +
                '</div>' +
                '<div class="cart-item-price">$' + itemTotal + '</div>' +
                '</div>';
    }
    container.innerHTML = html;
}

function calculateTotals() {
    var subtotal = 0;
    for (var id in cart) {
        subtotal += cart[id].price * cart[id].qty;
    }
    
    var tax = subtotal * 0.10;
    var deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    var deliveryFee = (deliveryRadio && deliveryRadio.value === 'delivery') ? 5.00 : 0;
    var total = subtotal + tax + deliveryFee;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('delivery').textContent = '$' + deliveryFee.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
    
    var checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = Object.keys(cart).length === 0;
    }
}