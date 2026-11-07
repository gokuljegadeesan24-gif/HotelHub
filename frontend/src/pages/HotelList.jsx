import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, deleteHotel } from '../store/hotelSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import Popup from '../components/Popup';

const PAGE_SIZE = 5;

function HotelList() {
  const dispatch = useDispatch();
  const { list, total, loading, error } = useSelector((state) => state.hotels);

  const [input, setInput] = useState({ title: '', minPrice: '', maxPrice: '' });
  const [filters, setFilters] = useState({ title: '', minPrice: '', maxPrice: '' });
  const [page, setPage] = useState(1);

  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const loadHotels = () => {
    dispatch(
      fetchHotels({
        ...filters,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })
    );
  };

  useEffect(() => {
    loadHotels();
  }, [filters, page]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setFilters(input);
  };

  const resetFilters = () => {
    const empty = { title: '', minPrice: '', maxPrice: '' };
    setInput(empty);
    setFilters(empty);
    setPage(1);
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteHotel(hotelToDelete.id));
    setHotelToDelete(null);

    if (deleteHotel.fulfilled.match(result)) {
      setShowSuccess(true);
      if (list.length === 1 && page > 1) setPage(page - 1);
      else loadHotels();
    }
  };

  return (
    <>
      <Helmet>
        <title>Hotels | HotelHub</title>
        <meta name="description" content="Browse hotels, compare prices per night and find the right place to stay." />
      </Helmet>

      <section className="hero">
        <div className="container">
          <h1>Hotels</h1>
          <p className="breadcrumb">Home &gt; Hotels</p>
        </div>
      </section>

      <main className="container list-layout">
        <aside className="filters">
          <form onSubmit={applyFilters}>
            <h2>Filter</h2>

            <div className="form-group">
              <label htmlFor="search">Hotel name</label>
              <input
                id="search"
                name="title"
                value={input.title}
                onChange={handleChange}
                placeholder="Search by title"
              />
            </div>

            <div className="form-group">
              <label>Price per night (₹)</label>
              <div className="price-inputs">
                <input
                  name="minPrice"
                  type="number"
                  min="0"
                  value={input.minPrice}
                  onChange={handleChange}
                  placeholder="Min"
                  aria-label="Minimum price"
                />
                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  value={input.maxPrice}
                  onChange={handleChange}
                  placeholder="Max"
                  aria-label="Maximum price"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Search
            </button>
            <button type="button" className="btn btn-outline btn-block" onClick={resetFilters}>
              Reset
            </button>
          </form>
        </aside>

        <section className="list-area">
          <div className="list-top">
            <p>
              <strong>{total}</strong> {total === 1 ? 'hotel' : 'hotels'} found
            </p>
            <Link to="/hotels/add" className="btn btn-primary">
              + Add hotel
            </Link>
          </div>

          {loading && <p className="empty">Loading hotels...</p>}
          {error && <p className="error-box">{error.join(', ')}</p>}

          {!loading && !error && list.length === 0 && (
            <div className="empty">
              <p>No hotels match your search.</p>
              <Link to="/hotels/add">Add the first one</Link>
            </div>
          )}

          {!loading && list.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} onDelete={setHotelToDelete} />)}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </main>

      {hotelToDelete && (
        <Popup title="Delete hotel?" message={`"${hotelToDelete.title}" will be removed permanently.`}>
          <button className="btn btn-outline" onClick={() => setHotelToDelete(null)}>
            Cancel
          </button>
          <button className="btn btn-danger-solid" onClick={confirmDelete}>
            Delete
          </button>
        </Popup>
      )}

      {showSuccess && (
        <Popup title="Deleted" message="The hotel was deleted successfully.">
          <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>
            OK
          </button>
        </Popup>
      )}
    </>
  );
}

export default HotelList;
