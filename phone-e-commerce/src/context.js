import React, { createContext, useState, useEffect } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = createContext();

const ProductProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [detailedProduct, setDetailedProduct] = useState(detailProduct);
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState(detailProduct);
    const [cartSubTotal, setCartSubTotal] = useState(0);
    const [cartTax, setCartTax] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        dataSetProducts();
    }, []);

    useEffect(() => {
        addTotals();
    }, [cart]);

    function dataSetProducts() {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = { ...item };
            tempProducts = [...tempProducts, singleItem];
        });
        setProducts(tempProducts);
    };

    function getItem(id) {
        const product = products.find(item => {
            return item.id === id;
        })
        return product;
    }

    function handleDetail(id) {
        const product = getItem(id);
        setDetailedProduct(product);
    }

    function addToCart(id) {
        let tempProducts = [...products];
        const index = tempProducts.indexOf(getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        product.total = product.price;

        setProducts(tempProducts);
        setCart((prevState) => [...prevState, product]);
    }

    function openModal(id) {
        const product = getItem(id);
        setModalProduct(product);
        setIsModalOpen(true);
    }


    function closeModal() {
        setIsModalOpen(false);
    }

    function increment(id) {
        let tempCart = [...cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];

        product.count += 1;
        product.total += product.price;

        setCart(() => [...tempCart]);
        addTotals();
    }

    function decrement(id) {
        let tempCart = [...cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count -= 1;

        if (product.count === 0)
            removeItem(id);
        else {
            product.total -= product.price;
            
            setCart(() => [...tempCart]);
            addTotals();
        }

    }

    function removeItem(id) {
        let tempProducts = [...products];
        let tempCart = [...cart];

        tempCart = tempCart.filter(item => {
            return item.id !== id;
        });

        const index = tempProducts.indexOf(getItem(id));
        const removedProduct = tempProducts[index];

        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        setCart(() => [...tempCart]);
        setProducts(() => [...tempProducts]);
        addTotals();
    }

    function clearCart() {
        setCart([]);
        dataSetProducts();
        addTotals();
    }

    function addTotals() {
        let subTotal = 0;
        cart.map(item => subTotal += item.total);

        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));

        const total = subTotal + tax;

        setCartSubTotal(subTotal);
        setCartTax(tax);
        setCartTotal(total);
    }

    return (
        <ProductContext.Provider value={{
            products,
            detailedProduct,
            addToCart: addToCart,
            handleDetail: handleDetail,
            modalProduct: modalProduct,
            isModalOpen: isModalOpen,
            openModal: openModal,
            closeModal: closeModal,
            cart: cart,
            cartSubTotal: cartSubTotal,
            cartTax: cartTax,
            cartTotal: cartTotal,
            increment: increment,
            decrement: decrement,
            removeItem: removeItem,
            clearCart: clearCart,
            addTotals: addTotals
        }}>
            {props.children}
        </ProductContext.Provider>
    );
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
