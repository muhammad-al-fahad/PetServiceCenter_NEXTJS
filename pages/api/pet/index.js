import ConnectDB from "../../../utils/mongodb";
import Pets from '../../../model/pet';
import auth from '../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await register(req, res)
            break;
        case 'GET':
            await getPet(req, res)
            break;
    }
}

// doing filering of product likewise sorting (newest, oldest etc), filtering (category, search by title), paginating (Load more => show more pages of product)
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    } // Initialize the product data in state variable into two form 1. is query where specific product data is inserted and 2. is StringQuery where we store an action that act upon on product data, that also implement in params of specified query of axios.get('url + params') ...

    filtering(){
        const params = {...this.queryString} // create an object which can store params data that is posted in front end 

        const exclude = ['page', 'sort', 'limit'] // create any array of action where can store activity that is appeared on product data

        exclude.forEach(field => delete(params[field])) // call each action that is stored in array and where we just secondary delete or (hidden) that product that we never want to view

        if(params.petCategory !== 'all')
            this.query.find({petCategory: params.petCategory}) // find category of specific product that is matches to specific category value that is stored in the file which can call the array of product

        if(params.petName !== 'all')
            this.query.find({petName: {$regex: params.petName}}) // find the products that is related to name as we use title is we write some word on search bar than every single character of array start loop and check wheather in position 0,1,2, etc that the word is available or match if so then view relative products, regex used in mongod to find/match data

        this.query.find() // return the value that is captured in file that contain value of relative data of products that is fulfill the requirement of condition
        return this;
    }

    sorting(){
        if(this.queryString.sort){ // array that contain sort if it is called then this sorting operation run
            const sortBy = this.queryString.sort.split(',').join('') // declare variable which can take over data into different format, likewise if we want to split any kind of data variable or join then how to sort this is called
            this.query = this.query.sort(sortBy) // the new variable which consist of two method (split, join) can be inserted into query variable which already have products its mean the activity one can happen on data.
        }else{
            this.query = this.query.sort('-createdAt') // if sort in params is not visibale then return value of that product that contaon (createdAt is their database)
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1 // make sure that how many pages are available for products that left code clear statement is this that if we move second page then it show in first page with previous data
        const limit = this.queryString.limit * 1 || 3 // make sure that in one page how many data are visible
        const skip = (page - 1) * limit // make sure current which is shown in page and next product is hidden when we move next page previous page data is not hidden but rarerly shown only those page data in one page not move to new link to view second page data
        this.query = this.query.skip(skip).limit(limit) // return data to query varaiable which can set that statement of skip and limit in query varaiable
        return this;
    }
}

const register = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Only User/Member User have access to Register their Pet's"})

       const {petCategory, petSex, petName, avatar, dateofbirth, age, bio, disease} = req.body

       if(petCategory === 'all' || !petSex || !petName || avatar.length === 0 || !dateofbirth || !bio || age === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        const newPet = new Pets({userId: result.id, userDetail: result, petName: petName.toLowerCase(), petCategory, petSex, images: avatar, dateofbirth, age, bio, disease})

        await newPet.save()

        res.json({
            msg: "Success! Add a new Pet",
            newPet
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getPet = async (req, res) => {
    try{
       const result = await auth(req, res)

       if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Only User/Member User have access to Register their Pet's"})
            
        const features = new APIfeatures(Pets.find({userId: result.id}), req.query).filtering().sorting().paginating()    
        const pet = await features.query

       res.json({success: 'Success', result: pet.length, pet})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}