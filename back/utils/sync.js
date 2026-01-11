const CartItem = require("../models/cart");

async function syncCartToDatabase(userId, sessionCart) {
    // Удаляем ВСЕ товары текущего пользователя из корзины
    await CartItem.destroy({ where: { userId } });

    // Если корзина пуста — ничего не добавляем
    if (!sessionCart || sessionCart.length === 0) {
        return;
    }

    // Подготавливаем данные для вставки
    const cartItemsToInsert = sessionCart.map(item => ({
        userId,
        productId: item.id,      // или item.productId — зависит от вашей структуры
        quantity: item.quantity
    }));

    // Вставляем все товары за один запрос
    await CartItem.bulkCreate(cartItemsToInsert);
}


module.exports = { syncCartToDatabase } ;