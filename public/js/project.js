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

// function displayProducts(productsArray) {
//     const productsContainer = document.getElementById('products-container');
//     productsContainer.innerHTML = ''; // Очищаем контейнер

//     productsArray.slice(0, 9).forEach(product => {
//         const button = document.createElement('button');
//         button.classList.add('view-details');
//         button.textContent = "Подробнее";
        
//         const productCard = document.createElement('div');
//         productCard.classList.add('product-card');
//         productCard.dataset.id = product.id;

//         const productImage = document.createElement('img');
//         productImage.src = product.image[0];
//         productImage.alt = product.title;
//         productImage.classList.add('img-small');

//         const productTitle = document.createElement('h3');
//         productTitle.textContent = product.title;

//         const productPrice = document.createElement('p');
//         productPrice.textContent = `$${product.price}`;

//         const productDescription = document.createElement('p');
//         productDescription.textContent = product.description;
//         productDescription.classList.add('hidden');

//         const mod = document.createElement('div');
//         mod.innerHTML = `<div id="modal" class="modal hidden">
//         <div class="modal-content"> 
//             <h2 id="modal-title">Название товара</h2>
//             <div class="single-item" id="owl"></div>
//             <p><b id="modal-price">Цена: $0</b></p>
//             <p id="modal-description">Описание товара...</p>    
//             <button id="add-to-cart" data-cart onclick="addToCart(event)">Добавить в корзину</button>
//         </div>
//     </div>`



//         productCard.appendChild(productImage);
//         productCard.appendChild(productTitle);
//         productCard.appendChild(productPrice);
//         productCard.appendChild(productDescription);
//         productCard.appendChild(button);
//         productCard.appendChild(mod);

//         productsContainer.appendChild(productCard);
//         button.addEventListener('click', show);
        
//     });
            
// }

// displayProducts(products);





