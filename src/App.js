import React, {useState, useReducer, useEffect, memo, createRef, forwardRef, useContext} from 'react';
import uuid from "uuid";
import UserContext, {UserProvider} from "./UserContext";

const initialTodos = [
  {
    id: uuid(),
    task: 'Learn React',
    complete: true,
  },
  {
    id: uuid(),
    task: 'Learn Firebase',
    complete: true,
  },
  {
    id: uuid(),
    task: 'Learn GraphQL',
    complete: false,
  },
];

const filterReducer = (state, action) => {
    switch (action.type) {
      case 'SHOW_ALL':
        return 'ALL';
      case 'SHOW_COMPLETE':
        return 'COMPLETE';
      case 'SHOW_INCOMPLETE':
        return 'INCOMPLETE';
      default:
        throw new Error();
    }
  };

const App = () => {
    const user = {name: "Adoani", loggedIn: true};
    console.log("Does it render?");
    const initialCount = +localStorage.getItem("storageCount");

    const [filter, dispatchFilter] = useReducer(filterReducer, "ALL");
    const [greeting, setGreeting] = useState("Hello React");
    const [count, setCount] = useState(initialCount);
    useEffect(()=>localStorage.setItem("storageCount", count), [count]);
    useEffect(()=>setCount(count+1), [])
    const ref = createRef();
    // useEffect(()=>ref.current.focus(), []);
    console.log("Count: ", count);

    const [todos, setTodos] = useState(initialTodos);
    const [task, setTask] = useState("");
    const handleChangeInput = event =>{
        setTask(event.target.value);
    };

    const handleInputChange = event => {
        setGreeting(event.target.value);
    }
    
    const handleSubmit = event => {
        if(task){
            setTodos(todos.concat({id: uuid(), task, complete:false}));
        }
        setTask("");
        event.preventDefault();
    }
    const handleChangeCheckbox = id => {
        setTodos(
            todos.map(todo =>{
                if(todo.id == id) {
                    return {...todo, complete: !todo.complete}
                }
                else {
                    return todo;
                }
            })
        )
    }
    const handleShowAll  = event => {
        dispatchFilter({type: "SHOW_ALL"});
    }
    const handleShowComplete  = event => {
        dispatchFilter({type: "SHOW_COMPLETE"});
    }
    const handleShowIncomplete  = event => {
        dispatchFilter({type: "SHOW_INCOMPLETE"});
    }
    const handleIncrement = () => {
        setCount(count+1);
    }
    const handleDecrement = () => {
        setCount(count - 1);
    }

    const filteredTodos = todos.filter(todo => {
        if (filter === 'ALL') {
          return true;
        }
    
        if (filter === 'COMPLETE' && todo.complete) {
          return true;
        }
    
        if (filter === 'INCOMPLETE' && !todo.complete) {
          return true;
        }
    
        return false;
      });
      return(
        <UserProvider value={user}>
            <User /> <br />
            <AnotherUser />
        </UserProvider>
      );
//   return (<div>
//       <Count count={count} />
//       <div>
//           <button type="button" onClick={handleShowAll}>Show All</button>
//           <button type="button" onClick={handleShowComplete}>Show Complete</button>
//           <button type="button" onClick={handleShowIncomplete}>Show Incomplete</button>
//       </div>
//     <ul>
//       {filteredTodos.map(todo => (
//         <li key={todo.id}>
//           <label>
//          <input type="checkbox" checked={todo.complete} onChange={() => handleChangeCheckbox(todo.id)} />
//           {todo.task}
//           </label>
//         </li>
//       ))}
//     </ul>
//     <form onSubmit={handleSubmit}>
//     <input type="text" value={task} onChange={handleChangeInput} />
//     <button type="submit">Add Todo</button>
//     </form>
//     <Input value={greeting} handleChangeInput={handleInputChange} >
//         Set Greeting
//     </Input>
//     <input type="text" value={greeting} onChange={handleInputChange} />
//     <Input value={greeting} handleChangeInput={handleInputChange} ref={ref}/> <br />
//     <button type ="button" onClick={handleIncrement}>Increment</button> <br />
//     <button type="button" onClick={handleDecrement}>Decrement</button>
//   </div>
//   );
};

const Input = forwardRef(({value, children, handleChangeInput}, ref) => {
    return (
        <div>
            <label>{children}</label><br />
            <input type="text" value={value} onChange={handleChangeInput} ref={ref} /><br />
            <label>{value}</label>
        </div>
    );
});

const User = ()=>{
    const user = useContext(UserContext);
    return(
        <div>
        {user.loggedIn ? <h1>Hello {user.name}</h1> : <h1>Please log in!</h1>}
    </div>
    );
    
}

class AnotherUser extends React.Component {
    static contextType = UserContext
    componentDidMount() {
        const user = this.context;
        console.log("User: ", JSON.stringify(user));
    }
    render() {
        const user = this.context;
        return (
            <div>
                <h1>Hello {user.name}</h1>
            </div>
        );
    }
}

const Count = memo(({count})=>{
    console.log("Rerendering when something changes!");
    return(
        <div>
          Count: {count}
        </div>
    )
});

export default App;