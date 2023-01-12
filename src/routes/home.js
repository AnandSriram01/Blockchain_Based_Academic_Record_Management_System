import React, { Component } from 'react'
import Header from "../components/Header";
import {Card,CardContent,CardMedia,Grid,Typography,Box} from "@material-ui/core/";
import LoginCards from "../components/LoginCards";

class Home extends Component {
    render(){
        return(
            <>
            <Header></Header>
            <Box p={-10}>
            <LoginCards/>
            </Box>
            </>
        );
    }
}
export default Home;