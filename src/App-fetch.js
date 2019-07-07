import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState("http://hn.algolia.com/api/v1/search?query=redux");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData(){
        setIsLoading(true);
        const result = await axios(url);
          setData(result.data);
          setIsLoading(false);
    }
    fetchData();
  }, [url]);

  return (
    <Fragment>
        <input type="text" value= {query} onChange={event => setQuery(event.target.value)} />
        <button type="button" onClick={()=>setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)}>Search</button>
        {isLoading ? <h1>Loading ...</h1> :
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
        }
    </Fragment>
  );
}

export default App;

