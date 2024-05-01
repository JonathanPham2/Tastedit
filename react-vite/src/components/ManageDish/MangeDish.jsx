import DishesList from "../DishesList"
import { selectorDishesArray, thunkDeleteDish, thunkFetchCurrent } from "../../redux/dishes"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Navigation from "../Navigation/Navigation"
import "./ManageDish.css"
import { ToastContainer,  toast, cssTransition} from "react-toastify"


const ManageDish = () => {
    const dispatch = useDispatch()
    const dishes = useSelector(selectorDishesArray)
    const user = useSelector(state => state.session.user)
    const isManage = true

    useEffect(() => {
        dispatch(thunkFetchCurrent())

    },[dispatch])

    const fade = cssTransition({
        enter: "fade-in",
        exit: "fade-out"
      });



    // handle delete funciton
    const handleDelete = (id) => {
        dispatch(thunkDeleteDish(id))
        toast.dark("Successfuly Delete Dish", {
            transition: fade
        })

    }    

    
    return (
        <main className="manage-container">
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable />
            <Navigation />
            {dishes.length === 0 && (
                <div style={{textAlign:"center" , height: "80vh"}}><h2>Currently have no dish!!!</h2></div>
             )}
            <DishesList isManage={isManage} handleDelete={handleDelete} dishes={dishes}/>
            {user === null && (
                <div style={{textAlign: "center"}}><h2 style={{color: "red"}}>NOT LOGIN YET!!!</h2></div>
            )}

        </main>
    )
}

export default ManageDish