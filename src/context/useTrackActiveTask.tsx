import { createContext, useEffect, useState, useContext } from 'react';
import { useReducer } from 'react';
import { Task,TaskContext } from './tasksContext';

export interface ActiveTask {
    id: string;
    name: string;
    color: string
    /*
    creator: string;
    description: string;
    assignment: string;
    category: string;
    dateStartOfTask: Date;
    dateEndOfTask: Date;
    duration: Number;
    */
}
/*
function useTrackActiveTask(){
  const { taskState,toggleTask,addTask } = useContext(TaskContext)

  const [duration, setDuration] = useState(task.duration);

function useTaskDuration(task: Task, duration:number) {
  
    useEffect(() => {
      let intervalId: number;

      if (task.active) {
          intervalId = setInterval(() => {
          setDuration(duration => duration + 1);
        }, 1000);
      }
  
      return () => {
        clearInterval(intervalId);
      };
    }, [task.active]);


    
}


const checkActiveTask = (tasks: Task[]) => {
    const activeTask = tasks.find(task => task.active);
    if (activeTask) {
        useTaskDuration(activeTask)
    };
}
  
  setInterval(() => {
    
    checkActiveTask(taskState.todos);
  }, 1000);
  

  return {duration}
}
*/