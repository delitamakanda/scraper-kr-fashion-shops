import React from 'react'
import { Popover } from '@headlessui/react'
import { Link } from 'react-router-dom'
import ScrollToTop from 'react-scroll-to-top'

const CustomLayout = (props) => {
    return (
        <div>
            <Popover className="relative bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <Link to="/">
                                <span className="sr-only">KF</span>
                                <img
                                className="h-8 w-auto sm:h-10"
                                src="/static/icon-48x48.png"
                                alt=""
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </Popover>
            {props.children}
            <ScrollToTop smooth />
        </div>
    )
}

export default CustomLayout