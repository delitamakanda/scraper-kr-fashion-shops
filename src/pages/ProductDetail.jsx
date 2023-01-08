import React, { Component } from 'react'
import axios from 'axios';
import { productDetailURL } from '../constants'
import Loader from '../components/Loader'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon } from '@heroicons/react/solid'
import { classNames } from '../utils/styling'
import getCookie from '../utils/cookie'

class ProductDetail extends Component {
    
    state = {
        loading: false,
        error: null,
        data: [],
        is_liked: false
    }

    componentDidMount() {
        this.handleFetchItem()
    }

    loadDetail = (id) => {
        this.setState({
            loading: true
        })
        this.setState({ loading: true });
        
        axios
            .get(productDetailURL(id))
            .then(res => {
                this.setState({ data: res.data, loading: false });
                this.displayFavorite(res.data);
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            });
    }

    handleFetchItem = () => {
        const 
            { productID }  = this.props.params;
        
        this.loadDetail(productID)
    }

    changeProduct = (event, productID) => {
        event.preventDefault()
        window.history.pushState({}, '', `/products/${productID}`)
        this.loadDetail(productID)
    }

    displayFavorite = ({id}) => {
        if (localStorage.getItem('favs') === null) {
            return false;
        }
        if (JSON.parse(localStorage.getItem('favs'))[id]) {
            this.setState({ is_liked: true })
        } else {
            this.setState({ is_liked: false })
        }
    }

    addToLocalStorage = ({ id }) => {
        // add fav to local storage
        let jsonFavs = JSON.parse(localStorage.getItem('favs')) || {};
        if (jsonFavs[id] === undefined || jsonFavs[id] === null) {
            jsonFavs[id] = Date.now();
            localStorage.setItem('favs', JSON.stringify(jsonFavs));
            this.setState({ is_liked: true })
        }
    }

    likeProduct = (event, { id }) => {
        event.preventDefault()
        this.setState({
            loading: true
        })
        this.setState({ loading: true });
        
        axios
            .patch(productDetailURL(id), { is_liked : true}, { withCredentials:true, headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }})
            .then(res => {
                this.setState({ data: res.data, loading: false });
                this.addToLocalStorage(res.data);
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            });
    }

    render() {
        const { data, loading, error, is_liked } = this.state
        return(
            <div className="bg-white">
                <div className="pt-6">
                    <nav aria-label="Breadcrumb">
                        <ol className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
                            <li>
                                <div className="flex items-center">
                                    <Link to="/" className="mr-2 text-sm font-medium text-gray-900">
                                        &laquo; Go back
                                    </Link>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {data?.next_item ?
                        <button onClick={(event) => this.changeProduct(event, data.next_item.id)} title={data.next_item.name} className="fixed z-90 lg:bottom-40 left-8 bg-pink-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-pink-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">
                            <ArrowLeftIcon
                            className={classNames(
                                'h-8 w-8 group-hover:text-white'
                            )}
                            aria-hidden="true" />
                        </button> : <div />}
                    
                    {data?.previous_item ? 
                        <button onClick={(event) => this.changeProduct(event, data.previous_item.id)} title={data.previous_item.name} className="fixed z-90 lg:bottom-40 right-8 bg-pink-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-pink-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">
                            <ArrowRightIcon
                            className={classNames(
                                'h-8 w-8 group-hover:text-white'
                            )}
                            aria-hidden="true" />
                        </button> : <div />}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{JSON.stringify(error)}</span>
                        </div>
                    )}
                    {loading && (
                        <Loader />
                    )}

                    <div className="mt-6 max-w-2xl mx-auto px-6">
                        <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
                            <img src={data?.image_url} alt={data.name} className="mx-auto w-full h-full object-center object-cover" />
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
                        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                {data?.name}

                                {!is_liked ? 
                        <button onClick={(event) => this.likeProduct(event, data)} title={data?.name} className="fixed z-90 bottom-80 right-8 bg-pink-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-pink-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">
                            <HeartIcon
                            className={classNames(
                                'h-8 w-8 group-hover:text-white'
                            )}
                            aria-hidden="true" />
                        </button> : <div />}

                            </h1>
                        </div>

                        <div className="mt-4 lg:mt-0 lg:row-span-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900">${data?.price}</p>

                            <a type="button" target="_blank" rel="noreferrer" className="mt-10 w-full bg-pink-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500" href={data?.external_link}>See the product</a>
                        </div>

                        <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                            <div>
                                <h3 className="sr-only">Description</h3>

                                <div className="space-y-6">
                                    <p className="text-base text-gray-900">{data?.description}</p>
                                    {!data?.available && <p className="text-base text-gray-900">Out Of Stock</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (props) => (<ProductDetail {...props} params={useParams()} />)