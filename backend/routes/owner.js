const router = require('express').Router();
const { auth, authorize } = require('./auth');
const db = require('../db');

// Protect all owner routes
router.use(auth);
router.use(authorize(['Store Owner']));

// Get users who have submitted ratings for the owner's store(s)
router.get('/my-store-ratings', async (req, res) => {
    const ownerId = req.user.id;

    try {
        const [ratingsRows] = await db.query(
            `SELECT DISTINCT u.id AS user_id, u.name AS user_name, u.email AS user_email, r.rating, r.created_at, s.name AS store_name
             FROM users u
             JOIN ratings r ON u.id = r.user_id
             JOIN stores s ON r.store_id = s.id
             WHERE s.owner_id = ?
             ORDER BY r.created_at DESC`,
            [ownerId]
        );
        res.status(200).json(ratingsRows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get average rating for the owner's store(s)
router.get('/my-store-average-rating', async (req, res) => {
    const ownerId = req.user.id;

    try {
        const [averageRatingRows] = await db.query(
            `SELECT AVG(r.rating) AS average_rating
             FROM ratings r
             JOIN stores s ON r.store_id = s.id
             WHERE s.owner_id = ?`,
            [ownerId]
        );
        res.status(200).json({ average_rating: averageRatingRows[0].average_rating || null });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
