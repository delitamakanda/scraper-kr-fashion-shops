import React from 'react'
import { HashRouter, Routes, Route } from "react-router-dom"
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import FavProductList from './pages/FavProductList'
import Hoc from './hoc/hoc'
import CustomLayout from './pages/Layout'

const App = (props) => {

  return (
    <HashRouter>
      <div className='app'>
        <Hoc>
          <CustomLayout {...props}>
            <Routes>  
              <Route exact path='/' element={<ProductList />} />
              <Route path='/products/:productID' element={ <ProductDetail />} />
              <Route path='/favorites-products' element={<FavProductList />} />
            </Routes>
          </CustomLayout>
        </Hoc>
      </div>
    </HashRouter>
  )
}

export default App
