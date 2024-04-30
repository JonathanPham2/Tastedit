import { createSelector } from 'reselect'

// Action type constants:
const LOAD_DISHES = "/dishes"  // load all dishes

const POST_DISH = "/dishes/new"
const LOAD_DISH_BY_ID = "/dishes/id" // load dish by id

const UPDATE_DISH = "/dish/update" // update dish post

const DELETE_DISH = "dish/delete" // delete dish post

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

export const deleteDish = id => ({
    type: DELETE_DISH,
    payload: id
})
// using selector here for dishes post 
// Thunk action


// Post dish
export const thunkPostDish = (formData) => async (dispatch) => {
    const res = await fetch("/api/dishes/new", {
        method: "POST",
        body: formData
    })
    if(res.ok) {
        const dish = await res.json()
        dispatch(postDish(dish))
        console.log(dish)
        return dish
    }
    else{
        return "post thunk error"
    }

}

//Fetch all dishes

export const thunkFetchDishes = () => async (dispatch) => {
    const res =  await fetch("/api/dishes/")
    console.log(res)
    if(res.ok){
        const dishes = await res.json()
        dispatch(loadDishes(dishes))
        return res
    }
    else {
        return new Error("Thunk fetch failed ")
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
            action.payload.map(dish => normalizedDishState[dish.id]=dish)
            return normalizedDishState
        }
        case POST_DISH: {
            return {...state, [action.payload.id]: action.payload}
        }
        case LOAD_DISH_BY_ID: {
            return {...state}
            
        }
        default:
            return state
    }

        
    
}

export default dishReducer