import { useMemo } from 'react';

import './App.css';
import TaskProvider from './context/tasksContext';
import MainPaige from './views/main-paige/MainPaige';
import AssignmentProvider from './context/assignmentContext';

function App() {
  //const [count, setCount] = useState(0)
  const MemoizedMainPage = useMemo(() => <MainPaige />, []);

  return (
    <>
      <TaskProvider>
        <AssignmentProvider>{MemoizedMainPage}</AssignmentProvider>
      </TaskProvider>
    </>
  );
}

export default App;
