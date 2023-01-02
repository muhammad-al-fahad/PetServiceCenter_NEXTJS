import React, { Children } from 'react'
import Navbar from './navbar'
import Notify from './notify'
import CartModal from './modal'

function Layout({children}) {
  return (
    <div>
        <Navbar/>
        <Notify/>
        <CartModal/>
        {children}
    </div>
  )
}

export default Layout