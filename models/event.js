const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    content:{
        type: String,
        required: true,
        trim:true
    },
    addedAt:{
        type: Date
    },
    campus: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: String,
        trim: true,
        required: true
    },
    images:{
        type: Array,
        trim: true,
        required: true
    },
    venue:{
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: Date,
        trim:true
    },
    time:{
     type:String,
        trim:true
    },
    endDate:{
        type: String,
        trim:true
    },
    endTime:{
        type: String,
        trim:true
    },
    isElasped:{
        type:Boolean,
        trim:true
    }
    
})

module.exports = mongoose.model('Event', eventSchema);
