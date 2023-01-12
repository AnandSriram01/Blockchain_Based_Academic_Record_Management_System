/**
 *Submitted for verification at Etherscan.io on 2020-10-02
*/

pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

contract ownable {
    
    address public owner;
    mapping(address=>bool) isCollege;
    event OwnerChanged(address indexed _from,address indexed _to);
    event CollegeAdded(address indexed College_Address);
    event CollegeRemoved(address indexed College_Address);
    constructor() public{
        owner=msg.sender;
        isCollege[msg.sender]=true;
    }
    
    modifier onlyOwner(){
        require(owner == msg.sender,"Only Owner has permission to do that action");
        _;
    }
    modifier onlyCollege(){
        require(isCollege[msg.sender] == true,"Only College has permission to do that action");
        _;
    }
    
    function setOwner(address _owner) public onlyOwner returns(bool success){
        require(msg.sender!=_owner,"Already Your the owner");
        owner = _owner;
        emit OwnerChanged(msg.sender, _owner);
        return true;
    }
    function addCollege(address _address) public onlyOwner returns(bool success){
        require(!isCollege[_address],"College already exists!!!");
        isCollege[_address]=true;
        emit CollegeAdded(_address);
        return true;
    }
    function removeCollege(address _address) public onlyOwner returns(bool success){
        require(_address!=owner,"Can't revoke college access from owner (MHRD)");
        require(isCollege[_address],"Address does not belong to college!!!");
        isCollege[_address]=false;
        emit CollegeRemoved(_address);
        return true;
    }
}



contract Professor is ownable {
    uint256 public index;
    mapping(address=>bool) isProfessor;
    struct Professor {
        uint256 id;
        string hname;
        string haddress;
        string hcontact;
        address addr;
        bool isApproved;
    }
    mapping(address=>Professor) Professors;
    address[] public ProfessorList;
    
    modifier onlyProfessor(){
        require(isProfessor[msg.sender],"Only Professors can add Students");
        _;
    }
    
    function addProfessor(string memory _hname,string memory _haddress,string memory _hcontact,address _addr) public onlyCollege{
        require(!isProfessor[_addr],"Already a Professor");
        ProfessorList.push(_addr);
        index = index + 1;
        isProfessor[_addr]=true;
        Professors[_addr]=Professor(index,_hname,_haddress,_hcontact,_addr,true);
    }
    
    function getProfessorById(uint256 _id) public view returns(uint256 id,string memory hname,string memory haddress , string memory hcontact ,address addr , bool isApproved)  {
        uint256 i=0;
        for(;i<ProfessorList.length;i++){
        if(Professors[ProfessorList[i]].id==_id){
            break;
        }
    }    
        require(Professors[ProfessorList[i]].id==_id,"Professor ID doesn't exist");
        Professor memory tmp = Professors[ProfessorList[i]];
        return (tmp.id,tmp.hname,tmp.haddress,tmp.hcontact,tmp.addr,tmp.isApproved);
    }
    
    function getProfessorByAddress(address _address) public view returns(uint256 id,string memory hname,string memory haddress , string memory hcontact ,address addr , bool isApproved) {
        require(Professors[_address].isApproved,"Professor is not Approved or doesn't exist");
        Professor memory tmp = Professors[_address];
        return (tmp.id,tmp.hname,tmp.haddress,tmp.hcontact,tmp.addr,tmp.isApproved);
    }    
    
}

contract Student is Professor{
    
    uint256 public pindex=0;
    
    struct Records {
    string hname;
    string reason;
    string admittedOn;
    string dischargedOn;
    string ipfs;
    }
    
    struct Student{
        uint256 id;
        string name;
        string phone;
        string gender;
        string dob;
        string bloodgroup;
        string allergies;
        Records[] records;
        address addr;
    }

    address[] private StudentList;
    mapping(address=>mapping(address=>bool)) isAuth;
    mapping(address=>Student) Students;
    mapping(address=>bool) isStudent;

    
    function addRecord(address _addr,string memory _hname,string memory _reason,string memory _admittedOn,string memory _dischargedOn,string memory _ipfs) public{
        require(isStudent[_addr],"Student Not registered");
        require(isAuth[_addr][msg.sender],"No permission to add Students");
        Students[_addr].records.push(Records(_hname,_reason,_admittedOn,_dischargedOn,_ipfs));
        
    }
    
    function addStudent(string memory _name,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup,string memory _allergies) public {
        require(!isStudent[msg.sender],"Student account already exists");
        StudentList.push(msg.sender);
        pindex = pindex + 1;
        isStudent[msg.sender]=true;
        isAuth[msg.sender][msg.sender]=true;
        Students[msg.sender].id=pindex;
        Students[msg.sender].name=_name;
        Students[msg.sender].phone=_phone;
        Students[msg.sender].gender=_gender;
        Students[msg.sender].dob=_dob;
        Students[msg.sender].bloodgroup=_bloodgroup;
        Students[msg.sender].allergies=_allergies;
        Students[msg.sender].addr=msg.sender;
    }
    
    function getStudentDetails(address _addr) public view returns(string memory _name,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup,string memory _allergies){
        require(isAuth[_addr][msg.sender],"No permission to get Records");
        require(isStudent[_addr],"No Students found at the given address");
        Student memory tmp = Students[_addr];
        return (tmp.name,tmp.phone,tmp.gender,tmp.dob,tmp.bloodgroup,tmp.allergies);
    }
    
    function getStudentRecords(address _addr) public view returns(string[] memory _hname,string[] memory _reason,string[] memory _admittedOn,string[] memory _dischargedOn,string[] memory ipfs){
        require(isAuth[_addr][msg.sender],"No permission to get Records");
        require(isStudent[_addr],"student not signed in to our network");
        require(Students[_addr].records.length>0,"student record doesn't exist");
        string[] memory Hname = new string[](Students[_addr].records.length);
        string[] memory Reason = new string[](Students[_addr].records.length);
        string[] memory AdmOn = new string[](Students[_addr].records.length);
        string[] memory DisOn = new string[](Students[_addr].records.length);
        string[] memory IPFS = new string[](Students[_addr].records.length);
        for(uint256 i=0;i<Students[_addr].records.length;i++){
            Hname[i]=Students[_addr].records[i].hname;
            Reason[i]=Students[_addr].records[i].reason;
            AdmOn[i]=Students[_addr].records[i].admittedOn;
            DisOn[i]=Students[_addr].records[i].dischargedOn;
            IPFS[i]=Students[_addr].records[i].ipfs;
        }
        return(Hname,Reason,AdmOn,DisOn,IPFS);
    }
    
    function addAuth(address _addr) public returns(bool success) {
        require(!isAuth[msg.sender][_addr],"Already Authorised");
        require(msg.sender!=_addr,"Cant add yourself");
        isAuth[msg.sender][_addr] = true;
        return true;
    }

    function revokeAuth(address _addr) public returns(bool success) {
        require(msg.sender!=_addr,"Cant remove yourself");
        require(isAuth[msg.sender][_addr],"Already Not Authorised");
        isAuth[msg.sender][_addr] = false;
        return true;
    }
    
    function addAuthFromTo(address _from,address _to) public returns(bool success) {
        require(!isAuth[_from][_to],"Already  Auth!!!");
        require(_from!=_to,"can't add same person");
        require(isAuth[_from][msg.sender],"You don't have permission to access");
        require(isStudent[_from],"User Not Registered yet");
        isAuth[_from][_to] = true;
        return true;
    }
    
    function removeAuthFromTo(address _from,address _to) public returns(bool success) {
        require(isAuth[_from][_to],"Already No Auth!!!");
        require(_from!=_to,"can't remove same person");
        require(isAuth[_from][msg.sender],"You don't have permission to access");
        require(isStudent[_from],"User Not Registered yet");
        isAuth[_from][_to] = false;
        return true;
    }
    

}