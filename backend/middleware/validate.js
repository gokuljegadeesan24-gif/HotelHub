module.exports = function validateHotel(req, res, next) {
  const { title, description, latitude, longitude, price } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters');
  if (!description || description.trim().length < 10) errors.push('Description must be at least 10 characters');
  if (latitude === undefined || latitude === '' || isNaN(latitude) || latitude < -90 || latitude > 90)
    errors.push('Latitude must be between -90 and 90');
  if (longitude === undefined || longitude === '' || isNaN(longitude) || longitude < -180 || longitude > 180)
    errors.push('Longitude must be between -180 and 180');
  if (price === undefined || price === '' || isNaN(price) || Number(price) <= 0)
    errors.push('Price must be greater than 0');

  if (errors.length > 0) return res.status(400).json({ errors });
  next();
};
