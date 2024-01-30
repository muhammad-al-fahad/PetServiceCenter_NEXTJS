import ConnectDB from "../../../../utils/mongodb";
import Products from '../../../../model/product';

ConnectDB()

const ProductId = async (req, res) => {
    switch(req.method){
         case 'PUT':
               await updateProduct(req, res)
               break; 
    }
}

const updateProduct = async (req, res) => {
    try{ 
       const {id} = req.query
 
       const pro = await Products.findOneAndUpdate({_id: id}, {
         membership: ''
       })

       res.json({msg: "Successfully Completed"})
 
    }
    catch(err){
       return res.status(500).json({err: err.message})
    }
 }

export default ProductId