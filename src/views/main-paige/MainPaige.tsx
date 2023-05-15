import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Table from '../../table/tableTask/Table';
import { Task, TaskContext } from '../../context/tasksContext';
import TableAssignment from '../../table/tableAssignment/TableAssignment';
import styles from './mainPage.module.css';
import { Assignment, AssignmentContext } from '../../context/assignmentContext';
const MainPaige = () => {
  //const [ tasks, setTasks ] = useState([])
  const { addTasks } = useContext(TaskContext);
  const { addAssignments } = useContext(AssignmentContext);
  useEffect(() => {
    console.log('--------> se llama a las APIs');
    axios.get('http://localhost:3000/assignment').then((response) => {
      console.log('respuesta de assignment api: ', response.data);
      const subsetArrayAssignments: Assignment[] = response.data.map(
        ({
          _id,
          name,
          color,
        }: {
          _id: string;
          name: string;
          color: string;
        }) => ({
          id: _id,
          name,
          color,
        })
      );

      console.log('subsetArrayAssignments: ', subsetArrayAssignments);
      addAssignments(subsetArrayAssignments);
    });

    axios.get('http://localhost:3000/task').then((response) => {
      console.log('respuesta de task api: ', response.data);
      const subsetArrayTasks: Task[] = response.data.map(
        ({
          _id,
          name,
          description,
          assignment,
          dateStartOfTask,
          dateEndOfTask,
          duration,
          category,
          creator,
        }: {
          _id: string;
          name: string;
          description: string;
          assignment: string;
          dateStartOfTask: string;
          dateEndOfTask: string;
          duration: string;
          category: string;
          creator: string;
        }) => ({
          id: _id,
          name,
          description,
          assignment,
          dateStartOfTask,
          dateEndOfTask,
          duration,
          category,
          creator,
        })
      );

      console.log('subsetArrayTasks: ', subsetArrayTasks);
      addTasks(subsetArrayTasks);
    });
  }, []);

  return (
    <>
      <div className={styles.containerTables}>
        <TableAssignment />
        <Table />
      </div>
    </>
  );
};
export default MainPaige;
