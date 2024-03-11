import React, { useState, useEffect } from "react";
import Loader2 from './Loader2'

const SplashScreen = () => {
    const [isVisible, setVisible ] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        isVisible && (
            <div className="splash-screen" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                <div style={{ width: '100vw', height: '100vh'}}>
                <Loader2 />
                </div>
            </div>
        )
    )
};

export default SplashScreen;
