const apiURL = '/api';

export const endpoint = `${apiURL}`;

export const userMailingURL = `${endpoint}/signup/`;

export const productListURL = `${endpoint}/products/`;
export const productDetailURL = (productID) => `${endpoint}/products/${productID}/`;
