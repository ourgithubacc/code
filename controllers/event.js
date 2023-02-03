const Event = require('../models/event');

const sendToAll = require('../helper/notification');
const cloudinary = require('../controllers/cloudinary')
const upload = require('../controllers/multer')
const fs = require('fs')
const sendEmail = require('../helper/sendEmail')

//const Imagetobase64 = require('image-to-base64')
exports.uploadEvent = async (req,res,next) =>{
    try {
        const {title, description, addedAt,host, campus, ticketPrice, venue, startDateAndTime, endDateAndTime} = req.body;
        upload.array('eventImage') 
        const uploader = async (path) => await cloudinary.uploads(path,'Images')

        if(req.method === 'POST'){
         
            const urls = []
            let url;
      
            const files = req.files.eventImage
        if (files.length > 1){
    
  
            for(const file of files){
                const { path } = file
          
          
                const newPath = await uploader(path)
          
          
                urls.push(newPath)
          
                fs.unlinkSync(path)
              }
        } else{
            
            const { path } = req.files.eventImage
          
          
            const newPath = await uploader(path)
      
            //url = newPath
            
            urls.push(newPath)
      
            fs.unlinkSync(path)
        }
      

        const event = await new Event({
            title, description,campus,ticketPrice, host, venue,addedAt,startDateAndTime,endDateAndTime, data: urls,addedAt: Date.now(), 
        }).save();

        if(event) {
            res.status(201).json({
                success:true,
                msg:"Successfully added new Event",
                data: event
            });
            
            
        } else {
            res.status(400).json({
                success: false,
                msg:"Invalid Event Data"
            });
        }
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
        //.populate({ path: 'host', select: ['_id', 'host_name'] })

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


// exports.getEventsByHost = async (req,res,next) =>{
//     try {
//         const {host_name} = req.body
//         const event = await Event.findOne({host:host_name},(err,host_name)=>{
//             if(err || !title){
//                 console.log(err);
//                 return res.status(403).json({
//                     error: err
//                 })
//             }
//         })
//          .populate({ path: 'host', select: ['_id', 'host_name'] })

//          res.json({
//             success: true,
//             count: event.length,
//             data: event
//          });
        
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             msg: 'Internal Error Occured'
//         });
//     }
// }

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

    
      
         
    const events = await Event.find({campus: 'Main' || 'Both'})
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

    
      
         
    const events = await Event.find({campus: 'Main' || 'Both'})
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
         await Event.find({}).remove({})
        //Event.remove({})
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error)
        
    }
}
// 
// 
