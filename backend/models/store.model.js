import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 60
    },
    email: {
        type: String,
        match: [/.+@.+\..+/, 'Invalid email address']
    },
    address: {
        type: String,
        required: true,
        maxlength: 400
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;
