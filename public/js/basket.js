function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Сохранить корзину в localStorage
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Делегирование событий для кнопок в корзине
document.querySelector('.shopping-cart').addEventListener('click', function(event) {
    const btn = event.target;
    const productId = btn.getAttribute('data-id');
    if (!productId) return;

    if (btn.getAttribute('data-action') === 'plus') {
        plus(+productId);
    } else if (btn.getAttribute('data-action') === 'minus') {
        minus(+productId);
    } else if (btn.getAttribute('data-action') === 'remove') {
        removeFromCart(+productId);
    }
});

// Удаление товара
function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    setCart(cart);
}

// Увеличить количество
async function plus(productId) {
    let cart = getCart();
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity += 1;
        setCart(cart);
    }
}

// Уменьшить количество
function minus(productId) {
    let cart = getCart();
    const product = cart.find(p => p.id === productId);
    if (product) {
        if (product.quantity > 1) {
            product.quantity -= 1;
        } else {
            cart = cart.filter(p => p.id !== productId);
        }
        setCart(cart);
        updateCartDisplay();
    }
}