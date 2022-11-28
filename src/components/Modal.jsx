import { Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import { userMailingURL } from '../constants'
import Loader from '../components/Loader'


const MyModal = () => {
    let [isOpen, setIsOpen] = useState(true)
    let [modalAlreadyDisplay, setModalAlreadyDisplay] = useState(false)
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState('')
    let [email, setEmail] = useState('')
    
    useEffect(() => {
        const body = document.querySelector('body')
        if (isOpen && !modalAlreadyDisplay) {
            body.style.overflow = 'hidden'
        } else {
            body.style.overflow = ''
        }
        // afficher la modal 1 fois / session
        const data = localStorage.getItem('subscription')
        if (data) {
            setModalAlreadyDisplay(true)
        } else {
            setModalAlreadyDisplay(false)
        }
        // console.log('modalAlreadyDisplay', modalAlreadyDisplay)
    }, [isOpen, modalAlreadyDisplay])
    
  function closeModal() {
    localStorage.setItem('subscription', 'true')
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

   const subscribeUser = (e) => {
    e.preventDefault()
    setLoading(true)
    
    const data = {'email': email}
    axios
        .post(userMailingURL, data)
        .then(() => {
            closeModal()
        })
        .catch(error => {
            const data = error && error.response && error.response.data
            if(data && data.email) {
                setError(data.email[0])
            }
        })

    setTimeout(() => {
        setLoading(false)
        setError('')
    }, 1500)
  }

  return (
    <>
      {!modalAlreadyDisplay ? <div className={`fixed inset-0 flex items-center justify-center ${!isOpen ? 'hidden' : '' }`}>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hidden"
        >
          Open dialog
        </button>
      </div> : <div></div>}

      {!modalAlreadyDisplay ? <Transition appear show={isOpen} as={Fragment}>
        <div>
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-hidden">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                    Stay in touch
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Receive new fashion trends in your mailbox. You can unsubscribe at any moment.
                    </p>
                  </div>

                    <form onSubmit={subscribeUser}>
                          
                        <div className="mt-2">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" name="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter an email"></input>

                        </div>
                        {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
                        <div className="mt-4">
                            <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                            >
                            No thanks !
                            </button>
                            {loading ? <Loader /> : <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 ml-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            >
                            Subscribe
                            </button>}
                        </div>
                      </form>

                </div>
                </Transition.Child>
            </div>
          </div>
        </div>
      </Transition> : null}
    </>
  )
}


export default MyModal