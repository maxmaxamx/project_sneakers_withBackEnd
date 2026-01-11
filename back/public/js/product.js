$(".single-item").slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
});


// function addToCart(productId) {
//     if (!productId) {
//         console.error("Error: No product ID found.");
//         return;
//     }

//     const product = products.find(product => product.id == productId);
//     if (!product) return;

//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const existingProduct = cart.find(p => p.id == productId);

//     let summ = parseInt(JSON.parse(localStorage.getItem('total-summ')));

//     if (existingProduct) {
//         existingProduct.quantity += 1;
//         summ += product.price;
//     } else {
//         product.quantity = 1;
//         cart.push(product);
//         summ += product.price;
//     }

//     localStorage.setItem('cart', JSON.stringify(cart));

//     localStorage.setItem('total-summ', JSON.stringify(summ));

//     updateCartDisplay();

// }

async function add(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get('id');

    const res = await fetch("/auth/add-to-cart", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    return responseData;
}

function dismiss (){
    alert("Для добавления товара в корзину войдите в аккаунт");
}