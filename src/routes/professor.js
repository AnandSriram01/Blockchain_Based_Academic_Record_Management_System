import React, { Component } from 'react'
import ipfs from "../components/ipfs";
import {Table,TableHead,TableContainer,TableBody,TableCell,TableRow,Chip,Card,Grid,Box,Paper, Typography,TextField, Button,CircularProgress} from '@material-ui/core';
import Header from "../components/Header";
import InitialiseWeb3 from '../components/web3';
var CryptoJS = require("crypto-js");
function encode(myString){
    const encodedWord = CryptoJS.enc.Utf8.parse(myString); // encodedWord Array object
    const encoded = CryptoJS.enc.Base64.stringify(encodedWord); // string: 'NzUzMjI1NDE='
    return encoded;
}
  function decode(encoded){
    const encodedWord = CryptoJS.enc.Base64.parse(encoded); // encodedWord via Base64.parse()
    const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify() '75322541'
    return decoded;
}

class Professor extends Component {
    DMR=null;account="";
    state={
        name:"",
        phone:"",
        gender:"male",
        dob:"",
        bg:"",
        allergy:"",
        owner: "loading",
        account:"loading",
        pview:false,
        rview:false,
        orecord:false,
        viewH:true,
        load:false,
        buffer:null,
        rlen:0,
        records:[],
        hname:"",
        reason:"",
        admOn:"",
        disOn:"",
        ipfs:"",
        addr:"",
    }

    async componentWillMount() {
        let [dmr,accounts]=await InitialiseWeb3();
        this.DMR=dmr;
        this.account=accounts[0];
        let own = await this.DMR.methods.owner().call();
        await this.setState({owner:own,account:this.account,load:false});
        await this.getProfessor();
        console.log("owner\t"+this.state.owner);
        console.log("Account\t"+this.state.account);
      }

      getProfessor = async ()=>{
        
        await this.setState({viewH:false,addview:false,load:true});
        try{
            await this.DMR.methods.getProfessorByAddress(this.state.account).call({from:this.state.account}).then((res)=>{
                let result = res;
                console.log(result);
                this.setState({load:false,addview:false,viewH:true,addr:result["addr"],hname:result["hname"],haddress:result["haddress"],hcontact:result["hcontact"]});
            });
        }
        catch(e){
            await this.setState({load:false});
            alert("error");
        }
    }
    onhnameChange = (event)=>{
        this.setState({hname:event.target.value},()=>console.log(this.state.hname));
    }
    onreasonChange = (event)=>{
        this.setState({reason:event.target.value},()=>console.log(this.state.reason));
    }
    onadmOnChange = (event)=>{
        this.setState({admOn:event.target.value.toString()},()=>console.log(this.state.admOn));
    }
    ondisOnChange = (event)=>{
        this.setState({disOn:event.target.value.toString()},()=>console.log(this.state.disOn));
    }
    onaddrChange = (event)=>{
        this.setState({addr:event.target.value},()=>console.log(this.state.addr));
    }

    ViewProfessor=()=>{
        if(this.state.viewH){
        return(
            <Box>
                <Grid container justify="center">
                    <Grid item>
                        <Paper>           
                            <Box p={5}>  
                            <Box mt={-2} mb={2}>
                            <Typography align="center">Professor Information</Typography>
                            </Box>            
                            Name:{"\t"+ this.state.hname}<br></br><br></br>
                            College Name:{"\t"+ this.state.haddress}<br></br><br></br>
                            Contact:{"\t"+ this.state.hcontact}<br></br><br></br>
                            Wallet Address:{"\t"+ this.state.addr}<br></br>
                            </Box>  
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );}
        return null;
    }
    isLoading=()=>{
        if(this.state.load){
            return(
            <Box m={2}>
                <Grid container justify="center">
                    <Grid item>
                        <CircularProgress/>
                    </Grid>
                </Grid>
                
            </Box>
            );
        }
        return null;
    }
    captureFile =(event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader);    
      };
      convertToBuffer = async(reader) => {
          const buffer = await Buffer.from(reader.result);
          this.setState({buffer});
      };
    onOtherRecordSubmit= async()=>{
        try{
        await this.setState({load:true,orecord:false});
        let res= await ipfs.add(this.state.buffer);
        console.log(res[0].hash);
        let url="https://ipfs.io/ipfs/"+res[0].hash;
        var ciphertext = encode(CryptoJS.AES.encrypt(JSON.stringify(url), 'dmr').toString());
        var decryptedtext = CryptoJS.AES.decrypt(decode(ciphertext).toString(), 'dmr').toString(CryptoJS.enc.Utf8);
        console.log("encrypted:"+ciphertext);
        console.log("decrypted:"+decryptedtext);
        await this.setState({ipfs:url.toString()});
        let result = await this.DMR.methods.addRecord(this.state.addr,this.state.hname,this.state.reason,this.state.admOn,this.state.disOn,ciphertext).send({from:this.state.account});
        console.log(result);
        await this.setState({load:false,orecord:true});
        }
        
        catch(e){
            console.log(e);
            await this.setState({load:false,orecord:true});
            alert("Error Uploading Report");           
        }
    }

    addOtherRecord=()=>{

        if(this.state.orecord){
        return(
            <Grid container justify="center">
                <Grid item>
                <Paper>
                    <Box m={2} p={5}  alignItems="center" >
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Typography>Add Records</Typography>
                        </Box>
                        <Box >
                            <TextField label="Student Address" onChange={this.onaddrChange}></TextField>
                        </Box>
                        <Box >
                            <TextField label="Professor Name" onChange={this.onhnameChange}></TextField>
                        </Box>
                        <Box >
                            <TextField label="Comments" onChange={this.onreasonChange}></TextField>
                        </Box>
                        <Box >
                            <TextField type="date" label="Date Of Issue" onChange={this.onadmOnChange} InputLabelProps={{ shrink: true }}></TextField>
                        </Box>
                        <Box >
                            <TextField type="date" label="Date of Upload" onChange={this.ondisOnChange} InputLabelProps={{ shrink: true }}></TextField>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" mt={2} mb={2}>
                            <TextField type="file" inputProps={{accept:"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}} label="Document" InputLabelProps={{ shrink: true }} onChange={this.captureFile}></TextField>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                            <Button onClick={this.onOtherRecordSubmit} variant="contained" style={{backgroundColor:"green",color:"floralwhite"}}>Submit</Button>
                        </Box>
                    </Box>
                </Paper>
                </Grid>
            </Grid>
        );
        }
        return null;
    }
    getOtherStudentInfo = async ()=>{
        try{
            let res=await this.DMR.methods.getStudentDetails(this.state.addr).call({from:this.state.account});
            console.log(res);
            await this.setState({name:res["_name"],phone:res["_phone"],gender:res["_gender"],dob:res["_dob"],bg:res["_bloodgroup"],allergy:res["_allergies"],load:false,arecord:false,gview:false,orecord:false,rkview:false,pview:true});
            console.log("Other Student Info Set!!!");
          }
          catch(e){
              await this.setState({load:false});
              alert("error or no permission");
              console.log(e);
          }
    }
    getOtherStudentRecords=async ()=>{
        try{
            await this.setState({rkview:false,gview:false,pview:false,arecord:false,load:true});
            let res=await this.DMR.methods.getStudentRecords(this.state.addr).call({from:this.state.account});
            await this.setState({rlen:res["_hname"].length});
            console.log(this.state.rlen);
            let recs=[]
            for(let i=1;i<=this.state.rlen;i++){
                recs.push({
                    "hname":res["_hname"][i-1],
                    "reason":res["_reason"][i-1],
                    "admOn":res["_admittedOn"][i-1],
                    "disOn":res["_dischargedOn"][i-1],
                    "ipfs":res["ipfs"][i-1]
                });
            }
            await this.setState({records:recs,load:false,rview:true});
            console.log(this.state.records);
            console.log("Student Records Set!!!");
          }
          catch(e){
              await this.setState({load:false});
              alert("Error or No Records Found");
              console.log(e);
          }
    }
    viewStudentInfo=()=>{
        if(this.state.pview){
        return(
            <Box flex="display" alignContent="center" justifyItems="center" m={3}>
                <Grid container justify="center">
                    <Grid item>
                        <Paper>
                        <Box p={7}>
                        <Box mt={-3} mb={3}>
                            <Typography variant={"h5"} align="center">Student Info</Typography>       
                        </Box>
                        <Box m={1}>
                            Name:{"\t\t"+this.state.name}
                        </Box>
                        <Box m={1}>
                            Phone:{"\t\t"+this.state.phone}
                        </Box>
                        <Box m={1}>
                            Dob:{"\t\t"+this.state.dob}
                        </Box>
                        <Box m={1}>
                            Gender:{"\t\t"+this.state.gender}
                        </Box>
                        <Box m={1}>
                            College Name:{"\t\t"+this.state.bg}
                        </Box>
                        <Box m={1}>
                             Department Name:{"\t\t"+this.state.allergy}
                        </Box>
                        </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );}
        return null;
    }
    viewStudentInfo=()=>{
        if(this.state.pview){
        return(
            <Box flex="display" alignContent="center" justifyItems="center" m={3}>
                <Grid container justify="center">
                    <Grid item>
                        <Paper>
                        <Box p={7}>
                        <Box mt={-3} mb={3}>
                            <Typography variant={"h5"} align="center">Student Info</Typography>       
                        </Box>
                        <Box m={1}>
                            Name:{"\t\t"+this.state.name}
                        </Box>
                        <Box m={1}>
                            Phone:{"\t\t"+this.state.phone}
                        </Box>
                        <Box m={1}>
                            Dob:{"\t\t"+this.state.dob}
                        </Box>
                        <Box m={1}>
                            Gender:{"\t\t"+this.state.gender}
                        </Box>
                        <Box m={1}>
                            College Name:{"\t\t"+this.state.bg}
                        </Box>
                        <Box m={1}>
                            Department Name:{"\t\t"+this.state.allergy}
                        </Box>
                        </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );}
        return null;
    }
    viewStudentRecords=()=>{
        var rows=this.state.records;
        if(this.state.rview){
        return (
            <Box mt={3} mb={3}>
            <TableContainer component={Paper}>   
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                        Professor Name
                        </TableCell>
                        <TableCell>
                            Comments
                        </TableCell>
                        <TableCell>
                            Date of Issue
                        </TableCell>
                        <TableCell>
                            Date of Upload
                        </TableCell>
                        <TableCell>
                            Document
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(
                        (row,index)=>{
                            return(<TableRow key={index}>
                                <TableCell>{row["hname"]}</TableCell>
                                <TableCell>{row["reason"]}</TableCell>
                                <TableCell>{row["admOn"]}</TableCell>
                                <TableCell>{row["disOn"]}</TableCell>
                                <TableCell><a href={"/#/embed/"+row["ipfs"]} target="_blank">View/Download Record</a></TableCell>
                            </TableRow>)
                        }
                    )}

                    
                </TableBody>
            </Table>
            </TableContainer> 
            </Box>
        );}
        return null;
    }
    Oview=()=>{
        if(this.state.oview){
            return(
            <Box flex="display" alignContent="center" justifyItems="center" m={3}>
                <Grid container justify="center">
                    <Grid item>
                        <Paper>
                        <Box p={1}>
                        <Box mt={-1} mb={1}>
                            <Typography  align="center">Other Student Info</Typography>       
                        </Box>
                        <Grid container justify="center" spacing={2}>
                            <Grid item>
                                <Typography>Address:{"\t"}</Typography>
                            </Grid>
                            <Grid item>
                                <TextField size={"small"} onChange={this.onaddrChange}></TextField>
                            </Grid>
                            <Grid item>
                                <Button onClick={async ()=>{
                                    await this.getOtherStudentInfo();
                                    await this.getOtherStudentRecords();
                                    await this.setState({pview:true,rview:true});
                                }} variant={"contained"} color={"primary"}>Submit</Button>
                            </Grid>
                        </Grid>
                        </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
        }
        return null;
    }
    render(){
        return(
            <>
            <Header></Header>
            <Box m={1}>
                <Box m={1}><Card>Contract Owner:{"\t"+this.state.owner}</Card></Box>
                <Box m={1}><Card>Current Account:{"\t"+this.state.account}</Card></Box>
                <Box m={3}>
                    <Grid container justify="center" spacing={3}>
                    <Grid item >
                            <Chip style={{backgroundColor:"fuchsia"}} label="Professor Information" onClick={async ()=>{
                                await this.setState({pview:false,rview:false,oview:false,load:false,arecord:false,orecord:false,viewH:true});
                            }}></Chip>
                        </Grid>
                    <Grid item >
                            <Chip style={{backgroundColor:"mediumpurple"}} label="Add Student Record" onClick={async ()=>{
                                await this.setState({pview:false,rview:false,oview:false,load:false,arecord:false,orecord:true,viewH:false});
                            }}></Chip>
                        </Grid>
                        <Grid item >
                            <Chip style={{backgroundColor:"chocolate"}} label="View Student Record" onClick={async ()=>{
                                await this.setState({pview:false,rview:false,oview:true,load:false,arecord:false,orecord:false,viewH:false});
                            }}></Chip>
                        </Grid>
                    </Grid>
                </Box>
            <this.isLoading></this.isLoading>
            <this.Oview></this.Oview>
            <this.ViewProfessor></this.ViewProfessor>
            <this.addOtherRecord></this.addOtherRecord>
            <this.viewStudentInfo></this.viewStudentInfo>
            <this.viewStudentRecords></this.viewStudentRecords>
            </Box>
            </>
        );
    }
}
export default Professor;