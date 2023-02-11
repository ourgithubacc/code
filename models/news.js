const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    title:{
        type: String
    },
    content:{
        type: String
    },
    addedAt: {
        type: Date
    },
    campus: {
        type: String,
        required: true
    },
    images:{
        type: Array
    }
})


module.exports = mongoose.model('News',newsSchema);
