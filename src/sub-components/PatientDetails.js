import React from 'react';
import '../App.css';
import './PatientDetails.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Add from '@material-ui/icons/AddBox';
import Cancel from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';

export default class PatientDetails extends React.Component {
    constructor(props) {
        super(props);
        this.patientDetails = this.props.patientDetails || 'Default';
        this.mainDetails=this.props.patientHistoryDetails || null;
        this.state = {
            complaints: '',
            medication: '',
            amount: '',
            confirmActive: true,
            editActive: false,
            saveActive: false,
            modal: false,
            addButtonClicked: false
        }
        this.handleComplaintsChange = this.handleComplaintsChange.bind(this);
        this.handleMedicationChange = this.handleMedicationChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.confirmClicked = this.confirmClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        this.addVist = this.addVist.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.handleVisitsRefetch=this.handleVisitsRefetch.bind(this);
    }
    handleVisitsRefetch(){
        this.props.vdbGetPatientHistory(this.patientDetails.reg_no,this.mainDetails);
    }
    handleAddButtonClick() {
        if (this.state.addButtonClicked) {
            this.setState({ addButtonClicked: false })
        }
        else {
            this.setState({ addButtonClicked: true })
        }
    }
    addVist() {
        new Promise((resolve,reject)=>{
             if (this.patientDetails.reg_no !== null || this.state.complaints !== '' || this.state.medication !== '' || this.state.amount !== '') {
                this.props.vdbAddVist(this.patientDetails.reg_no, this.state.complaints, this.state.medication, this.state.amount);
                this.editClicked();
                this.setState({
                    complaints: '',
                    medication: '',
                    amount: ''
                });
            }
            resolve();
        }).then(()=>{this.handleVisitsRefetch();});
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.patientDetails !== nextProps.patientDetails) {
            this.patientDetails = nextProps.patientDetails;
        }
        if (this.props.patientHistoryDetails !== nextProps.patientHistoryDetails) {
            this.mainDetails = nextProps.patientHistoryDetails;
        }
    }
    handleComplaintsChange(e) {
        this.setState({
            complaints: e.target.value
        });
    }
    handleMedicationChange(e) {
        this.setState({
            medication: e.target.value
        });
    }
    handleAmountChange(e) {
        this.setState({
            amount: e.target.value
        });
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
    render() {
        console.log("main details-->>",this.mainDetails);
        let addButtonActive=this.state.addButtonClicked;
        let buttonText=!addButtonActive?"Add Visit":"Cancel";
        let buttonIcon=!addButtonActive?<Add className="electro-reacto-add-visit-icon" />: <Cancel className="electro-reacto-add-visit-icon" />
        let confirmActive = !this.state.confirmActive;
        let editActive = !this.state.editActive;
        let saveActive = !this.state.saveActive;
        let content = [];
        if (this.patientDetails !== 'Default' && this.patientDetails !== null && this.patientDetails !== undefined) {
            console.log(this.patientDetails.reg_no);
            let i = 0;
            for (i = 0; i < this.patientDetails.visits.length; i++) {
                content.push(<div style={{"margin-bottom":"0.5rem"}} key={i}>
                    <ExpansionPanel >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <div className="electro-reacto-visits-text electro-reacto-text-color">Visit {i + 1}: </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails >
                            <span className="electro-reacto-visits-flex-box">
                                <Card className="electro-reacto-visits-complaints electro-reacto-visits-card">
                                    <CardContent>
                                        <div className="electro-reacto-text-color electro-reacto-visit-heading">
                                            Complaints
                                </div>
                                        <div className="electro-reacto-text-color">
                                            {this.patientDetails.visits[i].complaints}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="electro-reacto-visits-meds electro-reacto-visits-card">
                                    <CardContent>
                                        <div className="electro-reacto-text-color electro-reacto-visit-heading">
                                            Medication Prescribed
                                </div>
                                        <div className="electro-reacto-text-color">
                                            {this.patientDetails.visits[i].meds}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="electro-reacto-visits-amount electro-reacto-visits-card">
                                    <CardContent>
                                        <div className="electro-reacto-text-color electro-reacto-visit-heading">
                                            Amount
                                </div>
                                        <div className="electro-reacto-text-color">
                                            Rs.{this.patientDetails.visits[i].amount}/-
                                </div>
                                    </CardContent>
                                </Card>
                            </span>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>);
            }
        }
        return (
            <div>
                <div className="electro-reacto-text-color electro-reacto-patient-details-header">
                    Patient History
                </div>
                {this.mainDetails!==null && 
                     <div className="electro-reacto-patient-main-details">
                         Name: {this.mainDetails.firstname} {this.mainDetails.lastname} | Age: {this.mainDetails.age} | Sex: {this.mainDetails.sex}
                    </div>

                }
                {this.patientDetails!=='Default' &&
                <div>
                <Button variant="outlined" className="electro-reacto-add-patient-textfields electro_reacto-remove-top-margin" onClick={()=>{this.handleAddButtonClick();}}>
                    <div className="electro-reacto-text-color">{buttonText} </div>
                    {buttonIcon}
                </Button>
                <div className={!addButtonActive?"electro-reacto-add-visit-with-transform":"electro-reacto-add-visit-with-transform-extended"}>
                        <TextField value={this.state.complaints} onChange={this.handleComplaintsChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields"
                            id="id_new_complaints"
                            label="Patient Complaints"
                            multiline
                            margin="normal"

                        />
                        <TextField value={this.state.medication} onChange={this.handleMedicationChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields"
                            id="id_new_medication"
                            label="Medication Prescribed"
                            multiline
                            margin="normal"

                        />
                        <TextField value={this.state.amount} onChange={this.handleAmountChange} disabled={confirmActive} className="electro-reacto-add-patient-textfields" id="id_new_amount" label="Amount" margin="normal" type="number" />

                  
                        <Button size="small" variant="outlined" className="electro-reacto-add-patient-textfields" disabled={confirmActive} onClick={() => { this.confirmClicked(); }} >
                            <div className="electro-reacto-text-color">Confirm Details</div>
                        </Button>
                        <Button size="small" variant="outlined" className="electro-reacto-add-patient-textfields" disabled={editActive} onClick={() => { this.editClicked(); }}>
                            <div className="electro-reacto-text-color">Edit Details</div>
                        </Button>
                        <Button size="small" variant="outlined" className="electro-reacto-add-patient-textfields" disabled={saveActive}>
                            <div className="electro-reacto-text-color" onClick={() => { this.toggleModal(); }}>Save</div>
                        </Button>
                </div>
                <div>
                    {content}
                </div>
                </div>}
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Are you sure you want to add a new visit?</ModalHeader>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.addVist(); this.toggleModal(); }}>Confirm</Button>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}