// import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteModal.css"




const DeleteModal = ({handleDelete, dishId}) => {
    const {closeModal} = useModal()


   
    return (
    <div className="confirm-container"> 
    <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this dish</p>
        <div className="delete-button-container">
        <button onClick={() => handleDelete(dishId)}>Yes</button>
        < button onClick={closeModal}>No</button>
        </div>
    
    </div>

    )
}

export default DeleteModal