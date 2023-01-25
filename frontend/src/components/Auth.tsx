import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Auth (
    {
        children,
        shouldRedirect = true,
    }: {
        children: React.ReactNode
        shouldRedirect?: boolean,
    }
) {
    const location = useLocation();

    const {user, isReady} = useAuth();

    return !isReady ? null : (
        <div>
            {!user ? (
                (shouldRedirect && <Navigate
                    to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                />)
            ) : children}
        </div>
    )
}
