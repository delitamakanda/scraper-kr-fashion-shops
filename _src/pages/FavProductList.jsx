import { useState, useEffect } from 'react'
import axios from 'axios'
import { favProductsURL } from '../../frontend/src/constants'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import ListItem from '../components/ListItem'
import InfiniteScroll from 'react-infinite-scroll-component'

const FavProductList = () => {
    const favs = JSON.parse(localStorage.getItem('favs')) || {}
    let favsArray = Object.keys(favs)
    if (!localStorage.getItem('favs')) {
        favsArray = [0]
    }
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [more_exist, setMoreExist] = useState(false);
    const [next_url, setNextUrl] = useState(favProductsURL(favsArray.join(',')));
    const [noProducts, setNoProducts] = useState(false);

    useEffect(() => {
        if (favsArray.length === 0) {
            setNoProducts(true)
        }
    }, [noProducts])

    const fetchFavProducts = (init = false) => {
        
        axios.get(next_url)
            .then((res) => {
                let has_more = false
                if (res.data.next) {
                    has_more = true
                    setNextUrl(res.data.next)
                }
                setMoreExist(has_more)
                setProducts(init ? res.data.results : [...products,...res.data.results])
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
        fetchFavProducts(true)
    }, []);

    function onChangeItem(item) {
        const currentIndexItem = products.findIndex(i => i.id === item.id)
        const updateData = { ...products[currentIndexItem], is_liked: item.is_liked }
        const newData = [...products.slice(0, currentIndexItem), updateData,...products.slice(currentIndex + 1)]
        setProducts([...newData])
    }


    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-6 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <Nav selected={'fav'} />
                {loading && <Loader />}
                {error && (
                    <div className="mt-4 text-red-500 text-lg">
                        {JSON.stringify(error)}
                    </div>
                )}
                { noProducts ? <div className='flex justify-center align-center h-full py-6'>No favorites here</div>: (
                    <InfiniteScroll
                    dataLength={products.length}
                    next={fetchFavProducts}
                    hasMore={more_exist}
                    loader={<Loader />}
                    style={{ height: '100%', overflow: 'inherit' }}
                    pullDownToRefreshContent={<div>&#8595; Pull down to refresh</div>}
                    releaseToRefreshContent={<div>&#8593; Release to refresh</div>}
                >
                    <ListItem data={products} onItemChange={onChangeItem}/>
                </InfiniteScroll>
                )}
                
            </div>
        </div>
    );
};

export default FavProductList;
