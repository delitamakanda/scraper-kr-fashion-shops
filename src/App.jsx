import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from "react-router-dom"
import ProductList from './pages/ProductList'
import FavProductList from './pages/FavProductList'
import Hoc from './hoc/hoc'
import CustomLayout from './pages/Layout'
import SplashScreen from './components/SplashScreen';

const App = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  }, [])

  return (
    <HashRouter>
      <div className='app'>
        {isLoading && <SplashScreen />}
        {!isLoading && (
          <Hoc>
          <CustomLayout {...props}>
            <Routes>  
              <Route exact path='/' element={<ProductList />} />
              <Route path='/favorites-products' element={<FavProductList />} />
            </Routes>
          </CustomLayout>
          </Hoc>
        )}
      </div>
    </HashRouter>
  )
}

export default App
