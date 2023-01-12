import React from "react";
import {Paper,Grid,Typography,Button,Box} from "@material-ui/core/";
import {Link} from 'react-router-dom';

function LoginCards() {  
    return (
    <>
    <Box m={1}>
        <Grid container spacing={1} justify="center" >
            <Grid item>
            <Paper>
                <Box p={1}>
                <Typography variant="h5">
                    College Login
                </Typography>

                </Box>
            </Paper>
            <Grid container justify="space-evenly">
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/college">Login</Button>
                    </Box>
                </Grid>
            </Grid>
            </Grid>

            <Grid item >
            <Paper>
                <Box p={1}>
                <Typography variant="h5">
                    Professor Login
                </Typography>
                </Box>
            </Paper>
            <Grid container justify="space-evenly">
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/professor">Login</Button>
                    </Box>
                </Grid>
            </Grid>
            </Grid>

            <Grid item >
            <Paper>
                <Box p={1}>
                <Typography variant="h5">
                    Student Login
                </Typography>
                </Box>
            </Paper>
            <Grid container justify="center" spacing={2}>
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/signup">Sign Up</Button>
                    </Box>
                </Grid>
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/student">Login</Button>
                    </Box>
                </Grid>
            </Grid>
            </Grid>
        </Grid>
    </Box>
    </>
    );}
export default LoginCards;