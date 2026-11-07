import { useState } from 'react';
import { imageUrl } from '../api';

const emptyForm = { title: '', description: '', latitude: '', longitude: '', price: '' };

function HotelForm({ initialData, onSubmit, submitting }) {
  const [values, setValues] = useState(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          price: initialData.price,
        }
      : emptyForm
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData ? imageUrl(initialData.image) : '');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const err = {};
    const lat = Number(values.latitude);
    const lng = Number(values.longitude);

    if (!values.title.trim()) err.title = 'Title is required';
    else if (values.title.trim().length < 3) err.title = 'Title must be at least 3 characters';

    if (!values.description.trim()) err.description = 'Description is required';
    else if (values.description.trim().length < 10) err.description = 'Description must be at least 10 characters';

    if (values.latitude === '') err.latitude = 'Latitude is required';
    else if (isNaN(lat) || lat < -90 || lat > 90) err.latitude = 'Latitude must be between -90 and 90';

    if (values.longitude === '') err.longitude = 'Longitude is required';
    else if (isNaN(lng) || lng < -180 || lng > 180) err.longitude = 'Longitude must be between -180 and 180';

    if (values.price === '') err.price = 'Price is required';
    else if (Number(values.price) <= 0) err.price = 'Price must be greater than 0';

    if (!imageFile && !initialData) err.image = 'Please upload an image';
    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) err.image = 'File must be an image';
      else if (imageFile.size > 2 * 1024 * 1024) err.image = 'Image must be smaller than 2MB';
    }

    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    if (imageFile) formData.append('image', imageFile);

    onSubmit(formData);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Hotel image</label>
        <div className="image-upload">
          {preview ? (
            <img src={preview} alt="Hotel preview" />
          ) : (
            <div className="image-placeholder">No image selected</div>
          )}
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>
        {errors.image && <span className="error-text">{errors.image}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} placeholder="Hotel name" />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          value={values.description}
          onChange={handleChange}
          placeholder="Tell guests about the hotel"
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            value={values.latitude}
            onChange={handleChange}
            placeholder="13.0827"
          />
          {errors.latitude && <span className="error-text">{errors.latitude}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            value={values.longitude}
            onChange={handleChange}
            placeholder="80.2707"
          />
          {errors.longitude && <span className="error-text">{errors.longitude}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="price">Price per night (₹)</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={values.price}
          onChange={handleChange}
          placeholder="2500"
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
        {submitting ? 'Saving...' : initialData ? 'Save changes' : 'Add hotel'}
      </button>
    </form>
  );
}

export default HotelForm;
