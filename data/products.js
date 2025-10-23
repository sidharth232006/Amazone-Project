import { formatCurrency } from "../scripts/utils/money.js";

export let products = [];

export function loadProductsFetch() {
  const promise = fetch('https://supersimplebackend.dev/products').then((response) => {
    return response.json();
  }).then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
      // console.log('load products?');
  }).catch((error) => {
    console.log('unexpected error. Please try again later.');
  });
  return promise;
}
loadProductsFetch().then(() => {
  // console.log('next step?');
});

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
      callback();
    } catch (err) {}
  });

  xhr.addEventListener('error', (error) => {
    console.log('unexpected error. Please try again later.');
  });

  xhr.open("GET", "https://supersimplebackend.dev/products");
  xhr.send();
}

  export function makeProduct({
    id,
    name,
    priceCents,
    ratingCount,
    ratingStars,
    image,
  }) {
    return {
      id,
      name,
      priceCents,
      rating: { count: ratingCount, stars: ratingStars },
      image: image || "images/products/example.jpg",
      getPrice() {
        const dollars = (priceCents / 100).toFixed(0);
        return `$${dollars}`;
      },
      getStarsUrl() {
        return `images/products/ratings/rating-${this.rating.stars * 10}.png`;
      },
      extraInfoHTML() {
        return "";
      },
    };
  }

