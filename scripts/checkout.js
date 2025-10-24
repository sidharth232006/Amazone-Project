import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch} from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
  try{
    // throw 'error1'
    await loadProductsFetch();
    
    const value = await new Promise((resolve, reject) => {
    // throw 'error2'
      loadCart(() => {
        // reject('error3');
        resolve('value3');
      });
    });
  } catch (error) {
    console.log('unexpected error. Please try again later.');
  }
    
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

function setupPlaceOrderButton() {
  const button = document.querySelector(".js-place-order");
  if (!button) return;

  button.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Create delivery date for each item
    const orderItems = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryDate: dayjs().add(3, "days").format("MMMM D")
    }));

    // Calculate total price from payment summary
    const totalCents = calculateTotalPrice();

    // Save order
    addOrder(orderItems, totalCents);

    // Clear cart
    clearCart();

    // Redirect to Orders Page
    window.location.href = "orders.html";
  });
}