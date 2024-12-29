import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {productListURL } from "../constants.js";
import React, {useState} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
const PlaceholderImage = '../assets/dummy_275x360_ffffff_cccccc.png';
import Loader from "../components/core/ui/Loader/Loader";
import Select from '../components/core/ui/Selector/Select'
import ModalNewsletter from '../components/modalNewsletter/ModalNewsletter'
import { brands } from '../components/core/ui/Selector/helper'

export function Layout() {
    const [ page, setPage ] = useState(1);
    const [tab, setTab ] = useState(0);
    const [searchValue, setSearchValue ] = useState('');

    const fetchProducts = (page, searchValue) => fetch(productListURL + '?page=' + page + '&q=' + searchValue).then(res => res.json() || [])

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


    return (
        <div className="wrapper">
            <Select selectedBrand={handleSelectedBrand} />
            {isPending ? (<Loader/>) : isError ? (<>Error: {error.message}</>) : (
                <div className="header-content pb-32">
                    {tab === 0 && (
                        <div>
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
                            tabs 1
                        </div>
                    )}

                </div>
            )}

            <div className="btm-nav btm-nav-lg footer fixed flex align-middle justify-center bottom-0 left-0 right-0 ">
                <button className="text-primary" onClick={() => handleTabChange(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6 h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                    </svg>

                </button>
                <button className="text-primary active " onClick={() => handleTabChange(1)}>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6 h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                    </svg>

                </button>

            </div>
            <ModalNewsletter />
        </div>
    )
}