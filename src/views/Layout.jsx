import {keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {LIKE_PRODUCT_KEY } from "../constants.js";
import {useState, useCallback } from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
const PlaceholderImage = '../assets/dummy_275x360_ffffff_cccccc.png';
import Loader from "../components/core/ui/Loader/Loader";
import Select from '../components/core/ui/Selector/Select'
import CookieBanner from "../components/cookieBanner/CookieBanner";
import ModalNewsletter from '../components/modalNewsletter/ModalNewsletter'
import { brands } from '../components/core/ui/Selector/helper'
import { fetchProducts, fetchWeather, fetchFavProducts } from '../services/api'

export function Layout() {
    const [ page, setPage ] = useState(1);
    const [tab, setTab ] = useState(0);
    const [searchValue, setSearchValue ] = useState('');
    const [isProductsIsFavorited, setIsProductsIsFavorited ] = useState(false);

    const queryClient = useQueryClient();

    const toggleFavoriteMutation = useMutation({
        mutationFn: (productId) => {
            const likedProductsStorage = JSON.parse(localStorage.getItem(LIKE_PRODUCT_KEY)) || [];
            const updatedLikedProducts = likedProductsStorage.includes(productId)
                ? likedProductsStorage.filter(id => id !== productId)
                : [...likedProductsStorage, productId];

            localStorage.setItem(LIKE_PRODUCT_KEY, JSON.stringify(updatedLikedProducts));
            return updatedLikedProducts;
        }
    })

    const {data: weatherData } = useQuery({
        queryKey: ['weatherData'],
        queryFn: () => fetchWeather(),
        placeholderData: keepPreviousData,
    })

    const { data: favProductsData, isSuccess  } = useQuery({
        queryKey: ['favProductsData'],
        queryFn: () => fetchFavProducts(),
        placeholderData: keepPreviousData,
        enabled: isProductsIsFavorited
    })

    const { isPending, isError, error, data, isFetching, isPlaceholderData  } = useQuery({
        queryKey: ['productData', page, searchValue],
        placeholderData: keepPreviousData,
        queryFn: () => fetchProducts(page, searchValue),
    });

    const handleTabChange = (index) => {
        setTab(index);
        // scroll to top
        window.scrollTo(0, 0);
    }

    const handleSelectedBrand = async (brand) => {
        if (brands.includes(brand)) {
            setSearchValue(brand);
           setPage(1);
        }
    }

    const toggleLiked = (productId) => () => {
        toggleFavoriteMutation.mutate(productId, {
            onSuccess: (updatedLikedProducts) => {
                setIsProductsIsFavorited(updatedLikedProducts.length > 0)
                queryClient.invalidateQueries(['favProductsData'])
            }
        });
    }

    const productIsLiked = (productId) => {
        const likedProductsStorage = JSON.parse(localStorage.getItem(LIKE_PRODUCT_KEY)) || [];
        return likedProductsStorage.includes(productId);
    }

    return (
        <div className="wrapper">
            <Select selectedBrand={handleSelectedBrand} />
            {isPending ? (<Loader/>) : isError ? (<>Error: {error.message}</>) : (
                <div className="header-content">
                    {tab === 0 && (
                        <div style={{ paddingBottom: '90px'}}>
                            <div
                                className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                                {data && data.results && (
                                    data.results.map(product => (
                                        <div key={product.id} className="group relative">
                                            <div
                                                className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                                <LazyLoadImage src={product.image_url} alt={product.name}
                                                               height={'100%'}
                                                               width={'100%'} placeholdersrc={PlaceholderImage}
                                                               className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                                               effect="blur"/>

                                            </div>

                                            <div className="mt-4 flex justify-between">
                                                <div>
                                                    <h3 className="text-sm text-gray-700">
                                                        <a rel='noreferrer' href={product.external_link} target="_blank"
                                                           tabIndex={product.id}>
                                                            <span aria-hidden="true"
                                                                  className="absolute inset-0"></span>
                                                            {product.name}
                                                        </a>
                                                    </h3>
                                                </div>
                                                <button onClick={toggleLiked(product.id)} className="appearance-none absolute top-0 right-0">
                                                    {!productIsLiked(product.id) ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                             className="size-6 h-8 w-8">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                                        </svg>
                                                    ) : (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                              fill="currentColor" className="size-6 h-8 w-8">
                                                        <path
                                                            d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
                                                    </svg>)}
                                                </button>
                                                <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                            </div>
                                        </div>

                                    ))
                                )}
                            </div>
                            <div className="join grid grid-cols-2">
                                <button className="join-item btn btn-outline"
                                        onClick={() => setPage((old) => Math.max(old - 1, 0))}
                                        disabled={page === 1}>Previous
                                </button>
                                <button className="join-item btn btn-outline" onClick={
                                    () => {
                                        if (!isPlaceholderData && data.next) {
                                            setPage((old) => old + 1);
                                        }
                                    }
                                } disabled={isPlaceholderData || !data.next}>Next
                                </button>
                            </div>
                        </div>
                    )}
                    {tab === 1 && (
                        <div>
                            {favProductsData.results.map((product, idx) => (
                                <div key={idx} className="group relative">
                                    <div
                                        className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none cursor-pointer">
                                        <LazyLoadImage src={product.image_url} alt={product.name}
                                                       height={'100%'}
                                                       width={'100%'} placeholdersrc={PlaceholderImage}
                                                       className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                                       effect="blur"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {tab === 2 && (
                        <div>
                            <ul>
                            {weatherData.map((w, index) => (
                                <li key={index}>
                                    <h3>{w.city}</h3>
                                    <p>Temperature: {w.temperature}°C</p>
                                    <p>Humidity: {w.humidity}%</p>
                                    <p>Description: {w.description}</p>
                                    <img src={`http://openweathermap.org/img/wn/${w.icon}.png`}
                                         alt={w.description} className="w-10 h-10"/>

                                </li>
                            ))}
                            </ul>
                        </div>
                    )}

                </div>
                    )}

                    <div
                        className="btm-nav btm-nav-lg">
                        <button className="text-primary" onClick={() => handleTabChange(0)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                            </svg>

                        </button>
                        {isProductsIsFavorited && (<button className="text-primary " onClick={() => handleTabChange(1)}>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                            </svg>

                        </button>)}
                        <button className="text-primary" onClick={() => handleTabChange(2)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
                            </svg>
                        </button>

                    </div>
                    <ModalNewsletter/>
                    <CookieBanner />
                </div>
    )
}