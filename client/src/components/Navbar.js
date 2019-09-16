import React from 'react';
import Autosuggest from 'react-autosuggest';
import NoSsr from '@material-ui/core/NoSsr';
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import Select from 'react-select';
import spearLogo from '../images/spear-logo.png';
import './Navbar.css';



class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.handleDropDownIssueClick = this.handleDropDownIssueClick.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);

    this.state = {
      suggestions: [],
      searchValue: '',
      searchInProgress: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ suggestions: [] });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const regex = new RegExp(`${inputValue}`, 'i');
    const issues = [...this.props.issues];
    const suggestions =
      inputValue.length > 0
        ? issues.filter(issue => {
            return regex.test(issue.toLowerCase());
          })
        : null;
      return suggestions;
  }

  getSuggestionValue(suggestion) { return suggestion };

  onSearchTextChange(e) {
    console.log('Navbar.js onSearchTextChange called');
    const value = e.target.value;
    const regex = new RegExp(`${value}`, 'i');
    const issues = [...this.props.issues];
    const suggestions =
      value.length > 0
        ? issues.filter(issue => {
            return regex.test(issue);
          })
        : [];
    this.setState({ suggestions: suggestions, searchInProgress: true });
  }

  handleDropDownIssueClick(title) {
    this.setState({ suggestions: [], searchInProgress: false });
    this.props.onIssueClick(title);
  }

  onChange = (event, { newValue }) => {
    this.setState({
      searchValue: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let suggestions = this.getSuggestions(value);
    this.setState({
      suggestions: suggestions
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderSuggestion(suggestion) {
    return (
      <div>
        {suggestion}
      </div>
    );
  }
 
  render() {
    const { suggestions, searchInProgress, searchValue } = this.state;
    const { issues, onSearchClick } = this.props;

    const suggestionListMarkup =
      suggestions.length > 0
        ? suggestions.map((suggestion, index) => {
            return (
              <li
                key={index}
                onClick={() => this.handleDropDownIssueClick(suggestion)}
              >
                {suggestion}
              </li>
            );
          })
        : null;

    const options =
      issues.length > 0
        ? issues.map((issue, index) => {
            return { value: issue, label: issue };
          })
        : null;

    console.log('[Navbar.js], this.state.searchValue', searchValue);

    const inputProps = {
      placeholder: 'HADOOP-#',
      value: searchValue,
      onChange: this.onChange
    };

    return (
      <div className="navbar">
        <ul className="navigation" role="navigation">
          <li className="titleContainer">
            <img src={spearLogo} />
            <h3>Online debugger</h3>
          </li>
          <li>
            <div className="searchBar">
              <Autosuggest
                className="issuesDropDownMenu"
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
              />
              <button className="searchIssuesButton" onClick={() => onSearchClick(this.state.searchValue)}>Search Issues</button>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export { Navbar, React };
