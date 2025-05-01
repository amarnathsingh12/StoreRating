import express from 'express';
import Store from '../models/store.model.js';
import Rating from '../models/rating.model.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /stores - Get store list
router.get('/', authMiddleware, async (req, res) => {
    try {
        const stores = await Store.find().populate('owner', 'name email');
        const ratings = await Rating.find();

        const enriched = stores.map(store => {
            const storeRatings = ratings.filter(r => r.store.toString() === store._id.toString());
            const avg = storeRatings.length ? storeRatings.reduce((a, r) => a + r.rating, 0) / storeRatings.length : 0;
            const userRating = storeRatings.find(r => r.user.toString() === req.user.userId);

            return {
                ...store.toObject(),
                storeRatings,
                averageRating: Number(avg.toFixed(1)),
                userRating: userRating?.rating || null
            };
        });

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /stores/:id/rate - Submit rating
router.post('/:id/rate', authMiddleware, async (req, res) => {
    const { rating } = req.body;
    const storeId = req.params.id;

    try {
        const existing = await Rating.findOne({ user: req.user.userId, store: storeId });
        if (existing) return res.status(400).json({ message: 'Already rated. Use PUT to modify.' });

        const newRating = new Rating({ user: req.user.userId, store: storeId, rating });
        await newRating.save();
        res.status(201).json({ message: 'Rating submitted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /stores/:id/rate - Modify rating
router.put('/:id/rate', authMiddleware, async (req, res) => {
    const { rating } = req.body;
    const storeId = req.params.id;

    try {
        const updated = await Rating.findOneAndUpdate(
            { user: req.user.userId, store: storeId },
            { rating },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Rating not found.' });

        res.json({ message: 'Rating updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
