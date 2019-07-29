import React from 'react';
import SearchBar from 'material-ui-search-bar';
import '../App.css';
export default class SearchComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            value:''
        }
        this.handleSearchRequest=this.handleSearchRequest.bind(this);
    }
    handleSearchRequest(){
        if(this.state.value!=='')
        this.props.dbSearch(this.state.value);
    }
    render() {
        return (
            <div>
                <div className="electro-reacto-text-color">
                    Enter the Patient's First Name:
                </div>
                <SearchBar
                value={this.state.value}
                onChange={(newValue) => this.setState({ value: newValue })}
                    onRequestSearch={() =>{this.handleSearchRequest();}}
                    style={{
                        margin: '1rem auto',
                        maxWidth: 400
                    }}
                />
            </div>
        );
    }
}