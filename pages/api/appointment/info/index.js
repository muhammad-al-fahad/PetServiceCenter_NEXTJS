import ConnectDB from "../../../../utils/mongodb";
import Appointment from '../../../../model/appointment';
import auth from '../../../../middleware/auth';

ConnectDB()

const AppointmentIndex = async (req, res) => {
    switch(req.method){
        case 'GET':
            await getAppointment(req, res)
            break;
    }
}

const getAppointment = async (req, res) => {
    try{

        const result = await auth (req, res)

        let appoint;
        let features;
        if(result.role === 'doctor'){
            appoint = await Appointment.find({doctor: result.id}).populate("user", "-password -root")

        }else if(result.role === 'user' || result.role === 'membership'){
            appoint = await Appointment.find({user: result.id}).populate("user", "-password -root")
        }else {
            appoint = await Appointment.find().populate("user", "-password -root")
        }

        res.json({appoint, result: appoint.length})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default AppointmentIndex