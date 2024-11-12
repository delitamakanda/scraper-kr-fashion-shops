import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { productDetailURL } from '../constants'
import getCookie from '../utils/cookie'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import { HeartIcon } from '@heroicons/react/outline'
import { classNames } from '../utils/styling'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PlaceholderImage from '../assets/dummy_275x360_ffffff_cccccc.png';

function handleClick() {
    sessionStorage.setItem('scrollPosition', window.pageYOffset)
}

const Item = (props) => {
    let { item, onItemChange } = props
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    }, [loading])
    function deleteFromLocalStorage({ id }) {

        // delete fav from local storage
        let jsonFavs = JSON.parse(localStorage.getItem('favs')) || {}
        if (jsonFavs[id]) {
            delete jsonFavs[id]
            localStorage.setItem('favs', JSON.stringify(jsonFavs))
            item.is_liked = false
        }
    }

    function addToLocalStorage({ id }) {
        // add fav to local storage
        let jsonFavs = JSON.parse(localStorage.getItem('favs')) || {}
        if (jsonFavs[id] === undefined || jsonFavs[id] === null) {
            jsonFavs[id] = Date.now()
            localStorage.setItem('favs', JSON.stringify(jsonFavs))
            item.is_liked = true
        }
    }

    function toggleLikeProduct(event, { id }, isLiked) {
        event.preventDefault()
        setLoading(true)
        
        axios
            .patch(productDetailURL(id), { is_liked : isLiked}, { withCredentials:true, headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }})
            .then(() => {
                isLiked ? addToLocalStorage(item) : deleteFromLocalStorage(item)
                setLoading(false)
                onItemChange(item)
            })
            .catch(err => {
                setError(err)
                setLoading(false)
            });
    }

    return (
        <div key={item.id} data-id={item.id} className="group relative">
            {item.image_url ? (<div className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                
                    <LazyLoadImage src={item.image_url} alt={item.name} height={'100%'} width={'100%'} placeholdersrc={PlaceholderImage} className="w-full h-full object-center object-cover lg:w-full lg:h-full" effect="blur" />
                
            </div>) : (
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                    <LazyLoadImage src={item.image} alt={item.name} placeholdersrc={PlaceholderImage} className="w-full h-full object-center object-cover lg:w-full lg:h-full" effect="blur" />
                </div>
            )}
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700" onClick={handleClick}>
                    <a rel='noreferrer' href={item.external_link} target="_blank" tabIndex={item.id}>
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {item.name} {item.available ? '' : <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">Out of stock</span>
                        }</a>
                    </h3>
                    {!item.is_liked ? <button onClick={(event) => toggleLikeProduct(event, item, true)} title={item.name} className="absolute top-5 right-5 bg-white shadow w-12 h-12 rounded-full  flex justify-center items-center text-gray-400 ">
                        <HeartIcon
                        className={classNames(
                            'h-8 w-8 group-hover:text-gray-400'
                        )}
                        aria-hidden="true" />
                    </button> : <button onClick={(event) => toggleLikeProduct(event, item, false)} title={item.name} className="absolute top-5 right-5 bg-white shadow w-12 h-12 rounded-full  flex justify-center items-center text-gray-400 ">
                        <HeartIconSolid
                        className={classNames(
                            'h-8 w-8 group-hover:text-gray-400'
                        )}
                        aria-hidden="true" />
                    </button>}
                    
                </div>
                <p className="text-sm font-medium text-gray-900">${item.price}</p>
            </div>
        </div>
    )
}

export default Item;
