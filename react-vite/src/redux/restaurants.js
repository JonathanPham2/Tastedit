import { createSelector } from "reselect"


// action 
const LOAD_RESTAURANT = "/restaurants"

// action creator

export const loadRestaurant = restaurants => ({
    type: LOAD_RESTAURANT,
    payload: restaurants
})

// restaurant thunk action 
export const thunkFetchRestaurant =  () => async (disptach) => {
    const res = await fetch("/api/restaurants")
    if(res.ok){
        const restaurants = await res.json()
        console.log(res)
        disptach(loadRestaurant(restaurants))
        return restaurants
    }
    else {
        return "error from restaurants thunk"
    }

    

}
// selector
const selectorRestaurants = (state) => state.restaurants

export const selectorRestaurantsArray = createSelector(selectorRestaurants,(restaurants) => Object.values(restaurants) )

const restaurantReducer =(state= {}, action) => {
    switch(action.type) {
        case LOAD_RESTAURANT: {
            const normalizedRestaurantState = {}
            action.payload.map(restaurant => normalizedRestaurantState[restaurant.id]=restaurant)
            return normalizedRestaurantState
        }
        default:
            return state
    }
}

export default restaurantReducer


