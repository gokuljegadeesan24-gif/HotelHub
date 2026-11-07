import { Link } from 'react-router-dom';
import { imageUrl, formatPrice } from '../api';

function HotelCard({ hotel, onDelete }) {
  const snippet = hotel.description.length > 120 ? hotel.description.slice(0, 120) + '...' : hotel.description;

  return (
    <div className="hotel-card">
      <Link to={`/hotels/${hotel.id}`} className="hotel-card-image">
        <img src={imageUrl(hotel.image)} alt={`${hotel.title} - hotel photo`} />
      </Link>

      <div className="hotel-card-body">
        <Link to={`/hotels/${hotel.id}`}>
          <h3>{hotel.title}</h3>
        </Link>
        <p className="coords">
          {Number(hotel.latitude).toFixed(4)}, {Number(hotel.longitude).toFixed(4)}
        </p>
        <p className="snippet">{snippet}</p>
      </div>

      <div className="hotel-card-side">
        <div>
          <p className="price">{formatPrice(hotel.price)}</p>
          <p className="per-night">per night</p>
        </div>
        <div className="card-actions">
          <Link to={`/hotels/${hotel.id}`} className="btn btn-primary">
            View
          </Link>
          <Link to={`/hotels/${hotel.id}/edit`} className="btn btn-outline">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={() => onDelete(hotel)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
