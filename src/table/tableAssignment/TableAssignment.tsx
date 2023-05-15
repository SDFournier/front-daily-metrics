import { useContext, useState } from 'react';
import { Assignment, AssignmentContext } from '../../context/assignmentContext';
import Table from 'react-bootstrap/Table';
import { BsPlus } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import styles from './tableAssignment.module.scss';
import { createAssignment } from '../../services/assignmentServices';

function TableAssignment() {
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const { assignmentState, addAssignment } = useContext(AssignmentContext);
  const [newAssignment, setNewAssignment] = useState({
    name: '',
    description: '',
    color: '#000000',
  });

  function handleOnDrag(e: React.DragEvent, idAssignemnt: string) {
    e.dataTransfer.setData('idAssignment', idAssignemnt);
  }

  const addNewAssignment = () => {
    setShowCreateAssignment((prev) => !prev);
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const sendNewAssignment = () => {
    console.log('-----> calling new assignment');
    //CREATE TASK IN DB///
    const newAssignmentObject = {
      //PODRIAMOS CREAR UNA NUEVA INTERFASE PARA CASOS DE NUEVA ASSIGNMENT, actualmente se pasa id que no se usa
      id: '',
      name: newAssignment.name,
      description: newAssignment.description,
      author: 'seba',
      category: 'Some Category',
      color: newAssignment.color,
    };
    /////CREATE assignment/////
    createAssignment(newAssignmentObject)
      .then((assignmentCreated) => {
        console.log('New assignment :', assignmentCreated);
        //locally add the new assignment
        addAssignment(assignmentCreated);
      })
      .catch((error) => {
        console.error('Error creating assignment:', error);
        // handle the error as needed
      });
    /////end call to API/////

    setShowCreateAssignment((prev) => !prev);
  };

  return (
    <>
      <div className={styles.containerAssignment}>
        <Table
          striped="columns"
          className={styles.tableAssignment}
          bordered
          hover
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Asignación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className={styles.tableColumnHeader}
                onClick={addNewAssignment}
                colSpan={2}
              >
                <span>Create Assignment</span>
              </td>
            </tr>
            {showCreateAssignment && (
              <tr className={styles.containerCreateAssignment}>
                <td
                  className={
                    showCreateAssignment
                      ? styles.tableColumnNewAssignmentActive
                      : styles.tableColumnNewAssignmentInactive
                  }
                  colSpan={2}
                >
                  <div>
                    <div>Name</div>
                    <input
                      name="name"
                      value={newAssignment.name}
                      onChange={handleInputChange}
                    ></input>
                  </div>
                  <div>
                    <div>Description</div>
                    <textarea
                      name="description"
                      value={newAssignment.description}
                      onChange={handleInputChange}
                      className={styles.descriptionInput}
                    ></textarea>
                  </div>
                  <div>
                    <div>Color</div>
                    <input
                      name="color"
                      value={newAssignment.color}
                      onChange={handleInputChange}
                      type="color"
                    />
                  </div>
                  <div className={styles.containerButtonCreateAssignment}>
                    <span>Add Assignment</span>
                    <Button
                      onClick={sendNewAssignment}
                      className={styles.buttonAdd}
                      variant="primary"
                    >
                      <BsPlus className={styles.addIcon} />
                    </Button>
                  </div>
                </td>
              </tr>
            )}
            {assignmentState?.todos.map(
              (assignment: Assignment, index: number) => (
                <tr
                  key={index}
                  draggable
                  className={styles.assignment}
                  onDragStart={(e) => handleOnDrag(e, assignment.id)}
                >
                  <td
                    className={styles.tableColumnIndex}
                    style={{ backgroundColor: assignment.color }}
                  >
                    {index}
                  </td>
                  <td
                    className={styles.tableColumnIndex}
                    style={{ backgroundColor: assignment.color }}
                  >
                    {assignment.name}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default TableAssignment;
