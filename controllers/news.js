const News = require('../models/news')
const cloudinary = require('../controllers/cloudinary')
const upload = require('../controllers/multer')
const fs = require('fs')
//const Category = require('../models/category')
const moment = require('moment')


let dateOfExpire = moment(new Date()).add(2, 'w').toDate();
//@desc -> add news
exports.addNews = async (req, res) =>{
    try {
        upload.array('newsImage') 
        const uploader = async (path) => await cloudinary.uploads(path,'Images')

        if(req.method === 'POST'){
         
            const urls = []
            let url;
      
            const files = req.files.newsImage
        if (files.length > 1){
    
  
            for(const file of files){
                const { path } = file
          
          
                const newPath = await uploader(path)
          
          
                urls.push(newPath)
          
                fs.unlinkSync(path)
              }
        } else{
            
            const { path } = req.files.newsImage
          
          
            const newPath = await uploader(path)
      
            //url = newPath
            
            urls.push(newPath)
      
            fs.unlinkSync(path)
        }
      
          const {title,category, campus} = req.body;
         
         
          const news = await new News({
            title, category, campus, data: urls ,addedAt: Date.now(), expiryDate: dateOfExpire
        }).save();
      
        if(news) {
            res.status(201).json({
                success:true,
                msg:"Successfully added new",
                data: news
            })
          }
    
        } else{
          res.status(405).json({
            err: 'News not Uploaded succesfully'
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






