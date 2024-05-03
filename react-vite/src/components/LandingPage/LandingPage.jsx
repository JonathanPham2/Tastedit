import { useDispatch, useSelector } from "react-redux";
import { selectorDishesArray, thunkFetchDishes } from "../../redux/dishes";
import { useEffect, useRef, useState } from "react";
import DishesList from "../DishesList";
import './LandingPage.css'
import Navigation from "../Navigation/Navigation";
import io from "socket.io-client"
import { ToastContainer, toast, cssTransition } from "react-toastify"
import { useNavigate } from "react-router-dom";
// import { FaDeaf } from "react-icons/fa";




const LandingPage = () => {
    const dispatch = useDispatch()
    const [dishes, setDishes] = useState([])
    const socketRef = useRef()
   

    // getting the dishes from selector in redux state 
    const fetchedDishes =  useSelector(selectorDishesArray)
    
    //Using thunk to fetch dishes from backend api
    useEffect(() => {
        dispatch(thunkFetchDishes())
    }, [dispatch])
    // set the new fetched dishes to componant state
    useEffect(() => {
        setDishes(fetchedDishes)

    },[fetchedDishes])
// --------------------------
// --------------------- Live update and notification for all user that are connected

    //---------------- Style for the toast notify
    const fade = cssTransition({
        enter: "fade-in",
        exit: "fade-out"
    })
     // real-time notification 
    //   initialize web socket connect between client side and back end  on landing page whe user at landing page they will receive live update and noti if another user post new dish
    useEffect(() => {
        // if(!socketRef.current){
            let backendUrl = import.meta.env.MODE === "production" ? "https://tastedit.onrender.com" : "http://127.0.0.1:8000"
            socketRef.current = io(backendUrl)
            
            
        
            socketRef.current.on("connect", () => {
    

                socketRef.current.on("dish_added", (newDish) => {
                    toast.dark("New Dish have been added ", {
                        transition: fade
                    })
                    // updaing the dishes state for to trigger re render 
                    setDishes(prevDishes => [newDish, ...prevDishes])
                })

            })
    // clear the connect when unmount
        return () => {
            if(socketRef.current){
                console.log("disconnected")
                socketRef.current.disconnect()
                // socketRef.current = null

             } }
    },[])
   

    // for disconnect  upong navigate to dish detail
    return (
        <main className="landing-page">
            <div className="landing-background">
                 <Navigation/>
                 <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable />
                 <div className="welcome-container">
                    <h1 className="welcome-text">Welcome to Tastedit</h1>
                    <p className="explore-text">Explore and share the best dishes</p>
                </div>
                <button className="explore-button" >Explore now</button>
            </div>
            <DishesList  dishes={dishes} />
        </main>
    )



}
export default LandingPage