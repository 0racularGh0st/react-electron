import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col, Navbar, NavbarBrand, Modal, ModalHeader, ModalFooter } from 'reactstrap';
import classnames from 'classnames';
//Icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PersonAdd from '@material-ui/icons/PersonAdd';
import SearchPerson from '@material-ui/icons/Search';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//Subcomponents
import SearchComponent from './sub-components/SearchComponent';
import SearchResults from './sub-components/SearchResults';
import PatientDetails from './sub-components/PatientDetails';
const db = require('./utils/databaseUtils');
const sex = [
    {
        value: '',
        label: ''
    },
    {
        value: 'Male',
        label: 'Male',
    },
    {
        value: 'Female',
        label: 'Female',
    }
];
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            modal: false,
            //For Buttons
            confirmActive: true,
            editActive: false,
            saveActive: false,
            //For SnackBar
            SnackBarOpen:false,
            //For form inputs
            firstname:'',
            lastname:'',
            age:'',
            sex:'',
            complaints:'',
            medication:'',
            amount:'',
            // Search Object
            searchData:null,
            patientHistory:null,
            patientHistoryDetails:null
        };
        this.toggleModal = this.toggleModal.bind(this);
        //Add New Patient Tab Functions
        this.confirmClicked = this.confirmClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        //Database Operations
        this.dbSearch = this.dbSearch.bind(this);
        this.dbAddNewPatient = this.dbAddNewPatient.bind(this);
        this.vdbGetPatientHistory= this.vdbGetPatientHistory.bind(this);
        //Snack Bar Toggle 
        this.toggleSnackBarOpen = this.toggleSnackBarOpen.bind(this);
        this.toggleSnackBarClose = this.toggleSnackBarClose.bind(this);
        //For handling text changes in textfields
        this.handleFirstnameChange=this.handleFirstnameChange.bind(this);
        this.handleLastnameChange=this.handleLastnameChange.bind(this);
        this.handleAgeChange=this.handleAgeChange.bind(this);
        this.handleSexChange=this.handleSexChange.bind(this);
        this.handleComplaintsChange=this.handleComplaintsChange.bind(this);
        this.handleMedicationChange=this.handleMedicationChange.bind(this);
        this.handleAmountChange=this.handleAmountChange.bind(this);
    }
    //Add New Patient Tab Buttons
    confirmClicked() {
        this.setState({
            confirmActive: false,
            editActive: true,
            saveActive: true
        });
    }
    editClicked() {
        this.setState({
            confirmActive: true,
            editActive: false,
            saveActive: false
        });
    }
    //TOGGLES
    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    toggleSnackBarClose(){
        this.setState({
            snackBarActive: false
        });
    }
    toggleSnackBarOpen(){
        this.setState({
            snackBarActive: true
        });
    }
    //OPERATIONS
    dbSearch(name) {
        console.log("Clicked in searchComponent with parameter as ", name);
       new Promise((resolve,reject)=>{
          db.getPersons(name,function(data){
               resolve(data);
          })
       })
       .then(data=>{this.setState({searchData:data});console.log(data)});     
    }
    vdbGetPatientHistory(reg_no,otherDetails){
        console.log("Clicked in PatientDetails with parameter as ", reg_no);
        new Promise((resolve,reject)=>{
           db.getVisits(reg_no,function(data){
                resolve(data);
           })
        })
        .then(data=>{this.setState({patientHistory:data});this.setState({patientHistoryDetails:otherDetails});console.log(data,"other---][][[]>.",otherDetails)});  
    }
    vdbAddVist(reg,complaints,meds,amount){
        new Promise((resolve,reject)=>{
            db.addVisit(reg,complaints,meds,amount,function(){
                resolve();
            })
        })
        .then(console.log("Data ready for re rendering"));
    }
    dbAddNewPatient() {
        let firstname = document.getElementById("id_firstname");
        let lastname = document.getElementById("id_lastname");
        let age = document.getElementById("id_age");
        let sex = document.getElementById("id_sex");
        let complaints = document.getElementById("id_complaints");
        let medication = document.getElementById("id_medication");
        let amount = document.getElementById("id_amount");
        if(firstname.value!=='' || firstname.value!==undefined || firstname.value!==null)
        {db.addPatient(firstname.value, lastname.value, age.value, sex.value, complaints.value, medication.value, amount.value);

        this.setState({
            firstname:'',
            lastname:'',
            age:'',
            sex:'',
            complaints:'',
            medication:'',
            amount:''
        });

        this.toggleSnackBarOpen();
        //Reset Form buttons
        this.editClicked();
        }
    }
    //Form value change handlers
    handleFirstnameChange(e) {
        this.setState({
            firstname: e.target.value
        });
    }
    handleLastnameChange(e){
        this.setState({
            lastname: e.target.value
        });
    }
    handleAgeChange(e){
        this.setState({
            age: e.target.value
        });
    }
    handleSexChange(e){
        this.setState({
            sex: e.target.value
        });
    }
    handleComplaintsChange(e){
        this.setState({
            complaints: e.target.value
        });
    }
    handleMedicationChange(e){
        this.setState({
            medication: e.target.value
        });
    }
    handleAmountChange(e){
        this.setState({
            amount: e.target.value
        });
    }
    render() {
        let confirmActive = !this.state.confirmActive;
        let editActive = !this.state.editActive;
        let saveActive = !this.state.saveActive;
        let snackBarActive = this.state.snackBarActive;
        return (
            <div className="app-component">
                <Navbar>
                    <NavbarBrand className="electro-reacto-navbarbrand"> <div className="clinic-icon" /><div className="electro-reacto-navbarbrand-text">Dr. A. Tariang's Patient Records</div></NavbarBrand>
                </Navbar>
                <Nav tabs>
                    <NavItem className="electro-reacto-nav-item">
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            <PersonAdd className="electro-reacto-tab-icons" />
                            <div className="electro-reacto-text-color">Add Patient</div>
                        </NavLink>
                    </NavItem>
                    <NavItem className="electro-reacto-nav-item">
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            <SearchPerson className="electro-reacto-tab-icons" />
                            <div className="electro-reacto-text-color">View Patient</div>
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="10" className="electro-reacto-add-patient-wrapper">
                                <TextField value={this.state.firstname} onChange={this.handleFirstnameChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields" id="id_firstname" label="First Name" margin="normal" type="text" variant="outlined" />
                                <TextField value={this.state.lastname} onChange={this.handleLastnameChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields" id="id_lastname" label="Last Name" margin="normal" type="text" variant="outlined" />
                                <TextField value={this.state.age} onChange={this.handleAgeChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields" id="id_age" label="Age" margin="normal" type="number" variant="outlined" />
                                <TextField value={this.state.sex} onChange={this.handleSexChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields"
                                    id="id_sex" select label="Sex"
                                    SelectProps={{
                                        native: true
                                    }}
                                    margin="normal"
                                    variant="outlined"
                                >
                                    {sex.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField value={this.state.complaints} onChange={this.handleComplaintsChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields"
                                    id="id_complaints"
                                    label="Patient Complaints"
                                    multiline
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField value={this.state.medication} onChange={this.handleMedicationChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields"
                                    id="id_medication"
                                    label="Medication Prescribed"
                                    multiline
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField value={this.state.amount} onChange={this.handleAmountChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields" id="id_amount" label="Amount" margin="normal" type="number" variant="outlined" />

                            </Col>
                        </Row>
                        <Row>
                            <Col sm="11" className="electro-reacto-line">
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="11" className="electro-reacto-add-patient-wrapper">
                                <Button variant="outlined" className="electro-reacto-add-patient-textfields" disabled={confirmActive} onClick={() => { this.confirmClicked(); }} >
                                    <div className="electro-reacto-text-color">Confirm Details</div>
                                </Button>
                                <Button variant="outlined" className="electro-reacto-add-patient-textfields" disabled={editActive} onClick={() => { this.editClicked(); }}>
                                    <div className="electro-reacto-text-color">Edit Details</div>
                                </Button>
                                <Button variant="outlined" className="electro-reacto-add-patient-textfields" disabled={saveActive}>
                                    <div className="electro-reacto-text-color" onClick={() => { this.toggleModal(); }}>Save</div>
                                </Button>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="4">
                                <Row className="electro-reacto-cards">
                                    <Card body>
                                        <SearchComponent dbSearch={this.dbSearch} />
                                    </Card>
                                </Row>
                                <Row className="electro-reacto-cards">
                                    <Card body>
                                        <SearchResults searchResults={this.state.searchData} vdbGetPatientHistory={this.vdbGetPatientHistory} />
                                    </Card>
                                </Row>
                            </Col>
                            <Col sm="7">
                                <Row className="electro-reacto-cards">
                                    <Card body>
                                       <PatientDetails patientDetails={this.state.patientHistory} vdbAddVist={this.vdbAddVist} patientHistoryDetails={this.state.patientHistoryDetails} vdbGetPatientHistory={this.vdbGetPatientHistory} />
                                    </Card>
                                </Row>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Are you sure you want to save the provided details?</ModalHeader>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.dbAddNewPatient(); this.toggleModal(); }}>Confirm</Button>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackBarActive}
                    autoHideDuration={6000}
                    onClose={()=>{this.toggleSnackBarClose();}}
                >
                    <SnackbarContent
                        style={{
                            backgroundColor:"#43a047"
                          }}
                        message={<span id="client-snackbar" >
                        <CheckCircleIcon style={{fontsize:20,margin:"0 8px 0 0",opacity:0.9}} />
                        Patient record has been added successfully!
                      </span>}
                      action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={()=>{this.toggleSnackBarClose();}}>
                          <CloseIcon style={{fontsize:20}}/>
                        </IconButton>,
                      ]}
                      
                    />
                </Snackbar>
            </div>
        );
    }
}

