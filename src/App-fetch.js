import React, { Fragment, useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) =>{
    switch(action.type) {
        case "FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case "FETCH_SUCCESS": 
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            }
        case "FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true
            }
            default:
                throw new Error();
    }
}

const useDataApi = (initialUrl, initialData) => {
    const [url, setUrl] = useState(initialUrl);
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData
    });

    useEffect(() => {
        let didCancel = false;
        async function fetchData(){
            dispatch({type: "FETCH_INIT"});
            try{
                const result = await axios(url);
                if(!didCancel){
                    dispatch({type: "FETCH_SUCCESS", payload: result.data});
                }
            }
            catch {
                if(!didCancel){
                    dispatch({type: "FETCH_FAILURE"});
                }
            }
        }
        fetchData();
        return ()=>{
            didCancel = true;
        };
      }, [url]);
      return [state, setUrl];
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

