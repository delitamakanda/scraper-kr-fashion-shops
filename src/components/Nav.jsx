import React, { Fragment } from 'react'
import { Tab } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { PhotographIcon, HeartIcon } from '@heroicons/react/outline'

const Nav = (props) => {
    const { selected } = props
    return (
        <div className='sticky top-0 z-10 bg-white'>
            <div className='flex justify-center'>
                <Link to="/">
                    <button className={selected === 'home' ? 'bg-pink-500 text-white p-2 rounded' : 'bg-white text-black p-2 rounded'}>
                        <PhotographIcon className="h-5 w-5 currentColor" />
                    </button>
                </Link>
                <Link to="/favorites-products">
                    <button className={selected === 'fav' ? 'bg-pink-500 text-white p-2 rounded' : 'bg-white text-black p-2 rounded'
    }>
                        <HeartIcon className="h-5 w-5 currentColor" />
                    </button>
                </Link>
            </div>              
        </div>
    );
};

export default Nav