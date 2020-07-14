class Product {
    constructor(title = 'DEFAULT', imageUrl = '', price = 0, description = '') {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
}

class ElementAttribute {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render();
        }
    }

    render() {}

    createRootElement(tag, cssClsses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClsses) {
            rootElement.className = cssClsses;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];

    constructor(renderHookId) {
        super(renderHookId);
    }

    get totalAmount() {
        const sum = this.items.reduce(
            (prevValue, curItem) => prevValue + curItem.price,
            0
        );
        return sum.toFixed(2);
    }

    addProduct(product) {
        this.items.push(product);
        this.totalOutput.innerText = `Total: \$${this.totalAmount}`;
    }

    orderProducts() {
        console.log(this.items);
    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button class="btn">Order Now!</button>
        `;
        const orderButton = cartEl.querySelector('button');
        orderButton.addEventListener('click', () => this.orderProducts());
        this.totalOutput = cartEl.querySelector('h2');
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item');

        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}" >
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$ ${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button class="btn">Add to Cart</button>
                </div>
            </div>
        `;
        const addCartButton = prodEl.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    products = [];

    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProducts();
    }

    fetchProducts() {
        this.products = [
            new Product(
                'A Pillow',
                'https://images-na.ssl-images-amazon.com/images/I/617Nf9st-CL._AC_SX522_.jpg',
                19.99,
                'A soft pillow!'
            ),
            new Product(
                'A Carpet',
                'https://images-na.ssl-images-amazon.com/images/I/71jdTWL4r4L._SX466_.jpg',
                89.99,
                'A carpet which you might like!'
            ),
        ];
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.products) {
            new ProductItem(prod, 'product-list');
        }
    }

    render() {
        const prodList = this.createRootElement('ul', 'product-list', [
            new ElementAttribute('id', 'product-list'),
        ]);
        if (this.products && this.products.length > 0) {
            this.renderProducts();
        }
    }
}

class Shop {
    constructor() {
        this.render();
    }

    render() {
        this.cart = new ShoppingCart('app');

        new ProductList('app');
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }
    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();
