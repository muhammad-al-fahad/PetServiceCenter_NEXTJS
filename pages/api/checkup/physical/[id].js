import ConnectDB from "../../../../utils/mongodb";
import Examination from '../../../../model/checkup/physical_examination';
import auth from '../../../../middleware/auth'

ConnectDB()

const Physical = async (req, res) => {
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

        const physical = await Examination.findById(id)

        res.json({physical})
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
            temperature,
            heat_rhythm,
            lung_sounds,
            ears,
            skin,
            rumen,
            rumen_motility,
            pings,
            grunt_test,
            oral_cavity,
            capillary_refill_time,
            conjunctiva,
            nostrils,
            tail,
            milk
        } = req.body

        if(
           !operator,
           temperature.length !== 0,
           heat_rhythm === 'all' ||
           lung_sounds === 'all' ||
           ears === 'all' ||
           skin === 'all' || 
           rumen === 'all' || 
           rumen_motility === 'all' || 
           pings === 'all' || 
           grunt_test === 'all' || 
           oral_cavity === 'all' ||
           capillary_refill_time === 'all' ||
           conjunctiva === 'all' ||
           nostrils === 'all' ||
           tail === 'all' ||
           milk === 'all'
           )
            return res.status(400).json({err: "Please fill all the fields"})

        await Examination.findOneAndUpdate({_id: id}, {
            operator,
            temperature,
            heat_rhythm,
            lung_sounds,
            ears,
            skin,
            rumen,
            rumen_motility,
            pings,
            grunt_test,
            oral_cavity,
            capillary_refill_time,
            conjunctiva,
            nostrils,
            tail,
            milk
        })

        res.json({msg: 'Success! Updated a Physical Examination of Checkup Result'})
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

       res.json({msg: `Success! Deleted the Physical Examination of Checkup Result`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Physical