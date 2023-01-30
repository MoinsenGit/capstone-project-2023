import {Route, Routes, useSearchParams} from "react-router-dom";
import Auth from "./components/Auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ItemPage from "./pages/ItemPage";
import {useMemo} from "react";
import NoAuth from "./components/NoAuth";
import Container from '@mui/material/Container';
import NotFoundPage from "./pages/NotFoundPage";

export default function Root() {
    const [searchParams] = useSearchParams();
    const redirect = useMemo(
        () => searchParams.get("redirect") || "/",
        [searchParams]);

    return (
        <div>
            <Container maxWidth="sm">

                <Routes>
                    <Route path="/signup" element={
                        <NoAuth redirect={redirect}>
                            <SignUpPage/>
                        </NoAuth>
                    }/>
                    <Route path="/login" element={
                        <NoAuth redirect={redirect}>
                            <LoginPage/>
                        </NoAuth>
                    }/>
                    <Route path="/" element={
                        <Auth>
                            <HomePage/>
                        </Auth>
                    }/>
                    <Route path="/itemDetails" element={
                        <Auth>
                            <ItemPage/>
                        </Auth>
                    }/>
                    <Route path={"*"} element={
                        <NotFoundPage/>
                    }/>


                </Routes>
            </Container>
        </div>

    )

}