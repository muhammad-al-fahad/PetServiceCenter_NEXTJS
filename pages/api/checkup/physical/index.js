import ConnectDB from "../../../../utils/mongodb";
import Examination from '../../../../model/checkup/physical_examination';
import auth from '../../../../middleware/auth';

ConnectDB()

const Physical = async (req, res) => {
    switch(req.method){
        case 'POST':
            await createData(req, res)
            break;
        case 'GET':
            await getData(req, res)
            break;
    }
}

const createData = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

       const {
        operator,
        user,
        temperature,
        appoint,
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
        !operator ||
        !temperature ||
        !appoint ||
        !user ||
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

        const newExam = new Examination({
            doctor: result.id,
            operator,
            user,
            appointment: appoint,
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

        await newExam.save()

        res.json({
            msg: "Success! Created a Physical Examination of Checkup Result",
            newExam
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{
        const result = await auth(req, res)
        
        let physical;
        if(result.role === 'doctor'){
            physical = await Examination.find({doctor: result.id})
        }else if(result.role === 'operator'){
            physical = await Examination.find({operator: result.id})
        }else {
            physical = await Examination.find({user: result.id})
        }

       res.json({physical})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Physical