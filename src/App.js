import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'react';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = (searchTerm) => (item) =>
    !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Search = ({ value, onChange, children }) =>
  <form>
    {children}
    <input type="text"
           value={value}
           onChange={onChange} />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button onClick={() => onDismiss(item.objectID)}
                  className="button-inline">
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button onClick={onClick}
          className={className}
          type="button">
    {children}
  </button>

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotID);
    this.setState({ list: updatedList });
  }

  render() {
    const { result, searchTerm } = this.state;

    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm}
                  onChange={this.onSearchChange}>
            Search:
          </Search>
          <Table list={result.hits}
                 pattern={searchTerm}
                 onDismiss={this.onDismiss} />
        </div>
      </div>
    );
  }
}

export default App;
