import { useState, useEffect } from 'react'
import axios from 'axios'
import { favProductsURL } from '../constants'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'

const FavProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchFavProducts = () => {
        console.log('fetchFavProducts')
        const favs = JSON.parse(localStorage.getItem('favs')) || {}
        let favsArray = Object.keys(favs)
        if (!localStorage.getItem('favs')) {
            favsArray = [0]
        }
        axios.get(favProductsURL(favsArray.join(',')))
            .then((res) => {
                let has_more = false
                if (res.data.next) {
                    has_more = true
                }
                setProducts(res.data.results)
                setLoading(false)
                setError(false)

            })
            .catch((err) => {
                setError(true)
                setLoading(false)
            })
        setLoading(false);
    }

    useEffect(() => {
        fetchFavProducts()
    }, []);


    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">

                <h1>Fav Product List</h1>
                {loading && <Loader />}
                {error && (
                    <div className="mt-4 text-red-500 text-lg">
                        {JSON.stringify(error)}
                    </div>
                )}
                <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                    {products && products.length > 0 ? products.map(item => {
                        return (
                            <div key={item.id} className="group relative">
                                {item.image_url ? (<div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none"><img src={item.image_url} alt={item.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                                </div>) : (
                                    <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                                    </div>
                                )}
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <Link to={`/products/${item.id}`}>
                                                <span aria-hidden="true" className="absolute inset-0"></span>
                                                {item.name} {item.available ? '' : <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">Out of stock</span>
                                                }
                                            </Link>
                                        </h3>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">${item.price}</p>
                                </div>
                            </div>

                        )
                    }): <div>No favorites yet
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default FavProductList;
