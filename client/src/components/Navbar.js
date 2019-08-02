import React from 'react';
import './Navbar.css';
import SwitchButton from './Switch.js'

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.handleDropDownIssueClick = this.handleDropDownIssueClick.bind(this);
  }

  state = {
    suggestions: [],
    searchInProgress: false
  };

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

  onSearchTextChange(e) {
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

  render() {
    const { suggestions, searchInProgress } = this.state;

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

    let searchBoxValue;
    if (!searchInProgress) {
      searchBoxValue = '';
    }

    return (
      <div className="navbar">
        <ul className="navigation" role="navigation">
          <li className="title">working title</li>
          <li className="searchbar">
          <li><SwitchButton/></li>
            <div className="inputDropdown" ref={this.setWrapperRef}>
              <input
                type="text"
                id="targetIssue"
                onChange={this.onSearchTextChange}
                value={searchBoxValue}
                autoComplete="off"
              />
              <ul>{suggestionListMarkup}</ul>
            </div>
            <label>Search Issues</label>
          </li>
        </ul>
      </div>
    );
  }
}

export {
  Navbar,
  React
}
