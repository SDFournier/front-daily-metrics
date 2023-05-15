import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { Task, TaskContext } from '../../context/tasksContext';
import { AssignmentContext } from '../../context/assignmentContext';
import { Table as TableBootstrap } from 'react-bootstrap';
import styles from './table.module.css';
import { createTask, updateTask } from '../../services/taskServices';

function Table() {
  const [previousIntervalId, setPreviousIntervalId] = useState<
    number | undefined
  >(undefined);
  const [timerTask, setTimerTask] = useState<number | null>(null);
  const { assignmentState } = useContext(AssignmentContext);
  const { taskState, addTask, addTasks } = useContext(TaskContext);
  const [descriptionUpdateId, setDescriptionUpdateiD] = useState('');
  const [currentDescription, setCurrentDescription] = useState({
    previousUpdated: '',
    beingUpdated: '',
  });

  const handleDescriptionCellClick = (
    taskId: string,
    taskDescription: string
  ) => {
    setCurrentDescription(() => ({
      previousUpdated: taskDescription,
      beingUpdated: taskDescription,
    }));
    setDescriptionUpdateiD(taskId);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement> | null
  ) => {
    if (event?.key === 'Enter') {
      saveUpdatedDescription(descriptionUpdateId);
      setDescriptionUpdateiD('');
    }
  };
  const handleBlur = () => {
    saveUpdatedDescription(descriptionUpdateId);
    setDescriptionUpdateiD('');
  };

  const handleInputDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentDescription((prevState) => ({
      ...prevState,
      beingUpdated: event.target.value,
    }));
  };

  const saveUpdatedDescription = (descriptionId: string) => {
    console.log('beingUpdated: ', currentDescription.beingUpdated);
    if (
      currentDescription.beingUpdated !== currentDescription.previousUpdated
    ) {
      //LOGICA PARA ACTUALIZAR EN LA BD
      const myTask = taskState.todos.find((obj) => obj.id === descriptionId);
      if (myTask !== undefined) {
        let updatedTaskId = myTask.id;
        addTasks(
          taskState.todos.map((todo) => {
            if (todo.id === myTask.id) {
              const updatedTask: Task = {
                ...todo,
                description: currentDescription.beingUpdated,
              };
              /////UPDATE DESCRIPTION TASK IN DB/////
              updateTask(updatedTask, updatedTaskId);
              /////UPDATE DESCRIPTION FINISHED IN DB/////
              return updatedTask;
            }
            return todo;
          })
        );
      }
    }
  };

  /////////////////////////////////
  function handleOnDrop(e: React.DragEvent) {
    console.log('------> on DROP');
    const idAssignment = e.dataTransfer.getData('idAssignment') as string;
    //get the assignment by id
    const { todos } = assignmentState;
    const myAssignment = todos.find((obj) => obj.id === idAssignment);
    console.log('--> myAssignment: ', myAssignment);
    if (myAssignment !== undefined) {
      setTimerTask(0);
      //create a task based on that assignment
      const TaskToAdd: Task = {
        id: '',
        name: myAssignment.name,
        description: '',
        assignment: myAssignment.id,
        category: '64579ed546711f328f59f1a5', //hardcodeado
        creator: 'seba',
        dateStartOfTask: new Date(),
        dateEndOfTask: null,
        duration: 0,
      };
      /////create task in DB/////
      createTask(TaskToAdd)
        .then((taskCreated) => {
          console.log('New task :', taskCreated);
          //locally add the new task
          addTask(taskCreated);
        })
        .catch((error) => {
          console.error('Error creating task:', error);
          // handle the error as needed
        });

      const { todos } = taskState;
      addTasks(
        todos.map((todo) => {
          //we iterate the array to find the tasks that didnt finish and finish them
          if (todo.dateEndOfTask === null) {
            const now = new Date();
            const dateStartOfTask_DATETYPE = new Date(todo.dateStartOfTask);

            const timeDiffS =
              now.getTime() - dateStartOfTask_DATETYPE.getTime();
            const TaskToCHange = {
              id: todo.id,
              name: todo.name,
              description: todo.description,
              creator: todo.creator,
              assignment: todo.assignment,
              category: todo.category,
              dateStartOfTask: todo.dateStartOfTask,
              dateEndOfTask: new Date(),
              duration: Math.floor(timeDiffS / 1000),
            };

            /////UPDATE FINISHED TASK IN DB/////
            updateTask(TaskToCHange, todo.id);

            /////end call to API/////

            const timeDiffMs =
              now.getTime() - dateStartOfTask_DATETYPE.getTime();
            return {
              ...todo,
              dateEndOfTask: new Date(),
              duration: Math.floor(timeDiffMs / 1000),
            };
          }
          return todo;
        })
      );
    }
  }

  useEffect(() => {
    const activeTask = taskState.todos.find(
      (task: Task) => task.dateEndOfTask === null && task.dateStartOfTask
    );
    let intervalId: number;

    if (activeTask) {
      clearInterval(previousIntervalId);
      intervalId = setInterval(() => {
        const now = new Date();
        const dateStartOfTask_DATETYPE = new Date(activeTask.dateStartOfTask);
        const timeDiffMs = now.getTime() - dateStartOfTask_DATETYPE.getTime();
        setTimerTask(Math.floor(timeDiffMs / 1000));
      }, 1000);
      setPreviousIntervalId(intervalId);
    }
    return () => {};
  }, [taskState]);

  function formatTime(seconds: number | null) {
    if (seconds !== null) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
          .toString()
          .padStart(2, '0')}`;
      }
    } else {
      return '00:00';
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function formatTimeStartTime(startTimeTask: Date) {
    const startTime = new Date(startTimeTask);
    const formattedTime = startTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return formattedTime;
  }

  return (
    <>
      <div
        className={styles.containerAssignment}
        onDrop={handleOnDrop}
        onDragOver={handleDragOver}
      >
        <TableBootstrap
          striped="columns"
          className={styles.tableAssignment}
          bordered
          hover
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Tarea</th>
              <th>Description</th>
              <th>Time Started</th>
              <th>Timer</th>
            </tr>
          </thead>
          <tbody>
            {taskState.todos?.map((task: Task, index: number) => (
              <tr key={index} draggable className={styles.assignment}>
                <td className={styles.tableColumnIndex}>
                  {taskState.todos.length - index}
                </td>
                <td className={styles.tableColumnName}>{task.name}</td>
                {descriptionUpdateId !== task.id ? (
                  <td
                    onDoubleClick={() =>
                      handleDescriptionCellClick(task.id, task.description)
                    }
                    className={styles.tableColumnName}
                  >
                    {task.description}
                  </td>
                ) : (
                  <td>
                    <input
                      type="text"
                      value={currentDescription.beingUpdated}
                      onChange={handleInputDescription}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                    />
                  </td>
                )}
                <td className={styles.tableColumnName}>
                  {formatTimeStartTime(task.dateStartOfTask)}
                </td>
                {!task.dateEndOfTask ? (
                  <td className={styles.tableColumnName}>
                    {formatTime(timerTask)}
                  </td>
                ) : (
                  <td className={styles.tableColumnName}>
                    {formatTime(task.duration)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </TableBootstrap>
      </div>
    </>
  );
}

export default Table;
