import ConnectDB from "../../../../utils/mongodb";
import Examination from '../../../../model/checkup/visual_examination';
import auth from '../../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'GET':
            await getData(req, res)
            break;
        case 'PUT':
            await updateData(req, res)
            break;
        case 'DELETE':
            await delData(req, res)
            break;
    }
}

const getData = async (req, res) => {
    try{
        const {id} = req.query

        const visual = await Examination.findById(id)

        res.json({visual})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const updateData = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {
            operator,
            face,
            horns,
            ears,
            eyes,
            sclera,
            muzzle,
            nostrils,
            mouth,
            neck,
            chest,
            abdomen,
            udder,
            ganitalia,
            limbs,
            tail,
            lymph_nodes,
            skin,
            faeces,
            urine
        } = req.body

        if(
            !operator ||
           face === 'all' ||
           horns === 'all' ||
           ears === 'all' ||
           skin === 'all' || 
           eyes === 'all' || 
           sclera === 'all' || 
           muzzle === 'all' || 
           mouth === 'all' || 
           neck === 'all' ||
           chest === 'all' ||
           abdomen === 'all' ||
           nostrils === 'all' ||
           tail === 'all' ||
           udder === 'all' ||
           ganitalia === 'all' ||
           limbs === 'all' ||
           lymph_nodes === 'all' ||
           skin === 'all' ||
           faeces === 'all' ||
           urine === 'all'
           )
            return res.status(400).json({err: "Please fill all the fields"})

        await Examination.findOneAndUpdate({_id: id}, {
            operator,
            face,
            horns,
            ears,
            eyes,
            sclera,
            muzzle,
            nostrils,
            mouth,
            neck,
            chest,
            abdomen,
            udder,
            ganitalia,
            limbs,
            tail,
            lymph_nodes,
            skin,
            faeces,
            urine
        })

        res.json({msg: 'Success! Updated a Visual Examination of Checkup Result'})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delData = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

       const {id} = req.query
       
       await Examination.findByIdAndDelete(id)

       res.json({msg: `Success! Deleted the Visual Examination of Checkup Result`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}