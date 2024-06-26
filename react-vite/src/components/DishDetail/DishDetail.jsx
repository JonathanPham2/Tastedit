import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import "./DishDetail.css"
import { useEffect, useRef, useState } from "react"
import { thunkFetchSingleDish, thunkUpdateDish, } from "../../redux/dishes"
import LoadingScreen from "../LoadingScreen"
import { MdMessage,MdEdit, MdSave, MdFavorite } from "react-icons/md";

import { ThunkEditComment, clearComment, selectorCommentsArray, thunkDeleteComment, thunkFetchComments, thunkLoadMoreComments, thunkPostComment } from "../../redux/comments"
import { ToastContainer,  toast, cssTransition} from "react-toastify"
import { BiCommentEdit } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";
import LoginFormModal from "../LoginFormModal"
import { useModal } from "../../context/Modal"





const fade = cssTransition ({
    enter: "fade-in",
    exit: "fade-out"
})



const DishDetail = () => {
    const { id } = useParams()
    const user = useSelector(state => state.session.user)
    const dish = useSelector(state => state.dishes[id])
    const comments = useSelector(selectorCommentsArray)
    const [currentPage, setCurrentPage] = useState(1)
    const [commentData, setCommentData] = useState("")
    const [isLoadComment, setIsLoadComment] = useState(true)
    const [editCommentId, setEditCommentId] = useState(null)
    const [editCommentData, setEditCommentData] = useState("")
    const [deleteCommentId, setDeleteCommentId] = useState(null)
    const {setModalContent} = useModal() // using modal context to open login modal if user not log in
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const editInPutRef = useRef(null)
    const deleteRef = useRef(null)

   

    
    // css effect
    // handle click outside of comment edit mode
    useEffect(() => {
        const handleClickOutside = (e) => {
            e.stopPropagation()
            if( editCommentId&& editInPutRef.current && !editInPutRef.current.contains(e.target)){
    
                setEditCommentId(null)
                setEditCommentData("")
               
            }
            
        }
        // 
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
        
    },[editCommentId, deleteCommentId])

    useEffect(() => {
        const handleClickOutside = (e) => {
            e.stopPropagation()
            
            if(deleteCommentId && deleteRef.current && !deleteRef.current.contains(e.target)){
                setDeleteCommentId(null)
            }
        }
        // 
        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
        
    },[editCommentId, deleteCommentId])


// console.log(commentData)
    
    
// fetch dish if not exist yet
    useEffect(() => {
        if ( !dish) {
            dispatch(thunkFetchSingleDish(parseInt(id)));
        } else {
            setEditData({
                name: dish.name,
                cuisine: dish.cuisine,
                description: dish.description,
                price: dish.price,
                spicy_level: dish.spicy_level,
                rating: dish.rating
            });
        }
    }, [dispatch, id, dish]);
    
    // fetch comments when mount and clear comment state when unmounts

    useEffect(() => {
        dispatch(thunkFetchComments(id))
        //clear comments from other dish post other would be stack together 
        return ()=> {
            dispatch(clearComment())
        }
    },[dispatch,id])

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };
    // const sortedComments = comments.sort((a,b)=>{
    //     return new Date(b.created_at) - new Date(a.created_at)
    // })
    //  function that open the modal if invoke
    const openLoginModal = () => {
       setModalContent(<LoginFormModal/>)
    }

//  post comment and edit comment
const submitComment = async () => {

    if(editCommentId){
        const formData = new FormData()
        formData.append("comment", editCommentData)
        
        const serverResponse = await dispatch(ThunkEditComment(editCommentId,formData))
        
        if(serverResponse){
            toast.dark("Edit failed. Please try again", {
                transition: fade
            })
        }

        else {

            setEditCommentId(null)
            setEditCommentData("")
        }

    
    }



    else if( user && !editCommentId && !editCommentData){
            const formData = new FormData();
            formData.append("comment", commentData)
            const serverResponse = await dispatch(thunkPostComment(id,formData))
    
                if(serverResponse){
                    console.log(serverResponse)
                    }
                    else {
                        setCommentData("")
                    }
        }
        else if (!user) {
            openLoginModal()
        }


}
// delete confirm pop up
const toggleDeleteConfirm = (e, commentId) => {
    e.stopPropagation()
    setDeleteCommentId(prev => (prev === commentId ? null : commentId))

}

// handle delete
    const deleteComment = async  (id) => {
       const serverResponse =  await  dispatch(thunkDeleteComment(id))
       if(serverResponse) {
        toast.dark("Failed to delete. Please try again",{
            transition: fade,
            style:{
                    
                color:"#ffc107",
                background: "linear-gradient(120deg, #2c3e50, #4c5c68)",
                fontWeight: "bold"
            }
        }
        
        )
       }
       else {
        toast.dark("Successfully delete comment",
        {
            transition: fade,
            style:{
                    
                color:"#ffc107",
                background: "linear-gradient(120deg, #2c3e50, #4c5c68)",
                fontWeight: "bold"
            }
        }
        )
        setDeleteCommentId(null)
       }
    }   
    
    
    
    //  enter key on submit
     const enterKey = (e) => {
        if(e.key ==="Enter" && !e.shiftKey){
            // e.preventDefault()

          if(!user){
            openLoginModal()
          }
           else if(commentData.trim() && user) {
            submitComment()
          }
           
        }
    }
// Edit comment toggle
// we have to pass down the comment and use that comment id
// to match the edit comment id so it when we hit edit it won't trigger all the comment 
    const toggleEdit =  (comment) => {
        // if it already match and user hit edit again meaning to close it
        if(editCommentId === comment.id){
            setEditCommentId(null)
            setEditCommentData("")
        }
        else {
           setEditCommentId(comment.id)
           setEditCommentData(comment.comment)
        }
    
        
    }


// Load more comments function
    const loadMoreComments = async () => {
        let nextPage = currentPage + 1
       const response = await  dispatch(thunkLoadMoreComments(id, nextPage))

       if(response){
            toast.dark(response.errorMessage,{
                transition: fade,
                style:{
                    
                    color:"#ffc107",
                    background: "linear-gradient(120deg, #2c3e50, #4c5c68)",
                    fontWeight: "bold"
                }
            })
            setIsLoadComment(false)
        
       }
       else {
        setCurrentPage(nextPage)
        
       }
    }
    


    const saveChanges = () => {
        const formData = new FormData();
        formData.append("name", editData.name)
        formData.append("cuisine", editData.cuisine)
        formData.append("description", editData.description)
        formData.append("price", editData.price)
        formData.append("spicy_level", editData.spicy_level)
        formData.append("rating", editData.rating)
        formData.append("restaurant_id",dish.restaurant_id)
        formData.append("vegan",dish.vegan)
        formData.append("protein_type",dish.protein_type)
        formData.append("recommended",dish.recommended)





        dispatch(thunkUpdateDish(id, formData));
        setEditMode(false);
        // navigate(`/dishes/${id}`)
    };

    

    if(!dish){
        return(
            <LoadingScreen/>
        )
    }

    

    return (
        <main className="dish-detail-main">
            <Navigation />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable/>
            
            
            <section className="dish-view-container">
                <div className="image-container2">
                    {dish.dish_images.map(image => (
                        <div key={image.id} className="image-box" >
                        <img key={image.id} src={image.image_url} alt={dish.name} className="dish-image" />
                        </div>

                    ))}
                    
                </div>
                {/* Did not imeplement edit for vegan, image, recommended yet */}
                <div className="dish-details-container">
                {editMode && user?.id === dish.user_id ? (
                        <div className="grid-dish-input">
                            <label style={{fontWeight: "bold"}}>Dish name:
                            <input className="input-field" type="text" value={editData.name} name="name" onChange={handleChange} />
                            </label>
                            <label style={{fontWeight: "bold"}}>Description:

                            <textarea id="box-description" name="description" value={editData.description} onChange={handleChange} />
                            </label>
                            <label style={{fontWeight: "bold"}}>Cuisine:
                            <input className="input-field" type="text" value={editData.cuisine} name="cuisine" onChange={handleChange}/>
                            </label>
                            <label style={{fontWeight: "bold"}}>Price:
                            <select name="price" className="input-field" value={editData.price} onChange={handleChange}>
                            <option value="Budget-friendly">Budget-friendly</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Expensive">Expensive</option>
                            </select>
                            </label>
                            <label style={{fontWeight: "bold"}}>Spicy Level:
                            <select className="input-field" name="spicy_level" id="spicy_level" value={editData.spicy_level} onChange={handleChange}>
                                <option value="no spice">no spice</option>
                                <option value="medium">medium</option>
                                <option value="very spicy">very spicy</option>
                            </select>
                            </label>
                            <label style={{fontWeight: "bold"}}>Rating:
                            <input className="input-field"  type="number" value={editData.rating} name="rating" onChange={handleChange} min="1" max="5" />
                            </label>
                            <button className="save-button" onClick={saveChanges}><MdSave /> Save</button>
                            <button className="save-button" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <h3>{dish.name}</h3>
                            <div className="grid-dish-info">
                                <div className="dish-info">
                                    <p>{dish.description}</p>
                                    <p><span>Cuisine</span>: {dish.cuisine}</p>
                                    <p><span>Price Level</span> <span role="img" aria-label="money">💰</span>: {dish.price}</p>
                                    <p><span>Spicy Level</span>: {dish.spicy_level}</p>
                                    <p><span>Rating</span>: {dish.rating}</p>
                                </div>
                                <div className="dish-info">
                                    <p><span>Protein Type</span>: {dish.protein_type? dish.protein_type : "Not available"}</p>
                                    <p><span>Restaurant Name</span>: {dish.restaurant.name}</p>
                                    <p><span>Calories</span>: Coming soon</p>


                                </div>
                            </div>

                           {user?.id === dish.user_id && <button className="save-button" onClick={() => setEditMode(true)}><MdEdit /> Edit</button>}
                        </div>
                    )}
                    <hr/>
                    <div className="comment-count-container">
                        <MdMessage /><span>{comments.length}</span> 
                        <MdFavorite /><span>{dish.favorites.length}</span>

                    </div>






                    {/* </div> */}


                </div>

            </section>
            <div className="comment-input">
                <section className="comment-container">

                    <div>
                        <h2>Comments</h2>
                        <div className="comment-box"  ref={editInPutRef}>
                        { comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} className="comment-content">
                                <p className="user-name">{comment.user.username}</p>
                                {editCommentId === comment.id ? (<input onKeyDown={enterKey}  value={editCommentData} onChange={(e) =>setEditCommentData(e.target.value)} />) :<p>{comment.comment}</p>}
                                {user?.id === comment.user_id && (
                                    <div className="user-comment-action">
                                        {editCommentId === comment.id ? (
                                        <><button className="edit-comment-button" onClick={submitComment}>Submit</button>
                                        <button  className="delete-comment-button" onClick={() => setEditCommentId(null)}>Cancel</button></>): 
                                        <><button className="edit-comment-button" onClick={() => toggleEdit(comment)}><MdEdit /> Edit
                                        </button>
                                        <button className="delete-comment-button" onClick={(e) =>  toggleDeleteConfirm(e, comment.id)}><FaRegTrashCan /></button>
                                        {deleteCommentId === comment.id && (
                                            <div ref={deleteRef} className="delete-confirm">
                                                <p>Do you really want to delete this comment</p>
                                                <button className="comment-submit-edit" onClick={() => deleteComment(comment.id)}>Yes</button>
                                                <button className="edit-comment-button" onClick={() => setDeleteCommentId(null)}>Cancel</button>

                                            </div>
                                        )}
                                        </>

                                        
                                    }
                                        


                                    </div>


                                )}
                        
                            </div>
                        )) : <h3>No comment yet</h3> }
                        </div>
                    </div>

                </section>
                <section className="input-comment-box">
                    <h3>Write your Comment</h3>
                    
                    <textarea  onKeyDown={enterKey} value={commentData} className="text-field" name="comment" onChange={(e) => setCommentData(e.target.value)} ></textarea>
                      <button className="post-button" onClick={submitComment} disabled={!commentData.trim()}>POST</button>

                        
                    <button className="load-button" onClick={loadMoreComments} disabled={!isLoadComment}>Load More Comments</button>

                </section>
            </div>

        </main>
        
    )


}

export default DishDetail