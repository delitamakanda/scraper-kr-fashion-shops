const apiURL = '/api';

export const endpoint = `${apiURL}`;

export const userMailingURL = `${endpoint}/signup/`;
export const weatherURL = `${endpoint}/weather/`;
export const productListURL = `${endpoint}/products/`;
export const favProductsURL = (productListIDs) => `${endpoint}/products/?id__in=${productListIDs}`;


export const LIKE_PRODUCT_KEY = 'likedProducts';

export const debounceTime = 300;

