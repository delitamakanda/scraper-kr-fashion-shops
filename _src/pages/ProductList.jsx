import React, { Component } from 'react'
import axios from 'axios'
import { productListURL, searchProductsURL } from '../../frontend/src/constants'
import Loader from '../components/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import MyModal from '../components/Modal'
import Select from '../components/Select'
import Nav from '../components/Nav'
import ListItem from '../components/ListItem'

class ProductList extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: null,
            data: [],
            next_url: productListURL,
            count: null,
            more_exist: false,
        }
    }

    componentDidMount() {
        const init = true
        this.fetchProducts(init, productListURL)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchProducts = (init = false, nextUrl) => {
        this._isMounted = init
        if (nextUrl === undefined) {
            nextUrl = this.state.next_url
        }

        this.setState({
            loading: true,
        })

        axios
            .get(nextUrl)
            .then(res => {
                let has_more = false
                if (res.data.next) {
                    has_more = true
                }
                this.setState({
                    next_url: res.data.next,
                    data: init ? res.data.results : this.state.data.concat(res.data.results),
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
    
    handleChildToParent = (word) => {
        switch (word.name) {
            case 'All':
                this.fetchProducts(true, productListURL)
                break;
        
            default:
                this.fetchProducts(true, searchProductsURL(word.name))
                break;
        }
    }

    onChangeItem = (item) => {
        const currentIndexItem = this.state.data.findIndex(i => i.id === item.id)
        const updateData = { ...this.state.data[currentIndexItem], is_liked: item.is_liked }
        const newData = [...this.state.data.slice(0, currentIndexItem), updateData,...this.state.data.slice(currentIndex + 1)]
        this.setState({ data: newData })
    }

    render() {
        const { data, error, more_exist, count } = this.state

        return (
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-6 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <Nav selected={'home'} />
                   
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
                        <ListItem data={data} onItemChange={this.onChangeItem} />
                    </InfiniteScroll>
                </div>
                <MyModal />
            </div>
        )
    }
}

export default ProductList