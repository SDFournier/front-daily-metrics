import { createContext } from 'react';
import { useReducer } from 'react';



//interfaces:

export interface Task {
    id: string;
    name: string;
    description: string;
    assignment: string;
    dateStartOfTask: Date;
    dateEndOfTask: Date|null;
    duration: number;
    category: string;
    creator: string;
    /*
    */
}

export interface TaskState {
    todoCount: number;
    todos: Task[],
    completed: number;
    pending: number;
}
type TaskContextProps = {
    taskState: TaskState;
    addTask: ( task: Task ) => void;
    addTasks: ( task: Task[] ) => void;
    toggleTask: ( id: string ) => void;
    setDuration: ( id: string ) => void;
} 




const INITIAL_STATE: TaskState = {
    todoCount: 0,
    todos: [
        /*
        {
            id: "6458011830623d4ea49eb453",
            name: "task 3 de node parte 2",
            assignment: "6456748f221c7a0f3541a604",
            description: "Viendo como hacer un loop en node",
            dateStartOfTask: new Date("2023-05-08T14:22:17.984Z"),
            dateEndOfTask: new Date("2023-05-08T14:22:17.984Z"),
            duration: 3.5,
            creator: "seba",
            category: "64579ed546711f328f59f1a5",
            
            
        },
        {
            id: "6457fe93766b32971f0bc6ed",
            name: "task4  parte 2",
            assignment: "6456748f221c7a0f3541a604",
            description: "Alguna tarea en node",
            dateStartOfTask:  new Date("2023-05-08T14:22:17.984Z"),
            dateEndOfTask:  new Date("2023-05-08T14:22:17.984Z"),
            duration: 3.5,
            creator: "seba",
            category: "64579ed546711f328f59f1a5",
            
            
        },
        */
    ],
    completed: 0,
    pending: 2
}
//reducer

type TodoAction = 
    | { type: 'addTask', payload: Task }
    | { type: 'addTasks', payload: Task[] }
    | { type: 'toggleTask', payload: { id: string } }
    | { type: 'setDuration', payload: { id: string } };


export const todoReducer = ( state: TaskState, action: TodoAction ): TaskState => {

    switch ( action.type ) {
        case 'addTask':
            return {
                ...state,
                todos: [ action.payload, ...state.todos ]
            }
        case "addTasks":
            // Add an array of tasks
            return {
                ...state,
                todos: [...action.payload],
            };
        case 'toggleTask': 
            return {
                ...state,
                todos: state.todos.map( ({ ...task }) => {
                    if( task.id === action.payload.id ) {
                        console.log("--> task toogled")
                    }
                    return task;
                })
            }
        case 'setDuration': 
            return {
                ...state,
                todos: state.todos.map( ({ ...task }) => {
                    if( task.id === action.payload.id ) {
                        const now = new Date();
                        const dateStartOfTask_DATETYPE = new Date(task.dateStartOfTask);
                        const timeDiffMs = now.getTime() - dateStartOfTask_DATETYPE.getTime(); 
                        console.log("timeDiffMs: ", timeDiffMs, " --> dateStartOfTask_DATETYPE : ", dateStartOfTask_DATETYPE)
                        return { ...task, duration:  Math.floor(timeDiffMs / 1000 )  };
                    }
                    return task;
                })
            }

            
        default:
            return state;
    }

}


//end reducer





interface props {
    children: JSX.Element | JSX.Element[]
}


export const TaskContext = createContext<TaskContextProps>({} as TaskContextProps );



export const TaskProvider = ({ children }: props ) => {

    const [ taskState, dispatch] = useReducer( todoReducer, INITIAL_STATE );

    const toggleTask = ( id: string ) => {
        dispatch({ type: 'toggleTask', payload: { id } })
    }

     const addTask = ( task: Task ) => {
        dispatch({ type: 'addTask', payload:  task  })
    }

    const addTasks = ( tasks: Task[] ) => {
        dispatch({ type: 'addTasks', payload:  tasks  })
    }

    const setDuration = ( id: string ) => {
        dispatch({ type: 'setDuration', payload:  { id }  })
    }

    




    return (
        <TaskContext.Provider value={{
            taskState,
            toggleTask,
            addTask,
            addTasks,
            setDuration
        }}>
            { children }
        </TaskContext.Provider>
    )
}

export default TaskProvider;