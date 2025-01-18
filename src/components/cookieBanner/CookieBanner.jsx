import { useEffect, useState } from 'react'
import CookiePolicy from '../../assets/cookies_policy.html?raw'

const CookieBanner = () => {
    const [isCookieBannerVisible, setIsCookieBannerVisible] = useState(false);
    const [isCookiePolicyVisible, setIsCookiePolicyVisible] = useState(false);
    const scrollContainer = {
        height: '500px',
        overflowY: 'auto',
        padding: '10px',

    }

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
    const openCookiePolicy = () => {
        setIsCookiePolicyVisible(isCookiePolicyVisible =>!isCookiePolicyVisible);
    }
    return (
        isCookieBannerVisible ? <div id="cookie"
                                     className="cookie-banner js-cookie-banner fixed top right-0 p-10 block">
            <div className="w-full lg:max-w-3xl p-10 bg-primary rounded-xl">
                <p className="mb-4 text-2xl font-semibold text-white">
                    Cookie Policy
                </p>
                <div className="flex flex-wrap items-center -mx-4">
                    <p className="mb-4 text-sm text-white leading-loose">
                        This site use 🍪 cookies. Read more in <span className="cursor-pointer" onClick={openCookiePolicy}>Cookies Policy</span>.
                    </p>
                    {isCookiePolicyVisible ? <div style={scrollContainer}><p className="mb-4 text-sm text-white leading-loose" dangerouslySetInnerHTML={{ __html: CookiePolicy }} /> </div>: null }

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
