import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchHotel, clearCurrent } from '../store/hotelSlice';
import { imageUrl, formatPrice } from '../api';
import MapView from '../components/MapView';

function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: hotel, loading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotel(id));
    return () => dispatch(clearCurrent());
  }, [id]);

  if (loading || (!hotel && !error)) return <p className="empty">Loading...</p>;
  if (error) {
    return (
      <div className="empty">
        <p>{error.join(', ')}</p>
        <Link to="/">Back to hotels</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{hotel.title} | HotelHub</title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:image" content={imageUrl(hotel.image)} />
      </Helmet>

      <section className="hero">
        <div className="container">
          <h1>Hotel details</h1>
          <p className="breadcrumb">
            <Link to="/">Hotels</Link> &gt; {hotel.title}
          </p>
        </div>
      </section>

      <main className="container detail">
        <div className="detail-image">
          <img src={imageUrl(hotel.image)} alt={`${hotel.title} - main photo`} />
        </div>

        <div className="detail-card">
          <h2>{hotel.title}</h2>
          <p className="price">{formatPrice(hotel.price)}</p>
          <p className="per-night">per night</p>
          <div className="card-actions">
            <Link to={`/hotels/${hotel.id}/edit`} className="btn btn-primary">
              Edit hotel
            </Link>
            <Link to="/" className="btn btn-outline">
              Back
            </Link>
          </div>
        </div>

        <div className="detail-about">
          <h3>About this hotel</h3>
          <p>{hotel.description}</p>
        </div>

        <div className="detail-map">
          <h3>Location</h3>
          <MapView latitude={hotel.latitude} longitude={hotel.longitude} title={hotel.title} />
        </div>
      </main>
    </>
  );
}

export default HotelDetail;
