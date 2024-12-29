import { userMailingURL} from "../../constants";
import Loader from '../core/ui/Loader/Loader';
import { useState, useEffect } from 'react'

const ModalNewsletter = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (!localStorage.getItem('subscription')) {
            openModal();
        }
    }, []);

    const openModal = () => {
        document.getElementById('my_modal_1').showModal();
    }

    const closeModal = () => {
        document.getElementById('my_modal_1').close();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch(userMailingURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': email})
        })
        if (!response.ok) {
            const errorsJson = await response.json();
            const errors = Object.keys(errorsJson).map(item => errorsJson[item]);
            setErrors(errors);
            setLoading(false);
            return;
        } else {
            localStorage.setItem('subscription', JSON.stringify({ timestamp: Date.now() }));
            closeModal();
            setErrors([]);
            setEmail('');
            setLoading(false);
        }

    }

    return (
        <>
            <dialog id="my_modal_1" className="modal ">
                <div className="modal-box  w-full items-center justify-center max-w-md transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Stay in touch !</h3>
                    <p className="py-4 text-sm text-gray-500">Receive new fashion trends in your mailbox. You can unsubscribe at any moment. Press ESC key or click the button below to close</p>
                    <div className="modal-action">
                        <form method="dialog" onSubmit={(e) => handleSubmit(e)}>
                            <input
                                className="shadow appearance-none border rounded w-full my-4 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" name="username" value={email}
                                onChange={e => setEmail(e.target.value)} placeholder="Enter an email"></input>
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-500 text-xs py-1">{error}</p>
                            ))}
                            {/* if there is a button in form, it will close the modal */}
                            <button type="button" onClick={closeModal} className="btn inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Close</button>
                            {loading ? <Loader /> : <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 ml-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            >
                                Subscribe
                            </button>}
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default ModalNewsletter;
