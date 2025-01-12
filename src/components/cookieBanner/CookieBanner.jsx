import { useEffect, useState } from 'react'

const CookieBanner = () => {
    const [isCookieBannerVisible, setIsCookieBannerVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("cookieBannerDisplayed")) {
            setIsCookieBannerVisible(true);
        }
    }, [])

    const handleCookieDismiss = () => {
        setIsCookieBannerVisible(false);
        localStorage.setItem("cookieBannerDisplayed", "true");
    }

    const handleCookieDecline = () => {
        setIsCookieBannerVisible(false);
    }
    return (
        isCookieBannerVisible ? <div id="cookie"
                                     className="cookie-banner js-cookie-banner fixed top right-0 p-10 block">
            <div className="w-full lg:max-w-3xl p-10 bg-primary rounded-xl">
                <p className="mb-4 text-2xl font-semibold text-white">
                    Cookie Policy
                </p>
                <div className="flex flex-wrap items-center -mx-4">
                    <p className="mb-4 text-sm text-white opacity-40 leading-loose">
                        This site use 🍪 cookies. Read more in <a href="/cookies-policy" target="_blank">Cookies Policy</a>.
                    </p>
                    <button onClick={handleCookieDismiss}
                            className="cookie-button btn inline-block btn-outline px-8 py-4 mr-2 text-sm bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded">Ok!
                    </button>
                    <button onClick={handleCookieDecline}
                            className="cookie-decline-button btn inline-block btn-outline px-8 py-4 text-sm bg-transparent text-white font-semibold border border-blue-800 hover:border-blue-700 rounded">Decline
                    </button>
                </div>
            </div>
        </div> : null
    )
}

export default CookieBanner;
