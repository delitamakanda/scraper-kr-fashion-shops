import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { productListURL } from '../constants'
import Loader from '../components/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import MyModal from '../components/Modal'
import Select from '../components/Select'
import Carousel from 'react-img-carousel'
import 'react-img-carousel/lib/carousel.css'
import { shuffle } from 'lodash'

class ProductList extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            selectedItems: null,
            randomImages: [],
            error: null,
            data: [],
            next_url: productListURL,
            count: null,
            more_exist: false,
        }
    }
    

    componentDidMount() {
        this._isMounted = true
        
        axios
        .get(this.state.next_url)
        .then(res => {
            let has_more = false
            if (res.data.next) {
                    has_more = true
                }
                this.setState({
                    next_url: res.data.next,
                    data: res.data.results,
                    loading: false,
                    count: res.data.count,
                    more_exist: has_more
                }, () => {
                    this.handleScrollPosition()
                    this.getRandomItems()
                });
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    getRandomItems = () => {
        this.setState({
            randomImages: shuffle(this.state.data).slice(0, 10)
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchProducts = () => {
        axios
            .get(this.state.next_url)
            .then(res => {
                let has_more = false
                if (res.data.next) {
                    has_more = true
                }
                this.setState({
                    next_url: res.data.next,
                    data: this.state.data.concat(res.data.results),
                    loading: false,
                    more_exist: has_more
                }, () => {
                    this.handleScrollPosition()
                });
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleScrollPosition = () => {
        const scrollPosition = sessionStorage.getItem('scrollPosition')
        if (scrollPosition) {
            window.scrollTo(0, +scrollPosition)
            sessionStorage.removeItem('scrollPosition')
        }

    }

    handleClick = () => {
        sessionStorage.setItem('scrollPosition', window.pageYOffset)
    }
    
    handleChildToParent = (words) => {
        this.setState({ selectedItems: words })
    }

    render() {
        const { data, error, more_exist, count, selectedItems, randomImages } = this.state
        const filteredItems = selectedItems && selectedItems.name !== 'All' ? data.filter((product) => product.source === selectedItems.name) : data

        return (
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    {randomImages && randomImages.length ? <Carousel
                        slideHeight="320px"
                        width="100%"
                        viewportWidth="100%"
                        clickToNavigate={false}
                        lazyLoad={true}
                        cellPadding={5}
                        arrows={true}
                        draggable={false}
                        autoplay={true}
                        autoplaySpeed={4000}
                        style={{
                            slide: {
                                opacity: 0.2
                            },
                            selectedSlide: {
                                opacity: 1
                            }
                        }}>
                        {randomImages.map(image => {
                            return <Link key={image.id} to={`/products/${image.id}`}><img src={image.image_url} /></Link>
                        }
                        )}
                    </Carousel> : <Loader />}
                    <Select onSelectProducts={data} countProducts={count} dataChildToParent={this.handleChildToParent} />
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{JSON.stringify(error)}</span>
                        </div>
                    )}
                    <InfiniteScroll
                        dataLength={data.length}
                        next={this.fetchProducts}
                        hasMore={more_exist}
                        loader={<Loader />}
                        style={{ height: '100%', overflow: 'inherit' }}
                        pullDownToRefreshContent={<div>&#8595; Pull down to refresh</div>}
                        releaseToRefreshContent={<div>&#8593; Release to refresh</div>}
                    >
                        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                            {filteredItems.map(item => {
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
                                                    <Link to={`/products/${item.id}`} onClick={this.handleClick}>
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
                            })}
                        </div>
                    </InfiniteScroll>
                </div>
                <MyModal />
            </div>
        )
    }
}

export default ProductList