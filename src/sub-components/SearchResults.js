import React from 'react';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import InfoIcon from '@material-ui/icons/Info';
import '../App.css';
import './SearchResults.css';

export default class SearchResults extends React.Component{
    constructor(props){
        super(props);
        this.searchResults=this.props.searchResults||'Default';
    }
    componentWillReceiveProps(nextProps,nextContext){
        if(this.props.searchResults!==nextProps.searchResults)
        {
            this.searchResults=nextProps.searchResults;
        }
    }
    render(){
        let searchResultsContent=[];
        if(this.searchResults!=='Default'){
            if(this.searchResults.length>0)
            {
               // console.log(this.searchResults);
              let i=0;
              for(i=0;i<this.searchResults.length;i++)
                {
                    searchResultsContent.push(<div key={i}><Paper className={"electro-reacto-paper "}><div className={"electro-reacto-paper-content electro-reacto-text-color"}>{this.searchResults[i].firstname+" "}
                    {this.searchResults[i].lastname+" (Age:"+this.searchResults[i].age+" Sex:"+this.searchResults[i].sex+")"}
                    </div></Paper></div>);
                }

            }
            else{
                console.log("Nothing Found");
            }
        }
        return(
            <div>
                <div className="electro-reacto-text-color electro-recto-search-result-text">Search Results:</div>
                {this.searchResults!=='Default' && this.searchResults.length>0 &&
                <div>
                 {searchResultsContent}
                 </div>
                }
                {
                   this.searchResults!=='Default' && this.searchResults.length===0 &&
                   <div>
                      <SnackbarContent
                        style={{
                            backgroundColor:"#839483"
                          }}
                        message={<span id="client-snackbar" >
                        <InfoIcon style={{fontsize:20,margin:"0 8px 0 0",opacity:0.9}} />
                        Sorry! 0 records found.
                      </span>}
                      />
                   </div>
                }
            </div>
        );
    }
}