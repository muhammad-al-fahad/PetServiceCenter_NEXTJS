import { ACTIONS } from "./action";

const reducer = (state, action) => {
    switch(action.type){
        case ACTIONS.NOTIFY:
            return {
                ...state,
                notify: action.payload
            }
        case ACTIONS.AUTH:
            return {
                ...state,
                auth: action.payload
            }
        case ACTIONS.ADD_CART:
            return {
                ...state,
                cart: action.payload
            }
        case ACTIONS.ADD_MODAL:
            return {
                ...state,
                modal: action.payload
            }
        case ACTIONS.ADD_ORDER:
            return {
                ...state,
                orders: action.payload
            }
        case ACTIONS.ADD_USER:
            return {
                ...state,
                users: action.payload
            }
        case ACTIONS.ADD_CATEGORY:
            return {
                ...state,
                category: action.payload
            }
        case ACTIONS.ADD_PETCATEGORY:
            return {
                ...state,
                petCategories: action.payload
            }
        case ACTIONS.ADD_TYPES:
            return {
                ...state,
                types: action.payload
            }
        case ACTIONS.ADD_MEMBER:
            return {
                ...state,
                member: action.payload
            }
        case ACTIONS.ADD_DOCTORS:
            return {
                ...state,
                doctors: action.payload
            }
        case ACTIONS.ADD_OPERATORS:
            return {
                ...state,
                operators: action.payload
            }
        case ACTIONS.ADD_TIMING:
            return {
                ...state,
                timings: action.payload
            }
        case ACTIONS.ADD_SERVICES:
            return {
                ...state,
                services: action.payload
            }
        case ACTIONS.ADD_APPOINTMENTS:
            return {
                ...state,
                appointments: action.payload
            }
        case ACTIONS.ADD_PETS:
            return {
                ...state,
                pets: action.payload
            }
        case ACTIONS.ADD_OFFER:
            return {
                ...state,
                offers: action.payload
            }
        case ACTIONS.ADD_CHECKUP_SERVICE:
            return {
                ...state,
                checkup_service: action.payload
            }
        case ACTIONS.ADD_PHYSICAL:
            return {
                ...state,
                physical_result: action.payload
            }
        case ACTIONS.ADD_VISUAL:
            return {
                ...state,
                visual_result: action.payload
            }
        case ACTIONS.ADD_MEDICINE:
            return {
                ...state,
                medicines: action.payload
            }
        case ACTIONS.ADD_PRESCRIPTION:
            return {
                ...state,
                prescriptions: action.payload
            }
        case ACTIONS.ADD_BILL:
            return {
                ...state,
                bills: action.payload
            }
        case ACTIONS.ADD_TREATMENT_SERVICE:
            return {
                ...state,
                treatment_service: action.payload
            }
        case ACTIONS.ADD_TREATMENT_RESULT:
            return {
                ...state,
                treatment_result: action.payload
            }
        case ACTIONS.ADD_VACCINATION_SERVICE:
            return {
                ...state,
                vaccination_service: action.payload
            }
        case ACTIONS.ADD_DOG_DISEASE:
            return {
                ...state,
                dog_disease: action.payload
            }
        case ACTIONS.ADD_CAT_DISEASE:
            return {
                ...state,
                cat_disease: action.payload
            }
        case ACTIONS.ADD_DIAGNOSTIC_TEST_SERVICE:
            return {
                ...state,
                diagnostic_test_service: action.payload
            }
        case ACTIONS.ADD_DIAGNOSTIC_TEST_RESULT:
            return {
                ...state,
                diagnostic_test_result: action.payload
            }
        case ACTIONS.ADD_HOME_VISIT_SERVICE:
            return {
                ...state,
                home_visit_service: action.payload
            } 
        case ACTIONS.ADD_HOME_VISIT_RESULT:
            return {
                ...state,
                home_visit_result: action.payload
            }
        default:
            return state;
    }
}

export default reducer