const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-center");

//Cart array for storing the content of cart locally in the array

let cart = [];

//Getting the products
class Products {
  async getProducts() {
    try {
      //Fetch will return promise await will settle promise either resolve or reject
      let result = await fetch("products.json");
      let data = await result.json();
      //Getting the items array and travering through each item
      let products = data.items;
      products = products.map((item) => {
        //Destructing the object and taking require information
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//Displaying the products
class UI {
  displayProducts(products) {
    let result = " ";
    products.forEach((product) => {
      result += `
      <article class="product">
      <div class="img-container">
        <img
          src=${product.image}
          alt="product-image"
          class="product-img"
        />
        <button class="bag-btn" data-id=${product.id}>
          <i class="fas fa-shopping-cart"></i>
          Go to bag
        </button>
      </div>
      <h3>${product.title}</h3>
      <h4>₹${product.price}</h4>
    </article>
  `;
    });
    productsDom.innerHTML = result;
  }
}

class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  products.getProducts().then((products) => ui.displayProducts(products));
});
