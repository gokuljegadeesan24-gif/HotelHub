import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import HotelFormPage from './pages/HotelFormPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/hotels/add" element={<HotelFormPage />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/hotels/:id/edit" element={<HotelFormPage />} />
        <Route path="*" element={<p className="empty">Page not found</p>} />
      </Routes>
    </>
  );
}

export default App;
