import { useDispatch, useSelector } from "react-redux";
import { selectorDishesArray, thunkFetchDishes } from "../../redux/dishes";
import { useEffect } from "react";
import DishesList from "../DishesList";
import './LandingPage.css'
import Navigation from "../Navigation/Navigation";


const LandingPage = () => {
    const dispatch = useDispatch()

    // getting the dishes from selector in redux state 
    const dishes =  useSelector(selectorDishesArray)
    
    //Using thunk to fetch dishes from backend api
    useEffect(() => {
        dispatch(thunkFetchDishes())
    }, [dispatch])

    return (
        <main className="landing-page">
            <div className="landing-background">
                 <Navigation/>
                <h1 className="welcome-text">Welcome to Tastedit</h1>
                <p className="explore-text">Explore and share the best dishes</p>
                <button className="explore-button" >Explore now</button>
            </div>
            <DishesList  dishes={dishes}/>
        </main>
    )



}
export default LandingPage