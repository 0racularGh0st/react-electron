import React from 'react';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import InfoIcon from '@material-ui/icons/Info';
import '../App.css';
import './SearchResults.css';
export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            addedListeners:false
        }
        this.searchResults = this.props.searchResults || 'Default';
        this.handlePatientDetailsFetch = this.handlePatientDetailsFetch.bind(this);
        this.regToDetails={};
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.searchResults !== nextProps.searchResults) {
            this.searchResults = nextProps.searchResults;
        }
    }
    handlePatientDetailsFetch(e) {
        console.log("Reg->",e.target.id," Details->",this.regToDetails[e.target.id]);
        this.props.vdbGetPatientHistory(e.target.id,this.regToDetails[e.target.id]);       
    }



    render() {
        let searchResultsContent = [];
        if (this.searchResults !== 'Default') {
           
                if (this.searchResults.length > 0) {
                    let i = 0;
                    // console.log(this.searchResults);
                    var reg_no = [];
                    for (i = 0; i < this.searchResults.length; i++) {
                       
                        reg_no[i] = this.searchResults[i].reg_no;
                        this.regToDetails[this.searchResults[i].reg_no]={
                            "firstname":this.searchResults[i].firstname,
                            "lastname":this.searchResults[i].lastname,
                            "age":this.searchResults[i].age,
                            "sex":this.searchResults[i].sex
                        }
                        console.log("reg_no-->>>", reg_no[i]);
    
                        searchResultsContent.push(<div key={i}><Paper  onClick={this.handlePatientDetailsFetch} className={"electro-reacto-paper-results-unique "}><div id={reg_no[i]} className={"electro-reacto-paper-content electro-reacto-text-color"}>{(i + 1) + ". " + this.searchResults[i].firstname + " "}
                            {this.searchResults[i].lastname + "  | Age:" + this.searchResults[i].age + " | Sex:" + this.searchResults[i].sex}
                        </div></Paper></div>);
                       
                    }
    
                }
                
            
          
        }
        return (
            <div>
                <div className="electro-reacto-text-color electro-recto-search-result-text">Search Results:</div>
                {this.searchResults !== 'Default' && this.searchResults.length > 0 &&
                    <div>
                        {searchResultsContent}
                    </div>
                }
                {
                    this.searchResults !== 'Default' && this.searchResults.length === 0 &&
                    <div>
                        <SnackbarContent
                            style={{
                                backgroundColor: "#839483"
                            }}
                            message={<span id="client-snackbar" >
                                <InfoIcon style={{ fontsize: 20, margin: "0 8px 0 0", opacity: 0.9 }} />
                                Sorry! 0 records found.
                      </span>}
                        />
                    </div>
                }
            </div>
        );
    }
}