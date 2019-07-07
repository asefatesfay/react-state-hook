import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const useDataApi = (initialUrl, initialData) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState(false);

    useEffect(() => {
        async function fetchData(){
            setIsLoading(true);
            try{const result = await axios(url);
              setData(result.data);
            }
            catch {
                setError(true);
            }
            setIsLoading(false);
        }
        fetchData();
      }, [url]);
      return [{data, isLoading, isError}, setUrl];
};

function App() {
  
  const [query, setQuery] = useState("redux");
  const [{data, isLoading, isError}, doFetch] = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=redux',
    {hits: []}
  );

  return (
      <Fragment>
          <form onSubmit={event => {
              doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
              event.preventDefault();
          }}>
              <input type="text" value={query} onChange={event => setQuery(event.target.value)} />
              <button type="submit">Search</button>
          </form>

          {isError && <h2>Oops, something hit snug ...</h2>}

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

