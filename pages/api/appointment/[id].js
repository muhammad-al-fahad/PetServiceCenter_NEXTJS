import ConnectDB from "../../../utils/mongodb";
import Appointment from '../../../model/appointment';
import auth from '../../../middleware/auth';

ConnectDB()

const AppointmentId = async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await updateAppointment(req, res)
            break;
        case 'DELETE':
            await delAppointment(req, res)
            break;
        case 'GET':
            await getAppointmentId(req, res)
            break;
    }
}

const updateAppointment = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {doctor, doctorData, pet, petData, service, serviceData, date, time, timeData} = req.body

        await Appointment.findOneAndUpdate({_id: id}, {
            doctorData, doctor, pet, petData, petName, service, serviceData, date, time, timeData
        })

        res.json({msg: `Success! Update a current Appointment`})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}


const delAppointment = async (req, res) => {
    try{
        const result = await auth (req, res)
        const {id} = req.query

        await Appointment.findByIdAndDelete(id)
        res.json({msg: "Success! Deleted a current Appointment"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getAppointmentId = async (req, res) => {
    try{

        const {id} = req.query

        const appoint = await Appointment.findById(id)
        res.json({appoint})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default AppointmentId