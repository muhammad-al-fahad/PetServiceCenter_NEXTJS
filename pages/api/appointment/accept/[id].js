import ConnectDB from "../../../../utils/mongodb";
import Appointment from '../../../../model/appointment';
import auth from '../../../../middleware/auth';

ConnectDB()
const Accept = async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await updateAppointment(req, res)
            break;
    }
}

    const updateAppointment = async (req, res) => {
        try{
            const result = await auth (req, res)
            if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})
    
            const {id} = req.query
    
            await Appointment.findOneAndUpdate({_id: id}, {
                accept: true
            })
    
            res.json({msg: 'Success! Update a current Appointment'})
    
        }
        catch(err) {
            return res.status(500).json({err: err.message})
        }
    }

    export default Accept