import React from 'react';
import {BrowserRouter,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Root from "./Root";

function App() {
    return (
        <BrowserRouter>
            <Root/>
        </BrowserRouter>
    );
}
export default App;
