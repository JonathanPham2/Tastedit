import { createSelector } from 'reselect'

// Action type constants:
const LOAD_DISHES = "/dishes"  // load all dishes

const POST_DISH = "/dishes/new"
const LOAD_DISH_BY_ID = "/dishes/id" // load dish by id

const UPDATE_DISH = "/dish/update" // update dish post

const DELETE_DISH = "dish/delete" // delete dish post

const CURRENT_USER_DISH = "/dishes/current"

// Action creator
export const loadDishes = dishes => ({
    type:LOAD_DISHES,
    payload: dishes
})
export const loadDishById = dish => ({
    type:LOAD_DISH_BY_ID,
    payload: dish
})
export const postDish = dish => ({
    type: POST_DISH,
    payload: dish

})

export const updateDish = dish => ({
    type:UPDATE_DISH,
    payload: dish
})

export const currentUserDish = dishes =>({
    type: CURRENT_USER_DISH,
    payload: dishes
})

export const deleteDish = id => ({
    type: DELETE_DISH,
    payload: id
})
// using selector here for dishes post 
// Thunk action

//fetch current user dish
export const thunkFetchCurrent = () => async (dispatch) => {
    const res = await fetch("/api/dishes/current")
    if(res.ok) {
        const dishes = await res.json()
        dispatch(currentUserDish(dishes))
        return res
    }
    else {
        return "thunk error"
    }
}

//Delete
export const thunkDeleteDish = (id) => async (dispatch) => {
    const res = await fetch(`/api/dishes/${id}`, {
        method: "DELETE"
    })
    if(res.ok) {
        const id = await res.json()
        dispatch(deleteDish(id))
        return res

    }
    else {
        return "thunk delete erorr"
    }
}



// update dish

export const thunkUpdateDish = (id, formData) => async (dispatch) => {
    const res = await fetch(`/api/dishes/${id}`, {
        method: "PUT",
        body: formData
    })
    if (res.ok) {
        const dish = await res.json()
        dispatch(updateDish(dish))
        return dish
    }
    else {
        return "thunk error from update"
    }
} 

// Post dish
export const thunkPostDish = (formData) => async (dispatch) => {
    const res = await fetch("/api/dishes/new", {
        method: "POST",
        body: formData
    })
    if(res.ok) {
        const dish = await res.json()
        dispatch(postDish(dish))
        return dish
    }
    else{
        console.log(res)
        return res
    }

}

//Fetch all dishes

export const thunkFetchDishes = () => async (dispatch) => {
    const res =  await fetch("/api/dishes/")
    if(res.ok){
        const dishes = await res.json()
        dispatch(loadDishes(dishes))
        return res
    }
    else {
        return"Thunk fetch failed "
    }
}
// Fetch sing dish
export const thunkFetchSingleDish= (id) => async(dispatch)=> {
    const res = await fetch(`/api/dishes/${id}`)
    if(res.ok) {
        const dish  = await res.json()
        dispatch(loadDishById(dish))
        return res
    }
    else {
        return "Fetch error"

    }

}

// selector 
const selectorDishes = (state) => state.dishes
export const selectorDishesArray = createSelector(selectorDishes, (dishes) => Object.values(dishes))
const initialState = {}

const dishReducer = (state= initialState, action) => {
    switch(action.type){
        case LOAD_DISHES: {
            const normalizedDishState = {}
            action.payload.forEach(dish => normalizedDishState[dish.id]=dish)
            return normalizedDishState
        }
        case POST_DISH: {
            return {...state, [action.payload.id]: action.payload}
        }
        case LOAD_DISH_BY_ID: {
            return {...state, [action.payload.id]: action.payload}
            
        }
        case UPDATE_DISH: {
            return {...state, [action.payload.id]: action.payload}
        }
        case CURRENT_USER_DISH: {
            const normalizedDishState = {}
            action.payload.map(dish => normalizedDishState[dish.id]=dish)
            return normalizedDishState
        }
        case DELETE_DISH: {
            const newDishState = {...state}
            delete newDishState[action.payload.id]
            return newDishState
        }
        default:
            return state
    }

        
    
}

export default dishReducer