import { createSelector } from 'reselect'

// Action type constants:
const LOAD_DISHES = "/dishes"  // load all dishes

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
const selectorDishes = (state) => state.dishes
export const selectorDishesArray = createSelector(selectorDishes, (dishes) => Object.values(dishes))

const dishReducer = (state= {}, action) => {
    switch(action.type){
        case LOAD_DISHES: {
            const normalizedDishState = {}
            action.payload.map(dish => normalizedDishState[dish.id]=dish)
            return normalizedDishState
        }
        default:
            return state
    }

        
    
}

export default dishReducer