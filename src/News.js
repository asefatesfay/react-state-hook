import React, {Component} from  "react";
import axios from "axios";
class News extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        news: [],
      };
    }
  
    componentDidMount() {
    this._isMounted  = true;
      axios
        .get('https://hn.algolia.com/api/v1/search?query=react')
        .then(result =>{
          if(this._isMounted){
            this.setState({
                news: result.data.hits,
              })
          }
        }
        );
    }

    componentWillMount() {
        this._isMounted = false;
    }
  
    render() {
      return (
        <ul>
          {this.state.news.map(topic => (
            <li key={topic.objectID}>{topic.title}</li>
          ))}
        </ul>
      );
    }
  }

  export default News;