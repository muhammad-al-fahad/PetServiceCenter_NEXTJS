import ConnectDB from "../../../utils/mongodb";
import Products from '../../../model/product';
import auth from '../../../middleware/auth'

ConnectDB()

const ProductId = async (req, res) => {
    switch(req.method){
         case 'GET':
            await getProductID(req, res)
            break;
         case 'PUT':
            await updateProduct(req, res)
            break;
         case 'DELETE':
               await delProduct(req, res)
               break; 
    }
}

const getProductID = async (req, res) => {
     try{
        const {id} = req.query;
        const product = await Products.findById(id)
        if(!product)
           return res.status(400).json({err: "This Product is not exist"})

        res.json({product})
     }
     catch(err){
        return res.status(500).json({err: err.message})
     }
}

const updateProduct = async (req, res) => {
   try{
      const result = await auth(req, res)
      if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

      const {id} = req.query
      const {title, price, inStock, description, content, categories, image} = req.body 

      if(!title || !price || !inStock || !description || !content || categories === 'all' || image.length === 0)
         return res.status(400).json({err: "Please fill all the fields"})

      await Products.findOneAndUpdate({_id: id}, {
         title: title.toLowerCase(), price, inStock, description, content, category: categories, images: image
      })

      res.json({msg: "Success! Updated a current Product"})

   }
   catch(err){
      return res.status(500).json({err: err.message})
   }
}

const delProduct = async (req, res) => {
   try{

      const result = await auth(req, res)
      if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

      const {id} = req.query
      await Products.findByIdAndDelete(id)

      res.json({msg: 'Success! Deleted the current product'})
   }
   catch(err){
      return res.status(500).json({err: err.message})
   }
}

export default ProductId