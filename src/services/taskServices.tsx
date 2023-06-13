import axios from 'axios';
import { Task } from '../context/tasksContext';

/////CREATE task in DB/////
export const createTask = (taskToAdd: Task): Promise<Task> => {
  return new Promise((resolve, reject) => {
    axios
      .post('http://localhost:3000/task', taskToAdd)
      .then((response) => {
        response.data.id = response.data._id;
        resolve(response.data);
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        reject(error);
      });
  });
};
/////end call to API/////

/////UPDATE task in DB/////
export const updateTask = (TaskToCHange: Task, id: string) => {
  axios
    .put(`http://localhost:3000/task/${id}`, TaskToCHange)
    .then((response) => {
      console.log('Task updated:', response.data);
      // handle the response data or update the UI
    })
    .catch((error) => {
      console.error('Error creating task:', error);
      // handle the error or show an error message to the user
    });
};
/////end call to API/////
