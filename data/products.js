import { formatCurrency } from "../scripts/utils/money.js";

export let products = [];

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/products/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return "";
  }
}

class Clothing extends Product {
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `<a href="${this.sizeChartLink}" target="_blank">Size chart</a>`;
  }
}

export function loadProducts(callback) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    try {
      const data = JSON.parse(xhr.response);
      products = data.map((p) => (p.type === "clothing" ? new Clothing(p) : new Product(p)));
      console.log("✅ Products loaded:", products);
      callback();
    } catch (err) {
      console.error("❌ Failed to parse products:", err);
    }
  });

  xhr.open("GET", "https://supersimplebackend.dev/products");
  xhr.send();
}
