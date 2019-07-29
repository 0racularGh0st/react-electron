import React from 'react';
import '../App.css';
import './PatientDetails.css';

export default class PatientDetails extends React.Component{
    constructor(props){
        super(props);
        this.patientDetails=this.props.patientDetails || 'Default';
    }
    componentWillReceiveProps(nextProps,nextContext){
        if(this.props.patientDetails!==nextProps.patientDetails)
        {
            this.patientDetails=nextProps.patientDetails;
        }
    }
    
    render(){
        if(this.patientDetails!=='Default'){
            console.log(this.patientDetails);
        }
        return(
            <div>
                <div className="electro-reacto-text-color electro-reacto-patient-details-header">
                   Patient History:
                </div>
            </div>
        );
    }
}