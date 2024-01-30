import ConnectDB from "../../../../utils/mongodb";
import Examination from '../../../../model/checkup/visual_examination';
import auth from '../../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
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
            appoint,
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
        !appoint ||
        !operator ||
        !user ||
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

        const newExam = new Examination({
            doctor: result.id,
            appointment: appoint,
            operator,
            user,
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

        await newExam.save()

        res.json({
            msg: "Success! Created a Visual Examination of Checkup Result",
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
        
        let visual;
        if(result.role === 'doctor'){
            visual = await Examination.find({doctor: result.id})
        }else if(result.role === 'operator'){
            visual = await Examination.find({operator: result.id})
        }else {
            visual = await Examination.find({user: result.id})
        }

       res.json({visual})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}