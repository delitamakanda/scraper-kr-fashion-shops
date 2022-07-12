import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Hoc from './hoc/hoc'
import CustomLayout from './pages/Layout'

const App = (props) => {

  return (
    <BrowserRouter>
      <div className='app'>
        <Hoc>
          <CustomLayout {...props}>
            <Routes>  
              <Route exact path='/' element={<ProductList />} />
              <Route path='/products/:productID' element={ <ProductDetail />} />
            </Routes>
          </CustomLayout>
        </Hoc>
      </div>
    </BrowserRouter>
  )
}

export default App
