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
let buttonsDom = [];

closeCartBtn.addEventListener("click", () => {
  cartOverlay.classList.remove("transparentBcg");
  cartDom.classList.remove("showCart");
});
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

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDom = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //Get specific product

        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        //add product to the cart
        cart = [...cart, cartItem];
        //Save cart in local storage
        Storage.saveCart(cart);
        this.setCartValues(cart);
        //Add cart item
        this.addCartItem(cartItem);
        //Show cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.image} alt="product" />
    <div>
      <h4>${item.title}</h4>
      <h5>${item.price}</h5>
      <span class="remove-item" data-id = ${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id = ${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id = ${item.id}></i>
    </div>
    `;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDom.classList.add("showCart");
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      //It will not return any button if the ui.displayproducts is not loaded
      ui.getBagButtons();
    });
});
