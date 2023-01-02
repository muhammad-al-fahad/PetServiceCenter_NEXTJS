export const ACTIONS = {
    NOTIFY: 'NOTIFY',
    AUTH: 'AUTH',
    ADD_CART: 'ADD_CART',
    ADD_MODAL: 'ADD_MODAL',
    ADD_ORDER: 'ADD_ORDER',
    ADD_USER: 'ADD_USER',
    ADD_CATEGORY: 'ADD_CATEGORY',
    ADD_PETCATEGORY: 'ADD_PETCATEGORY',
    ADD_TYPES: 'ADD_TYPES',
    ADD_MEMBER: 'ADD_MEMBER',
    ADD_DOCTORS: 'ADD_DOCTORS',
    ADD_OPERATORS: 'ADD_OPERATORS',
    ADD_TIMING: 'ADD_TIMING',
    ADD_SERVICES: 'ADD_SERVICES',
    ADD_APPOINTMENTS: 'ADD_APPOINTMENTS',
    ADD_PETS: 'ADD_PETS',
    ADD_OFFER: 'ADD_OFFER',
    ADD_CHECKUP_SERVICE: 'ADD_CHECKUP_SERVICE',
    ADD_PHYSICAL: 'ADD_PHYSICAL',
    ADD_VISUAL: 'ADD_VISUAL',
    ADD_PRESCRIPTION: 'ADD_PRESCRIPTION',
    ADD_MEDICINE: 'ADD_MEDICINE',
    ADD_BILL: 'ADD_BILL',
    ADD_TREATMENT_SERVICE: 'ADD_TREATMENT_SERVICE',
    ADD_TREATMENT_RESULT: 'ADD_TREATMENT_RESULT',
    ADD_VACCINATION_SERVICE: 'ADD_VACCINATION_SERVICE',
    ADD_DOG_DISEASE: 'ADD_DOG_DISEASE',
    ADD_CAT_DISEASE: 'ADD_CAT_DISEASE',
    ADD_DIAGNOSTIC_TEST_SERVICE: 'ADD_DIAGNOSTIC_TEST_SERVICE',
    ADD_DIAGNOSTIC_TEST_RESULT: 'ADD_DIAGNOSTIC_TEST_RESULT',
    ADD_HOME_VISIT_SERVICE: 'ADD_HOME_VISIT_SERVICE',
    ADD_HOME_VISIT_RESULT: 'ADD_HOME_VISIT_RESULT',
}

export const addToCart = (product, cart) => {
    if(product.inStock === 0)
    return ({type: 'NOTIFY', payload: {error: "This product is out of stock"}})

    const check = cart.every(item => {
        return item._id !== product._id
    })

    if(!check)
        return ({type: 'NOTIFY', payload: {error: "The Product is already added to cart"}})

    return ({type: 'ADD_CART', payload: [...cart, {...product, quantity: 1}]})
}

export const decrease = (data, id) => {
    const newData = [...data]
    newData.forEach(item => {
        if(item._id === id) item.quantity -= 1
    })
    return ({type: 'ADD_CART', payload: newData})
}

export const increase = (data, id) => {
    const newData = [...data]
    newData.forEach(item => {
        if(item._id === id) item.quantity += 1
    })
    return ({type: 'ADD_CART', payload: newData})
}

export const deleteItem = (data, id, type) => {
    const newData = data.filter(item => item._id !== id)
    return ({type, payload: newData})
}

export const updateItem = (data, id, post, type) => {
    const newData = data.map(item => (item._id === id ? post : item))
    return ({type, payload: newData})
}