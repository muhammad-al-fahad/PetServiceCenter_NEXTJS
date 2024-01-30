import { createContext, useReducer, useEffect } from 'react'
import reducer from './reducer'
import { getData } from '../utils/fetchData'

export const DataContext = createContext()

export const DataProvider = ({children}) => {
const initialState = {
  notify: {}, 
  auth: {}, 
  cart: [], 
  modal: [], 
  orders: [], 
  users: [], 
  category: [], 
  petCategories: [], 
  types: [], 
  member: [], 
  doctors: [],
  operators: [],
  timings: [],
  services: [],
  appointments: [],
  pets: [],
  offers: [],
  checkup_service: [],
  physical_result: [],
  visual_result: [],
  medicines: [],
  prescriptions: [],
  bills: [],
  treatment_service: [],
  treatment_result: [],
  vaccination_service: [],
  dog_disease: [],
  cat_disease: [],
  diagnostic_test_service: [],
  diagnostic_test_result: [],
  home_visit_service: [],
  home_visit_result: []
}
const [state, dispatch] = useReducer(reducer, initialState)
const { cart, auth } = state

useEffect(() => {
  const firstLogin = localStorage.getItem('firstLogin')
  
  if(firstLogin){
    getData('auth/token').then(res => {
        if(res.err)
          return localStorage.removeItem('firstLogin')

        dispatch({
        type: 'AUTH',
        payload: {
            token: res.access_token,
            user: res.user
        }
        })
    })
  }

  getData('category/categories').then(res => {
    if(res.err)
      return dispatch({type: 'NOTIFY', payload: {err: res.err}})

    dispatch({
      type: 'ADD_CATEGORY',
      payload: res.category
    })
  })

  getData('petType').then(res => {
      if(res.err)
      return dispatch({type: 'NOTIFY', payload: {err: res.err}})

    dispatch({
      type: 'ADD_PETCATEGORY',
      payload: res.petCategories
    })
  }
  )

  getData('membership/types').then(res => {
    if(res.err)
    return dispatch({type: 'NOTIFY', payload: {err: res.err}})

  dispatch({
    type: 'ADD_TYPES',
    payload: res.type
  })
  }
  )

  getData('membership').then(res => {
    if(res.err)
    return dispatch({type: 'NOTIFY', payload: {err: res.err}})

    dispatch({
      type: 'ADD_MEMBER',
      payload: res.member
    })
  })

  getData('timing').then(res => {
    
    if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
    
    dispatch({
    type: 'ADD_TIMING',
    payload: res.timing
    })
  })

  getData('service').then(res => {

    if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
    
    dispatch({
    type: 'ADD_SERVICES',
    payload: res.service
    })
  })

  getData('user/doctor', auth.token).then(res => {
    
    if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
    
    dispatch({
    type: 'ADD_DOCTORS',
    payload: res.doctors
    })
  })

  getData('offer/info', auth.token).then(res => {
  
    if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
    
    dispatch({
    type: 'ADD_OFFER',
    payload: res.offer
    })
  })
  
},[])

useEffect(() => {
   const _cart_accessories_pet = JSON.parse(localStorage.getItem('_cart_accessories_pet')) 
   if(_cart_accessories_pet)
      dispatch({type: 'ADD_CART', payload: _cart_accessories_pet})
},[])

useEffect(() => {
  localStorage.setItem('_cart_accessories_pet', JSON.stringify(cart))
},[cart])

useEffect(() => {
  if(auth.token){
    getData('order/orders', auth.token).then(res => {
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
      
      dispatch({ type: "ADD_ORDER", payload: res.orders})
    })

    if(auth.user.role === 'admin'){
      getData('user/info', auth.token).then(res => {

        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        dispatch({ type: "ADD_USER", payload: res.users})
      })
    }

    if(auth.user.role === 'doctor'){
      getData('user/operator', auth.token).then(res => {
    
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
        
        dispatch({
        type: 'ADD_OPERATORS',
        payload: res.operators
        })
      })

      getData('medicine', auth.token).then(res => {
    
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
        
        dispatch({
        type: 'ADD_MEDICINE',
        payload: res.category
        })
      })
    }

    getData('checkup/service', auth.token).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
      dispatch({
      type: 'ADD_CHECKUP_SERVICE',
      payload: res.service
      })
    })

    getData('treatment/service', auth.token).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
      dispatch({
      type: 'ADD_TREATMENT_SERVICE',
      payload: res.service
      })
    })

    getData('vaccination/service', auth.token).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
      dispatch({
      type: 'ADD_VACCINATION_SERVICE',
      payload: res.service
      })
    })

    getData('home_visit/service', auth.token).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
      dispatch({
      type: 'ADD_HOME_VISIT_SERVICE',
      payload: res.service
      })
    })

    getData('diagnostic_test/service', auth.token).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
      dispatch({
      type: 'ADD_DIAGNOSTIC_TEST_SERVICE',
      payload: res.service
      })
    })

      getData('checkup/physical', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_PHYSICAL',
        payload: res.physical
        })
      })

      getData('checkup/visual', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_VISUAL',
        payload: res.visual
        })
      })

      getData('treatment/result', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_TREATMENT_RESULT',
        payload: res.treatment
        })
      })

      getData('vaccination/cat_disease', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_CAT_DISEASE',
        payload: res.vaccination
        })
      })

      getData('vaccination/dog_disease', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_DOG_DISEASE',
        payload: res.vaccination
        })
      })

      getData('diagnostic_test/result', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_DIAGNOSTIC_TEST_RESULT',
        payload: res.diagnostic_test
        })
      })

      getData('home_visit/result', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_HOME_VISIT_RESULT',
        payload: res.home_visit
        })
      })

      getData('prescription', auth.token).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})    
        dispatch({
        type: 'ADD_PRESCRIPTION',
        payload: res.prescription
        })
      })

    getData('appointment/info', auth.token).then(res => {
  
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
      
      dispatch({
      type: 'ADD_APPOINTMENTS',
      payload: res.appoint
      })
    })

    getData('pet/info', auth.token).then(res => {
  
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}})
      
      dispatch({
      type: 'ADD_PETS',
      payload: res.pet
      })
    })

    getData('bill', auth.token).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {err: res.err}}) 
      dispatch({
      type: 'ADD_BILL',
      payload: res.bill
      })
    })

  }
  else{
    dispatch({ type: "ADD_ORDER", payload: []})
    dispatch({ type: "ADD_OPRATORS", payload: []})
    dispatch({ type: "ADD_PETS", payload: []})
    dispatch({ type: "ADD_APPOINTMENTS", payload: []})
    dispatch({ type: "ADD_USER", payload: []})
    dispatch({ type: "ADD_INSPECT", payload: []})
    dispatch({ type: "ADD_PHYSICAL", payload: []})
    dispatch({ type: "ADD_VISUAL", payload: []})
    dispatch({ type: "ADD_MEDICINE", payload: []})
    dispatch({ type: "ADD_BILL", payload: []})
    dispatch({ type: "ADD_TREATMENT_SERVICE", payload: []})
    dispatch({ type: "ADD_TREATMENT_RESULT", payload: []})
    dispatch({ type: "ADD_VACCINATION_SERVICE", payload: []})
    dispatch({ type: "ADD_CAT_DISEASE", payload: []})
    dispatch({ type: "ADD_DOG_DISEASE", payload: []})
    dispatch({ type: "ADD_DIAGNOSTIC_TEST_SERVICE", payload: []})
    dispatch({ type: "ADD_DIAGNOSTIC_TEST_RESULT", payload: []})
    dispatch({ type: "ADD_HOME_VISIT_SERVICE", payload: []})
    dispatch({ type: "ADD_HOME_VISIT_RESULT", payload: []})
  }
  
},[auth.token])

    return(
        <DataContext.Provider value={{state, dispatch}}>
          {children}
        </DataContext.Provider>
    )
}