const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CommunitySchema = new Schema({
    name: {
        type: String,
        // required: true
        
    },
    id: {
        type: String,
        // required: true
    },
    description: {
        type: String,
    },
})

mongoose.model('communities', CommunitySchema)