import React, { Component } from 'react'
import { Popover } from '@headlessui/react'
import { Link } from 'react-router-dom'

class CustomLayout extends Component {
    render() {
        return (
            <div>
                <Popover className="relative bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                            <div className="flex justify-start lg:w-0 lg:flex-1">
                                <Link to="/">
                                    <span className="sr-only">Korean fashion</span>
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
                {this.props.children}
            </div>
        )
    }
}

export default CustomLayout