import { orders } from "../../data/orders.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";

const orderGrid = document.querySelector('.js-order-grid');

function renderOrders() {
  let ordersHTML = '';

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    let orderItemsHTML = '';

    order.items.forEach((item) => {
      const product = getProduct(item.productId);

      orderItemsHTML += `
        <div class="order-item">
          <div class="order-item-image-container">
            <img class="order-item-image" src="${product.image}">
          </div>

          <div class="order-item-details">
            <div class="order-item-name">${product.name}</div>
            <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            <div class="order-item-price">$${formatCurrency(product.priceCents * item.quantity)}</div>
          </div>
        </div>
      `;
    });

    ordersHTML += `
      <div class="order-card">
        <div class="order-header">
          <div>Order placed: <strong>${orderDate.toLocaleDateString()}</strong></div>
          <div>Total: <strong>$${formatCurrency(order.totalCents)}</strong></div>
        </div>

        <div class="order-items">
          ${orderItemsHTML}
        </div>
      </div>
    `;
  });

  orderGrid.innerHTML = ordersHTML;
}

renderOrders();
