import { useDispatch, useSelector } from "react-redux";
import { selectorDishesArray, thunkFetchDishes } from "../../redux/dishes";
import { useEffect, useState } from "react";
import DishesList from "../DishesList";
import './LandingPage.css'
import Navigation from "../Navigation/Navigation";
import io from "socket.io-client"


const LandingPage = () => {
    const dispatch = useDispatch()
    const [dishes, setDishes] = useState([])

    // getting the dishes from selector in redux state 
    const fetchedDishes =  useSelector(selectorDishesArray)
    
    //Using thunk to fetch dishes from backend api
    useEffect(() => {
        dispatch(thunkFetchDishes())
    }, [dispatch])

    useEffect


    return (
        <main className="landing-page">
            <div className="landing-background">
                 <Navigation/>
                 <div className="welcome-container">
                    <h1 className="welcome-text">Welcome to Tastedit</h1>
                    <p className="explore-text">Explore and share the best dishes</p>
                </div>
                <button className="explore-button" >Explore now</button>
            </div>
            <DishesList  dishes={fetchedDishes}/>
        </main>
    )



}
export default LandingPage