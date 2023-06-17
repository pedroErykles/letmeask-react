import './services/firebase';
import {Home} from '../src/pages/Home';
import { NewRoom } from './pages/NewRoom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { Room } from './pages/Room';
import { Toaster } from 'react-hot-toast';
import { AdminRoom } from './pages/AdminRoom';

function App() {
  
  return (
    <>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/rooms/new' Component={NewRoom} />
          <Route path='rooms/:id' Component={Room} />
          <Route path='admin/rooms/:id' Component={AdminRoom}/>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
    <Toaster />
    </>
  );
} 

export default App
