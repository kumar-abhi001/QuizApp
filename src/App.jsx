import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './pages';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/quiz' element={<Quiz/>} />
          <Route path='/results' element={<Result />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer theme='dark' />
    </>
  )
}

export default App
