import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/treatment/result';
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
        !appoint ||
        !operator ||
        !user ||
        !general_apperance ||
        physical === 'all' ||
        ears === 'all' ||
        skin === 'all' || 
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

        const newresult = new Result({
            doctor: result.id,
            appointment: appoint,
            operator,
            user,
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

        await newresult.save()

        res.json({
            msg: "Success! Created a Treatment Result",
            newresult
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{
        const result = await auth(req, res)
        
        let treatment;
        if(result.role === 'doctor'){
            treatment = await Result.find({doctor: result.id})
        }else if(result.role === 'operator'){
            treatment = await Result.find({operator: result.id})
        }else {
            treatment = await Result.find({user: result.id})
        }

       res.json({treatment})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}