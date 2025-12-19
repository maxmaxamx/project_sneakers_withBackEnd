document.querySelector('.shopping-cart').addEventListener('click', function (event) {
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


async function removeFromCart(productId, element) {
  try {
    const response = await fetch(`/auth/basket/delete/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Не удалось удалить товар');
    }

    const result = await response.json();

    location.reload();

  } catch (error) {
    console.error('Ошибка удаления:', error);
    alert("Ошибка: " + error.message);
  }
}

// Увеличить количество
async function plus(productId) {
  try {
    const response = await fetch(`/auth/basket/plus/${productId}`, {
      method: "PUT",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Не удалось добавить товар');
    }

    const result = await response.json();

    location.reload();

  } catch (error) {
    console.error('Ошибка удаления:', error);
    alert("Ошибка: " + error.message);
  }
}

async function minus(productId) {
  try {
    const response = await fetch(`/auth/basket/minus/${productId}`, {
      method: "PUT",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Не удалось уменьшить товар');
    }

    const result = await response.json();

    location.reload();

  } catch (error) {
    console.error('Ошибка удаления:', error);
    alert("Ошибка: " + error.message);
  }
}