import React from 'react'
import ReactDom from 'react-dom'
//import App from './App-fetch'
// Testing async calls when a component is unmounted
import News from "./News";

ReactDom.render(
    <News />, document.getElementById("root")
);