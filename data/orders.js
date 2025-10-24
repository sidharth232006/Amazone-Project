export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(cartItems, totalCents) {
  const order = {
    id: crypto.randomUUID(),
    date: dayjs().format("MMMM D"),
    totalCents,
    items: cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryDate: item.deliveryDate
    }))
  };

  orders.unshift(order);
  saveToStorage();
}

export function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}
