const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim:true
    },
    addedAt:{
        type: Date,
        //required: true
    },
    eventImage:{
        type: String,
        //required: true
    },
    host_name: {
        type: String,
        //ref:'Host',
       // required: true
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
    data:{
    type: Array,
    trim: true,
    required: true
    },
    venue:{
        type: String,
        required: true,
        trim: true
    },
    // time:{
    //     type: String,
    //     trim: true,
    //     required: true
    // },
    url:{
        type:Object
    },
    startDateAndTime:{
        type: Date,
        trim:true
    },
    endDateAndTime:{
        type: Date,
        trim:true
    },
    isElasped:{
        type:Boolean,
        trim:true
    }


    
})

module.exports = mongoose.model('Event', eventSchema);
