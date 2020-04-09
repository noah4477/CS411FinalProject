import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

 class SearchMenu extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = { value: "ALL" };
        this.handleChange = this.handleChange.bind(this);
        this.getType = this.getType.bind(this);
    }
  
    handleChange = (event) => {
      this.setState({value: event.target.value});
    };
    getType() { return this.state.value; }
  render() {
    return (
        <div style={{width:100}}>
            <Select
            id="menu"
            value={this.state.value}
            onChange={this.handleChange}
            MenuProps={{
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              }
            }}
            style={{width: 100, color: "white", backgroundColor: "rgb(147,147,147)", height: 35}}
            >
            <MenuItem value={"ALL"}>All</MenuItem>
            <MenuItem value={"Movies"}>Movies</MenuItem>
            <MenuItem value={"TVShows"}>TV Shows</MenuItem>
            <MenuItem value={"Actors"}>Actors</MenuItem>
            <MenuItem value={"Directors"}>Directors</MenuItem>
            </Select>
        </div>
        );
    }
 }

  export default SearchMenu;