'use strict';

class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.shipping = oldCart.shipping || 0;
        this.discount = oldCart.discount || 0;

        this.couponCode = oldCart.couponCode || '';
        this.paymentMethod = oldCart.paymentMethod || 'COD';
        this.shippingAddress = oldCart.shippingAddress || '';
    }

    get quantity() {
        let quantity = 0;
        for (let id in this.items) {
            quantity += parseInt(this.items[id].quantity);
        }
        return quantity;
    }

    get subtotal() {
        let price = 0;
        for (let id in this.items) {
            price += parseFloat(this.items[id].total);
        }
        return parseFloat(price).toFixed(2);
    }

    get total() {
        let price = parseFloat(this.subtotal) + parseFloat(this.shipping) - parseFloat(this.discount);
        return parseFloat(price).toFixed(2);
    }

    add(product, quantity) {
        let id = product.id;
        let storedItem = this.items[id];
        if (!storedItem) {
            this.items[id] = { product, quantity: 0, total: 0 };
            storedItem = this.items[id];
        }
        storedItem.quantity += parseInt(quantity);
        storedItem.total = parseFloat(storedItem.product.price * storedItem.quantity).toFixed(2);
        return storedItem;
    }

    remove(id) {
        let storedItem = this.items[id];
        if (storedItem) {
            delete this.items[id];
        }
    }

    update(id, quantity) {
        let storedItem = this.items[id];
        if (storedItem && quantity >= 1) {
            storedItem.quantity = quantity;
            storedItem.total = parseFloat(storedItem.product.price * storedItem.quantity).toFixed(2);
        }
        return storedItem;
    }

    clear() {
        this.items = {};
        this.discount = 0;
        this.shipping = 0;
        this.couponCode = '';
    };

    #generateArray() {
        let arr = [];
        for (let id in this.items) {
            this.items[id].product.price = parseFloat(this.items[id].product.price).toFixed(2);
            this.items[id].total = parseFloat(this.items[id].total).toFixed(2);
            arr.push(this.items[id]);
        }
        return arr;
    };

    getCart() {
        return {
            items: this.#generateArray(),
            quantity: this.quantity,
            subtotal: this.subtotal,
            total: this.total,
            shipping: parseFloat(this.shipping).toFixed(2),
            discount: parseFloat(this.discount).toFixed(2),
            couponCode: this.couponCode,
            paymentMethod: this.paymentMethod,
            shippingAddress: this.shippingAddress
        }
    }
}

module.exports = Cart;