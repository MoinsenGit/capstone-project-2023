import {useEffect, useState} from "react";
import axios from "axios";


export default function useAuth() {
    const [user, setUser] = useState<{ username: String } | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const user = await axios.get("/api/users/me");
                setUser(user.data);
            } catch (event) {
                console.error("Please log in!", event);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    return {user, isReady};
}