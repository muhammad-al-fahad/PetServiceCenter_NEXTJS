import {useContext, useEffect, useState} from 'react'
import {DataContext} from '../redux/store'
import { deleteItem } from '../redux/action'
import { deleteData, postData } from '../utils/fetchData'
import { useRouter } from 'next/router'

const Modal = () => {
    const {state, dispatch} = useContext(DataContext)
    const [token, setToken] = useState('')
    const {modal, auth} = state
    const router = useRouter()

    useEffect(() => {
        if(auth.user) setToken(auth.token)
    }, [auth.token])

    const delOrder = (it) => {
                deleteData(`order/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch(deleteItem(it.data, it.id, it.type))
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                })
                
                it.data.map(items => {
                    if(items._id === it.id){
                        postData('product/changeProduct', {cart: items.cart, delivered: items.delivered}, auth.token).then(res => {
                            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                        })
                }
                })
            }

    const delUser = (it) => {
                deleteData(`user/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch(deleteItem(it.data, it.id, it.type))
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                })
            }

    const delCategory = (it) => {
                deleteData(`category/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch(deleteItem(it.data, it.id, it.type))
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                })
            }

    const delProduct = (it) => {

                dispatch({type: 'NOTIFY', payload: {loading: true}})
                deleteData(`product/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                    return router.push('/product')
                })
            }
            
    const delPetCategory = (it) => {
                deleteData(`petType/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch(deleteItem(it.data, it.id, it.type))
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                })
            }

    const delType = (it) => {
                deleteData(`membership/types/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch(deleteItem(it.data, it.id, it.type))
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                })
            }

    const delPet = (it) => {
                deleteData(`pet/${it.id}`, auth.token).then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                    return router.push(`/pets?token=${token}`)
                })
            }

    const delOffer = (it) => {
        deleteData(`offer/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/offers`)
        })
    }

    const delMember = (it) => {
        deleteData(`membership/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/memberships`)
        })
    }

    const delService = (it) => {
        deleteData(`service/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/services`)
        })
    }

    const delTiming = (it) => {
        deleteData(`timing/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/timing`)
        })
    }

    const delAppointment = (it) => {
        deleteData(`appointment/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/appointment`)
        })
    }

    const delMedicine = (it) => {
        deleteData(`medicine/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
        })
    }

    const delPrescription = (it) => {
        deleteData(`checkup/prescription/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/prescriptions`)
        })
    }

    const delPhysicalExamination = (it) => {
        deleteData(`checkup/physical/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/checkups/physical_examination`)
        })
    }

    const delVisualExamination = (it) => {
        deleteData(`checkup/visual/${it.id}`, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            dispatch(deleteItem(it.data, it.id, it.type))
            dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            return router.push(`/checkups/visual_examination`)
        })
    }

    const Delete = () => {
        if(modal.length !== 0){
            for(const it of modal){

                if(it.type === 'ADD_CART') dispatch(deleteItem(it.data, it.id, it.type)) 
                if(it.type === 'ADD_ORDER') delOrder(it)
                if(it.type === 'ADD_CATEGORY') delCategory(it)
                if(it.type === 'ADD_PETCATEGORY') delPetCategory(it)
                if(it.type === 'ADD_USER') delUser(it)
                if(it.type === 'DELETE_PRODUCT') delProduct(it)
                if(it.type === 'ADD_PET') delPet(it)
                if(it.type === 'ADD_OFFER') delOffer(it)
                if(it.type === 'ADD_TYPES') delType(it)
                if(it.type === 'ADD_MEMBER') delMember(it)
                if(it.type === 'ADD_SERVICES') delService(it)
                if(it.type === 'ADD_TIMING') delTiming(it)
                if(it.type === 'ADD_APPOINTMENTS') delAppointment(it)
                if(it.type === 'ADD_MEDICINE') delMedicine(it)
                if(it.type === 'ADD_PHYSICAL') delPhysicalExamination(it)
                if(it.type === 'ADD_VISUAL') delVisualExamination(it)
                if(it.type === 'ADD_PRESCRIPTION') delPrescription(it)

                dispatch({type: "ADD_MODAL", payload: []})

            }
        }
    }

   return(
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title text-capitalize" id="exampleModalLabel">{modal.length !== 0 && modal[0].title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                Do You want to delete Item?
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={Delete}>Yes</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">No</button>
            </div>
            </div>
        </div>
    </div>
   )
}

export default Modal