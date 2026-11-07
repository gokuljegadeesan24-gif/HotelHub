import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchHotel, saveHotel, clearCurrent } from '../store/hotelSlice';
import HotelForm from '../components/HotelForm';
import Popup from '../components/Popup';

function HotelFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.hotels);

  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchHotel(id));
    return () => dispatch(clearCurrent());
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setServerErrors([]);
    const result = await dispatch(saveHotel({ id, formData }));
    setSubmitting(false);

    if (saveHotel.fulfilled.match(result)) setSaved(true);
    else setServerErrors(result.payload || ['Something went wrong']);
  };

  const pageTitle = isEdit ? 'Edit hotel' : 'Add hotel';

  return (
    <>
      <Helmet>
        <title>{pageTitle} | HotelHub </title>
        <meta name="description" content="Add or update hotel details." />
      </Helmet>

      <section className="hero">
        <div className="container">
          <h1>{pageTitle}</h1>
          <p className="breadcrumb">Home &gt; Hotels &gt; {pageTitle}</p>
        </div>
      </section>

      <main className="container form-page">
        {serverErrors.length > 0 && (
          <div className="error-box">
            {serverErrors.map((msg) => (
              <p key={msg}>{msg}</p>
            ))}
          </div>
        )}

        {isEdit && !current ? (
          <p className="empty">Loading...</p>
        ) : (
          <HotelForm initialData={isEdit ? current : null} onSubmit={handleSubmit} submitting={submitting} />
        )}
      </main>

      {saved && (
        <Popup title="Saved" message={isEdit ? 'Hotel updated successfully.' : 'Hotel added successfully.'}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to hotels
          </button>
        </Popup>
      )}
    </>
  );
}

export default HotelFormPage;
