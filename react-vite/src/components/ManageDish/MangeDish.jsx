import DishesList from "../DishesList"
import { selectorDishesArray, thunkDeleteDish, thunkFetchCurrent } from "../../redux/dishes"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Navigation from "../Navigation/Navigation"
import "./ManageDish.css"
import { ToastContainer,  toast, cssTransition} from "react-toastify"
import { FcGallery } from "react-icons/fc"
import { useModal } from "../../context/Modal"


const ManageDish = () => {
    const dispatch = useDispatch()
    const dishes = useSelector(selectorDishesArray)
    const user = useSelector(state => state.session.user)
    const {closeModal} = useModal()
    const isManage = true

    useEffect(() => {
        dispatch(thunkFetchCurrent())

    },[dispatch])

    const fade = cssTransition({
        enter: "fade-in",
        exit: "fade-out"
      });



    // handle delete funciton
    const handleDelete = async (id) => {
         dispatch(thunkDeleteDish(id)).then(() => {

                closeModal()
            toast.dark("Successfuly Delete Dish", {
                transition: fade
                }   )

      })

    }    

    
    return (
        <main className="manage-container">
            <div className="name">
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable />
            <Navigation />
                <div className="my-dishes">
                    <h2>My Dishes <FcGallery /></h2>
                    </div>

            {dishes.length === 0 && (
                <div style={{textAlign:"center" , height: "80vh"}}><h2>Currently have no dish!!!</h2></div>
             )}
            <DishesList isManage={isManage} handleDelete={handleDelete} dishes={dishes}/>
            {user === null && (
                <div style={{textAlign: "center"}}><h2 style={{color: "red"}}>NOT LOGIN YET!!!</h2></div>
            )}
            </div>

        </main>
    )
}

export default ManageDish