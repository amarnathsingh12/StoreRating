import express from 'express';
import User from '../models/user.model.js';
import Store from '../models/store.model.js';
import Rating from '../models/rating.model.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to ensure admin access
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied.' });
    next();
};

// GET /admin/store-owners
router.get('/store-owners', authMiddleware, requireAdmin, async (req, res) => {
  try {
      const owners = await User.find({ role: 'Store Owner' }, '_id name email');
      res.json({ success: true, owners });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message });
  }
});


// GET /admin/dashboard
router.get('/dashboard', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const stores = await Store.countDocuments();
        const ratings = await Rating.countDocuments();
        res.json({ users, stores, ratings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /admin/stores
router.get('/stores', authMiddleware, requireAdmin, async (req, res) => {
    try {
      const stores = await Store.find().lean();
  
      // Get all ratings related to the listed stores
      const ratings = await Rating.find({ store: { $in: stores.map(s => s._id) } }).lean();
  
      // Group ratings by store
      const ratingMap = {};
      ratings.forEach(r => {
        const key = r.store.toString();
        ratingMap[key] = ratingMap[key] || [];
        ratingMap[key].push(r.rating);
      });
  
      // Format final result
      const result = stores.map(store => {
        const storeRatings = ratingMap[store._id.toString()] || [];
        const avg = storeRatings.reduce((a, b) => a + b, 0) / (storeRatings.length || 1);
  
        return {
          name: store.name,
          email: store.email || 'N/A',
          address: store.address,
          rating: storeRatings.length ? avg.toFixed(1) : 'N/A'
        };
      });
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// GET /admin/users
router.get('/users', authMiddleware, requireAdmin, async (req, res) => {
    try {
      const users = await User.find({}, 'name email address role').lean();
      const storeOwners = users.filter(user => user.role === 'Store Owner');
  
      // Get all Store Owner user IDs
      const ownerIds = storeOwners.map(user => user._id);
      const stores = await Store.find({ owner: { $in: ownerIds } }).lean();
  
      // Get ratings for the owners' stores
      const storeIds = stores.map(store => store._id);
      const ratings = await Rating.find({ store: { $in: storeIds } }).lean();
  
      // Group ratings by owner
      const ownerRatingMap = {};
  
      stores.forEach(store => {
        const ownerId = store.owner.toString();
        const storeRatings = ratings.filter(r => r.store.toString() === store._id.toString()).map(r => r.rating);
  
        if (!ownerRatingMap[ownerId]) ownerRatingMap[ownerId] = [];
  
        ownerRatingMap[ownerId].push(...storeRatings);
      });
  
      // Build final result with optional rating for store owners
      const result = users.map(user => {
        const base = {
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
        };
  
        if (user.role === 'Store Owner') {
          const ratings = ownerRatingMap[user._id.toString()] || [];
          const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
          base.rating = avg;
        }
  
        return base;
      });
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// POST /admin/users
router.post('/users', authMiddleware, requireAdmin, async (req, res) => {
    const { name, email, password, address, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists.' });

        const newUser = new User({ name, email, password, address, role });
        await newUser.save();
        res.status(201).json({ message: 'User added.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /admin/stores
router.post('/stores', authMiddleware, requireAdmin, async (req, res) => {
    const { name, email, address, ownerId } = req.body;
    try {
        const newStore = new Store({ name, email, address, owner: ownerId });
        await newStore.save();
        res.status(201).json({ success: 'Store added.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
