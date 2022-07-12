import React, { Component } from 'react'
import axios from 'axios';
import { productDetailURL } from '../constants'
import Loader from '../components/Loader'
import { Link, useParams } from 'react-router-dom'

class ProductDetail extends Component {
    
    state = {
        loading: false,
        error: null,
        data: []
    }

    componentDidMount() {
        this.handleFetchItem()
    }

    handleFetchItem = () => {
        const 
            { productID }  = this.props.params;
        this.setState({ loading: true });
        
        axios
            .get(productDetailURL(productID))
            .then(res => {
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            });
    }

    render() {
        const { data, loading, error } = this.state
        return(
            <div className="bg-white">
                <div className="pt-6">
                    <nav aria-label="Breadcrumb">
                        <ol className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
                            <li>
                                <div className="flex items-center">
                                    <Link to="/" className="mr-2 text-sm font-medium text-gray-900">
                                        &laquo; Back to products
                                    </Link>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{JSON.stringify(error)}</span>
                        </div>
                    )}
                    {loading && (
                        <Loader />
                    )}

                    <div className="mt-6 max-w-2xl mx-auto px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
                        <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
                            <img src={data?.image_url} alt={data.name} className="w-full h-full object-center object-cover" />
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
                        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                {data?.name}
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