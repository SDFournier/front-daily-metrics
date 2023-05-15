import { createContext } from 'react';
import { useReducer } from 'react';



//interfaces:

export interface Assignment {
    id: string;
    name: string;
    color: string
    description: string;
    author: string;
    category: string;
    /*
    assignment: string;
    dateStartOfTask: Date;
    dateEndOfTask: Date;
    duration: Number;
    */
}

export interface AssignmentState {
    todoCount: number;
    todos: Assignment[],
    completed: number;
    pending: number;
}
type AssignmentContextProps = {
    assignmentState: AssignmentState;
    addAssignment: ( assignment: Assignment ) => void;
    addAssignments: ( assignment: Assignment[] ) => void;
    toggleAssignment: ( id: string ) => void;
} 




const INITIAL_STATE: AssignmentState = {
    todoCount: 2,
    todos: [
        /*
        {
            id: "6458011830623d4ea49eb453",
            name: "assignment eesfdf de node parte 2",
            color: "#1ca884"
            
            creator: "seba",
            description: "Viendo como hacer un loop en node",
            assignment: "6456748f221c7a0f3541a604",
            category: "64579ed546711f328f59f1a5",
            dateStartOfTask: new Date("2023-05-08T14:22:17.984Z"),
            dateEndOfTask: new Date("2023-05-08T14:22:17.984Z"),
            duration: 3.5
            
        },
        {
            id: "6457fe93766b32971f0bc6ed",
            name: "assignemnt sdsd  parte 2",
            color: "#3e1ca8"
            
            creator: "seba",
            description: "Alguna tarea en node",
            assignment: "6456748f221c7a0f3541a604",
            category: "64579ed546711f328f59f1a5",
            dateStartOfTask:  new Date("2023-05-08T14:22:17.984Z"),
            dateEndOfTask:  new Date("2023-05-08T14:22:17.984Z"),
            duration: 3.5,
            
        },
        */
    ],
    completed: 0,
    pending: 2
}
//reducer

type TodoAction = 
    | { type: 'addAssignment', payload: Assignment }
    | { type: 'addAssignments', payload: Assignment[] }
    | { type: 'toggleAssignment', payload: { id: string } };


export const todoReducer = ( state: AssignmentState, action: TodoAction ): AssignmentState => {

    switch ( action.type ) {
        case 'addAssignment':
            return {
                ...state,
                todos: [ ...state.todos, action.payload ]
            }
        case "addAssignments":
            // Add an array of tasks
            return {
                ...state,
                todos: [...state.todos, ...action.payload],
            };
        case 'toggleAssignment': 
            return {
                ...state,
                todos: state.todos.map( ({ ...assignment }) => {
                    if( assignment.id === action.payload.id ) {
                        console.log("--> assignment toogled")
                    }
                    return assignment;
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


export const AssignmentContext = createContext<AssignmentContextProps>({} as AssignmentContextProps );



export const AssignmentProvider = ({ children }: props ) => {

    const [ assignmentState, dispatch] = useReducer( todoReducer, INITIAL_STATE );

    const toggleAssignment = ( id: string ) => {
        dispatch({ type: 'toggleAssignment', payload: { id } })
    }

     const addAssignment = ( assignment: Assignment ) => {
        dispatch({ type: 'addAssignment', payload:  assignment  })
    }

    const addAssignments = ( assignments: Assignment[] ) => {
        dispatch({ type: 'addAssignments', payload:  assignments  })
    }

    




    return (
        <AssignmentContext.Provider value={{
            assignmentState,
            toggleAssignment,
            addAssignment,
            addAssignments
        }}>
            { children }
        </AssignmentContext.Provider>
    )
}

export default AssignmentProvider;