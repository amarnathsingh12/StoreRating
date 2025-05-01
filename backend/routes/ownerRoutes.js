// routes/ownerRoutes.js
import express from 'express';
import Rating from '../models/rating.model.js';
import Store from '../models/store.model.js';
// import User from '../models/user.model.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /owner/ratings
router.get('/ratings', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Store Owner') return res.status(403).json({ message: 'Access denied.' });

        const stores = await Store.find({ owner: req.user.userId });
        const storeIds = stores.map(s => s._id);

        const ratings = await Rating.find({ store: { $in: storeIds } }).populate('user', 'name email');
        const avgRating = ratings.length
            ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            : 0;

        res.json({
            averageRating: avgRating,
            ratings: ratings.map(r => ({
                user: r.user,
                storeId: r.store,
                rating: r.rating
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /owner/stores
router.get('/stores', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Store Owner') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const stores = await Store.find({ owner: req.user.userId });

        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
