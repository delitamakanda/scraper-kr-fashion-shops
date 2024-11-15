import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {productListURL} from "../constants.js";
import {useState} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
const PlaceholderImage = '../assets/dummy_275x360_ffffff_cccccc.png';

export function Layout() {
    const [ page, setPage ] = useState(1);

    const fetchProducts = (page = 1) => fetch(productListURL + '?page=' + page).then(res => res.json());
    const { isPending, isError, error, data, isFetching, isPlaceholderData } = useQuery({
        queryKey: ['productData', page],
        placeholderData: keepPreviousData,
        queryFn: () => fetchProducts(page),
    });


    return (
        <div>
            {isPending ? (<>Loading..</>): isError ? (<>Error: {error.message}</>): (
                <>
                    <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                    {data && data.results && (
                        data.results.map(product => (
                            <div key={product.id} className="group relative">
                                <div
                                    className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                    <LazyLoadImage src={product.image_url} alt={product.name} height={'100%'} width={'100%'} placeholdersrc={PlaceholderImage} className="w-full h-full object-center object-cover lg:w-full lg:h-full" effect="blur"/>
                                </div>

                            </div>

                        ))
                    )}
                    </div>
                    <span>Page: {page}</span>
                    <button onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 1}>Previous
                    </button>
                    <button onClick={
                        () => {
                            if (!isPlaceholderData && data.next) {
                                setPage((old) => old + 1);
                            }
                        }
                    } disabled={isPlaceholderData || !data.next}>Next
                    </button>
                </>
            )}
        </div>
    )
}