import {keepPreviousData, useQuery } from "@tanstack/react-query";
import {useState } from "react";
import Loader from "../components/core/ui/Loader/Loader";
import Select from '../components/core/ui/Selector/Select'
import CookieBanner from "../components/cookieBanner/CookieBanner";
import ModalNewsletter from '../components/modalNewsletter/ModalNewsletter'
import { brands } from '../components/core/ui/Selector/helper'
import { fetchWeather } from '../services/api'
import { ProductGrid } from '../components/productGrid/ProductGrid'
import { useFavorites } from '../hooks/useFavorites'
import { useProducts } from '../hooks/useProducts'

export function Layout() {
    const [tab, setTab ] = useState(0);
    const { favProductsData, toggleLiked, productIsLiked, isProductsIsFavorited  } = useFavorites();
    const { products, isPending, isError, error, page, setPage, searchValue, setSearchValue, hasNextPage, isPlaceholderData } = useProducts();

    const {data: weatherData } = useQuery({
        queryKey: ['weatherData'],
        queryFn: () => fetchWeather(),
        placeholderData: keepPreviousData,
    })

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

    return (
        <div className="wrapper">
            <Select selectedBrand={handleSelectedBrand} />
            {isPending ? (<Loader/>) : isError ? (<>Error: {error.message}</>) : (
                <div className="header-content">
                    {tab === 0 && (
                        <div style={{ paddingBottom: '90px'}}>
                            <ProductGrid products={products} toggleLiked={toggleLiked} productIsLiked={productIsLiked} />
                            <div className="join grid grid-cols-2">
                                <button className="join-item btn btn-outline"
                                        onClick={() => setPage((old) => Math.max(old - 1, 0))}
                                        disabled={page === 1}>Previous
                                </button>
                                <button className="join-item btn btn-outline" onClick={
                                    () => {
                                        if (!isPlaceholderData && hasNextPage) {
                                            setPage((old) => old + 1);
                                        }
                                    }
                                } disabled={isPlaceholderData || !hasNextPage}>Next
                                </button>
                            </div>
                        </div>
                    )}
                    {tab === 1 && (
                        <div style={{ paddingBottom: '90px'}}>
                            <ProductGrid products={favProductsData?.results || []} toggleLiked={toggleLiked} productIsLiked={productIsLiked} />
                        </div>
                    )}
                    {tab === 2 && (
                        <div style={{ paddingBottom: '90px'}}>
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
