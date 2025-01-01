import {favProductsURL, LIKE_PRODUCT_KEY, productListURL, weatherURL} from "../constants.js";

const fetchFavProducts = async () => {
        const listIds = JSON.parse(localStorage.getItem(LIKE_PRODUCT_KEY)) || [];
        const response = await fetch(favProductsURL(listIds));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }

    const fetchWeather = async () => {
        const response = await fetch(weatherURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }

    const fetchProducts = (page, searchValue) => fetch(productListURL + '?page=' + page + '&q=' + searchValue).then(res => res.json() || []);

export { fetchFavProducts, fetchWeather, fetchProducts };