const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const upload = require('../middleware/upload');
const validateHotel = require('../middleware/validate');

const router = express.Router();

const deleteImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '..', imagePath);
  fs.unlink(fullPath, () => {});
};

router.get('/', async (req, res) => {
  try {
    const { title = '', minPrice, maxPrice } = req.query;
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 0;

    const conditions = ['title ILIKE $1'];
    const values = [`%${title}%`];

    if (minPrice) {
      values.push(minPrice);
      conditions.push(`price >= $${values.length}`);
    }
    if (maxPrice) {
      values.push(maxPrice);
      conditions.push(`price <= $${values.length}`);
    }

    const where = 'WHERE ' + conditions.join(' AND ');

    const countResult = await pool.query(`SELECT COUNT(*) FROM hotels ${where}`, values);

    const listValues = [...values, limit, offset];
    const list = await pool.query(
      `SELECT * FROM hotels ${where}
       ORDER BY id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );

    res.json({ total: parseInt(countResult.rows[0].count), hotels: list.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Hotel not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', upload.single('image'), validateHotel, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ errors: ['Image is required'] });

    const { title, description, latitude, longitude, price } = req.body;
    const imagePath = 'uploads/' + req.file.filename;

    const result = await pool.query(
      `INSERT INTO hotels (title, description, image, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title.trim(), description.trim(), imagePath, latitude, longitude, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', upload.single('image'), validateHotel, async (req, res) => {
  try {
    const old = await pool.query('SELECT image FROM hotels WHERE id = $1', [req.params.id]);
    if (old.rows.length === 0) return res.status(404).json({ message: 'Hotel not found' });

    const { title, description, latitude, longitude, price } = req.body;

    let imagePath = old.rows[0].image;
    if (req.file) {
      deleteImage(imagePath);
      imagePath = 'uploads/' + req.file.filename;
    }

    const result = await pool.query(
      `UPDATE hotels
       SET title = $1, description = $2, image = $3, latitude = $4, longitude = $5, price = $6
       WHERE id = $7 RETURNING *`,
      [title.trim(), description.trim(), imagePath, latitude, longitude, price, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING image', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Hotel not found' });

    deleteImage(result.rows[0].image);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
