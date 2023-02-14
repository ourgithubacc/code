const News = require('../models/news')
const cloudinary = require('cloudinary').v2
const upload = require('../controllers/multer')
const fs = require('fs')
//const Category = require('../models/category')
const moment = require('moment')



let dateOfExpire = moment(new Date()).add(2, 'w').toDate();
//@desc -> add news
exports.addNews = async (req, res) =>{
    try {

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUDNAME,
            api_key: process.env.CLOUDINARY_APIKEY,
            api_secret: process.env.CLOUDINARY_APISECRET
          });
        const {title,campus, content} = req.body;
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
        
              const news = await new News({
                title, campus, content, images: urls,addedAt: Date.now()
            }).save();

            res.status(200).json({
                success: true,
                data: news
    
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
              const news = await new News({
                title, campus, images: result.secure_url,addedAt: Date.now()
            }).save();
    
            res.status(200).json({
                success: true,
                data: news
    
            })
        }
      
     
     
} catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            msg:"Internal Error"
        })
    }
}
//@desc fetch all news

exports.getAllNews = async (req,res,next) =>{
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


        function isexpired (){
            if(dateOfExpire > Date.now()){
                return false
            } else {
                return true
            }
            
         }

         let result = isexpired()
        // console.log(result)
         
         await News.find({}).updateMany({
            isExpired: isexpired()
        })

        //await News.find({}).deleteMany({isExpired: true})

    const news = await News.find({isExpired:false})
         .sort('-addedAt')
         //.populate({ path: 'category', select: ['_id', 'category_name'] })
         .limit(Number(query.limit))
         .skip(Number(query.skip))
        
        res.json({
            success: true,
            count: news.length,
            data: news
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        })
    }
}

exports.getNews = async (req,res,next) =>{
    try {

        const {title} = req.body
        const theNews = await News.findOne({title:title},(err,title)=>{
            if(err || !title){
                console.log(err)
                res.status(403).json({
                    success:false,
                    message:"Incorrect News Title.Please input the right title"
                })
            }
        })
        const news = await News.findById(theNews._id)
         .sort('-addedAt')
         //.populate({ path: 'category', select: ['_id', 'category_name'] })

         res.json({
            success: true,
            data: news
         })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        })
    }
}

exports.getMainCampusNews = async (req,res, next)=>{
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

    
        const news = await News.find({campus:"Main" || "Both"})
         .sort('-addedAt')
         //.populate({ path: 'category', select: ['_id', 'category_name'] })
         .limit(Number(query.limit))
         .skip(Number(query.skip))

    
    res.status(200).json({
        count: news.length,
        data: news
    })
    
} catch(error){
    console.log(error)
    res.status(500).json({
        success: false,
        msg: "Internal Error Ocurred"
    })
}
}


exports.getIperuCampusNews = async (req,res, next)=>{
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

    
        const news = await News.find({campus:"Iperu" || "Both"})
         .sort('-addedAt')
        // .populate({ path: 'category', select: ['_id', 'category_name'] })
         .limit(Number(query.limit))
         .skip(Number(query.skip))

        res.status(200).json({
            count: news.length,
            data: news
        })
    
} catch(error){
    res.status(500).json({
        success: false,
        msg: "Internal Error Ocurred"
    })
}
}
// getSliderNews
exports.getSliderNews = async (req,res,next) =>{
    try {
        const news = await News.find({ addToSlider: true })
         //.populate({ path: 'category', select: ['_id', 'category_name'] })

         res.json({
            success: true,
            count: news.length,
            data: news
         })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        })
    }
}

// exports.getNewsByCategory = async (req,res,next) =>{
//     try {
//         const {category_name} = req.body
//         const category = await Category.findOne({category_name: category_name})
//         const news = await News.find({ category: category._id })
//          .populate({ path: 'category', select: ['_id', 'category_name'] })

//          res.json({
//             success: true,
//             count: news.length,
//             data: news
//          }) 
        
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             msg: 'Internal Error Occured'
//         })
//     }
// }

exports.deleteNews = async (req,res,next) =>{
    try {
        const {title} = req.body
        const theNews = await News.findOne({title:title},(err,title)=>{
            if(err || !title){
                console.log(err)
                res.status(403).json({
                    success:false,
                    message:"Incorrect News Title.Please input the right title"
                })
            }
        })
        const news = await News.findByIdAndDelete(theNews._id);
        

        res.json({
            success: true,
            msg:"Successfully Deleted",
            data: news
        });

        if(!news){
            res.json({
                success: false,
                msg: "News not found"
            });
        }
        
    } catch (error) {
        
            res.status(500).json({
                success: false,
                msg: 'Internal Error Occured'
            })
    }
}

exports.updateNews = async (req,res,next) =>{
    try {

        const {title} = req.body
        const theNews = await News.findOne({title:title},(err,title)=>{
            if(err||!title){
                console.log(err)
                res.status(403).json({
                    success:false,
                    message:"Invalid Title.Please Input the correct title"
                })
            }
        })
        const news = await News.findByIdAndUpdate(theNews._Id, req.body, {
            new: true,
            runValidators: true
        });
       

        res.status(201).json({
            success: true,
            msg:"Successfully Updated",
            data: news
        });

        if(!news){
            res.status(401).json({
                success: false,
                msg: "News not found"
            });
        }
        
    } catch (error) {
        console.log(error)
        
        res.status(500).json({
            success: false,
            msg: 'Internal Error Occured'
        })
    }
}

exports.deleteAllNews = async (req,res) =>{
    try {
        await News.find({}).deleteMany({})

        res.status(200).json({
            success: true,
            message: "Successfully Deleted all news"
        })
    } catch (error) {
        console.log(error)
        
    }
}
exports.deleteAllMainNews = async (req,res) =>{
    try {
        await News.find({campus: "Main"}).deleteMany({})

        res.status(200).json({
            success: true,
            message: "Successfully Deleted all Main Campus News"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message:"Internal Error Occured"
        })
        
    }
}

exports.deleteAllIperuNews = async (req,res) =>{
    try {
        await News.find({campus: "Iperu"}).deleteMany({})

        res.status(200).json({
            success: true,
            message: "Successfully Deleted all Main Iperu News"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message:"Internal Error Occured"
        })
        
    }
}






