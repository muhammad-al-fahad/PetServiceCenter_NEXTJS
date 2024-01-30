import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/treatment/result';
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

        const result = await Result.findById(id)

        res.json({result})
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
            general_apperance,
            physical,
            ears,
            eyes,
            respiratory,
            oral_exam,
            cardiovasscular,
            genitourinary,
            mussculos_keletal,
            neurological,
            abdomen,
            other_exam_finding,
            test,
            treatment_plan,
            lymph_nodes,
            skin,
        } = req.body

        if(
            !operator ||
            !general_apperance ||
            physical === 'all' ||
            ears === 'all' ||
            eyes === 'all' || 
            respiratory === 'all' || 
            !oral_exam || 
            cardiovasscular === 'all' || 
            genitourinary === 'all' ||
            mussculos_keletal === 'all' ||
            abdomen === 'all' ||
            neurological === 'all' ||
            other_exam_finding.length === 0 ||
            !test ||
            !treatment_plan ||
            lymph_nodes === 'all' ||
            skin === 'all'
            )
                return res.status(400).json({err: "Please fill all the fields"})

        await Result.findOneAndUpdate({_id: id}, {
            operator,
            general_apperance,
            physical,
            ears,
            eyes,
            respiratory,
            oral_exam,
            cardiovasscular,
            genitourinary,
            mussculos_keletal,
            neurological,
            abdomen,
            other_exam_finding,
            test,
            treatment_plan,
            lymph_nodes,
            skin,
        })

        res.json({msg: 'Success! Updated a Treatment Result'})
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
       
       await Result.findByIdAndDelete(id)

       res.json({msg: `Success! Deleted the Treatment Result`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}