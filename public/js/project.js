$(document).ready(function(){
  AOS.init();
});


let summ = 0;
localStorage.setItem('total-summ',JSON.stringify(summ));


const buttons = document.querySelectorAll(".view-details");

function close(){
    const carousel = document.getElementById("owl");
    carousel.innerHTML = '';
    document.getElementById('modal').classList.add('hidden');
}


function addToCart(productId) {
    if (!productId) {
        console.error("Error: No product ID found.");
        return;
    }

    const product = products.find(product => product.id == productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(p => p.id == productId);

    let summ = parseInt(JSON.parse(localStorage.getItem('total-summ')));

    if (existingProduct) {
        existingProduct.quantity += 1;
        summ += product.price;
    } else {
        product.quantity = 1;
        cart.push(product);
        summ += product.price;
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    localStorage.setItem('total-summ', JSON.stringify(summ));

    updateCartDisplay();

}

document.addEventListener('click', (event) => {
    if(event.target === document.getElementById("modal")){
        close();
    }
});