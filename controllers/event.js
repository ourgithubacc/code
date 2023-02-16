const Event = require('../models/event');
const sendToAll = require('../helper/notification');
const fs = require('fs')
const sendEmail = require('../helper/sendEmail')
const cloudinary = require('cloudinary').v2
require('dotenv').config()
//const Imagetobase64 = require('image-to-base64')
exports.uploadEvent = async (req,res,next) =>{
    try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUDNAME,
                api_key: process.env.CLOUDINARY_APIKEY,
                api_secret: process.env.CLOUDINARY_APISECRET
            });

    const {title, content, campus, ticketPrice, venue, date, time, endDate, endTime} = req.body;
    const image = req.files.image
    let  urls = []

    if(image.length > 1){
        let images = []
        let x = image.length
        for(let i = 0; i < x; i++){
            images.push(image[i].path)
        }

        let y = images.length
        for(let i = 0; i < y; i++ ){
          await  cloudinary.uploader.upload(
                images[i],
                { upload_preset: 'BUSA_NEWS_IMAGE' },
                function(error, result) {
                    if(error){
                        console.log(error)
                    }

                    urls.push(result.secure_url)
                }
            );

        }
    
        const event = await new Event({
            title,ticketPrice,content,venue, images: urls, addedAt: Date.now(), campus, date, time, endDate, endTime
        }).save()

        res.status(200).json({
            success: true,
            data: event

        })

    } else{
        const result = await   cloudinary.uploader.upload(
            image.path,
            { upload_preset: 'BUSA_NEWS_IMAGE' },
            function(error, result) {
                if(error){
                    console.log(error);
                }
            }
          );
       
            const event = await new Event({
                title,ticketPrice,content,venue, images: result.secure_url, addedAt: Date.now(), campus, date, time, endDateAndTime
            }).save()
        res.status(200).json({
            success: true,
            data: event

        })
    }
  
   }  catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg:"Internal Error",
        });
    }
}
exports.getAllEvents = async (req,res,next) =>{
    try {
        
        const size = req.params.pageSize;
        const pageNo = req.params.pageNo;

        var query = {};

        if(pageNo < 0 || pageNo === 0){
            return res.status(401).json({
                success: false,
                msg:'Invalid page number, should start with 1'
            })
        }

        query.skip = size * (pageNo - 1);
        query.limit = size;

        const event = await Event.find({})
        .sort('-addedAt')
        .populate({ path: 'category', select: ['_id', 'category_name'] })
        .limit(Number(query.limit))
        .skip(Number(query.skip))
        
        if(event.endDateAndTime < Date.now()){
            await Event.find({}).updateMany({
                isElasped:true
            })
        } else{
            await Event.find({}).updateMany({
                isElasped: false
            })
        }

        const allEvents = await Event.find({isElasped:false})
        
        res.json({
            success: true,
            count: allEvents.length,
            data: allEvents
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        });
    }
}


exports.getEventByTitle = async (req,res,next) =>{
    try {

        const {title} = req.body
        const event = await Event.findOne({title:title},(err,title)=>{
            if(err || !title){
                console.log(err);
                return res.status(403).json({
                    error: err
                })
            }
        })
         .sort('-addedAt')

         res.json({
            success: true,
            data: event
         });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        });
    }
}



exports.deleteEvent = async (req,res,next) =>{
    try {
        const {title} = req.body
         await Event.findOne({title:title},(err,title)=>{
            if(err||!title){
                console.log(err);
                return res.status(403).json({
                    success:false,
                    message:"Error Occured"
                })
            }
        }).remove()


       
        

        res.json({
            success: true,
            msg:"Successfully Deleted",
        });

        
    } catch (error) {
        
            res.status(500).json({
                success: false,
                msg: 'Internal Error Occured'
            });
    }
}


exports.updateEvent = async (req,res,next) =>{
    try {

        const {title, data} = req.body
        const theEvent = await Event.findOne({title:title},(err,title)=>{
            if(err||!title){
                console.log(err);
                return res.status(403).json({
                    success:false,
                    message:"Error Occured"
                })
            }
        })
        
        const event = await Event.findByIdAndUpdate(theEvent._id,data , {
            new: true,
            runValidators: true
        });
       

        res.status(201).json({
            success: true,
            msg:"Successfully Updated",
            data: event
            
        });

        if(!event){
            res.status(401).json({
                success: false,
                msg: "Event not found"
            });
            //sendToAll(parameters) 
        }
        
    } catch (error) {
        console.log(error)
        
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        });
    }
}


exports.getIperuCampusEvents = async (req,res, next)=>{
    try{
        const size = req.params.pageSize;
        const pageNo = req.params.pageNo;

        var query = {};

        if(pageNo < 0 || pageNo === 0){
            return res.status(401).json({
                success: false,
                msg:'Invalid page number, should start with 1'
            })
        }

        query.skip = size * (pageNo - 1);
        query.limit = size;

    
      
         
    const events = await Event.find({campus: 'Iperu'})
         .sort('-addedAt')
         .limit(Number(query.limit))
         .skip(Number(query.skip))

        res.status(200).json({
            count: events.length,
            data: events
        })
    
    
} catch(error){
    console.log(error)
    res.status(500).json({
        success: false,
        msg: "Internal Error Ocurred"
    })
}
}


exports.getMainCampusEvent = async (req,res, next)=>{
    try{
        const size = req.params.pageSize;
        const pageNo = req.params.pageNo;

        var query = {};

        if(pageNo < 0 || pageNo === 0){
            return res.status(401).json({
                success: false,
                msg:'Invalid page number, should start with 1'
            })
        }

        query.skip = size * (pageNo - 1);
        query.limit = size;

    
    
         
    const events = await Event.find({campus: "Main"})
         .sort('-addedAt')
         .populate({ path: 'category', select: ['_id', 'category_name'] })
         .limit(Number(query.limit))
         .skip(Number(query.skip))

        res.status(200).json({
            count: events.length,
            data: events
        })
    
} catch(error){
    res.status(500).json({
        success: false,
        msg: "Internal Error Ocurred"
    })
}
}

exports.deleteAllMainCampusEvent = async (req,res) =>{
    try {
        await Event.find({campus:"Main"}).remove({})

        res.status(200).json({
            success: true,
            message: "Deleted all Main Campus Events"
        })
    } catch (error) {
        console.log(error)
    }
}

exports.deleteAllIperuCampusEvent = async (req,res) =>{
    try {
        await Event.find({campus:"Iperu"}).remove({})

        res.status(200).json({
            success: true,
            message: "Deleted all Iperu Campus Events"
        })
    } catch (error) {
        console.log(error)
    }
}

exports.deleteAll = async (req,res)=>{
    try {
         await Event.find({}).deleteMany({})
        //Event.remove({})
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error)
        
    }
}
