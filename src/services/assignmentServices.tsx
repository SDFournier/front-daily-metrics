import axios from 'axios';
import { Assignment } from '../context/assignmentContext';

/////CREATE task in DB/////
export const createAssignment = (
  assignmentToAdd: Assignment
): Promise<Assignment> => {
  return new Promise((resolve, reject) => {
    axios
      .post('http://localhost:3000/assignment', assignmentToAdd)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error('Error creating assignment:', error);
        reject(error);
      });
  });
};
/////end call to API/////
