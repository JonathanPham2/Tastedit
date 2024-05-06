import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import "./DishDetail.css"
import { useEffect, useRef, useState } from "react"
import { thunkFetchSingleDish, thunkUpdateDish, } from "../../redux/dishes"
import LoadingScreen from "../LoadingScreen"
import { MdMessage,MdEdit, MdSave } from "react-icons/md";
import { ThunkEditComment, clearComment, selectorCommentsArray, thunkDeleteComment, thunkFetchComments, thunkLoadMoreComments, thunkPostComment } from "../../redux/comments"
import { ToastContainer,  toast, cssTransition} from "react-toastify"
import { BiCommentEdit } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";




const fade = cssTransition ({
    enter: "fade-in",
    exit: "fade-out"
})



const DishDetail = () => {
    const { id } = useParams()
    const user = useSelector(state => state.session.user)
    const dish = useSelector(state => state.dishes[id])
    const comments = useSelector(selectorCommentsArray)
    console.log("This is the comment state",comments)
    const [currentPage, setCurrentPage] = useState(1)
    const [commentData, setCommentData] = useState("")
    const [isLoadComment, setIsLoadComment] = useState(true)
    const [editCommentId, setEditCommentId] = useState(null)
    const [editCommentData, setEditCommentData] = useState("")
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const editInPutRef = useRef(null)

    
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

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("moussedown", handleClickOutside)
        }
        
    },[editCommentId])


    
    
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
    }, [dispatch, id]);
    
    // fetch comments when mount and clear comment state when unmounts

    useEffect(() => {
        dispatch(thunkFetchComments(id))
        //clear comments from other dish post other would be stack together 
        return ()=> {
            dispatch(clearComment())
        }
    },[id])

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };
    // const sortedComments = comments.sort((a,b)=>{
    //     return new Date(b.created_at) - new Date(a.created_at)
    // })

//  post comment and edit comment
const submitComment = async () => {

    if(editCommentId){
        const formData = new FormData()
        console.log(editCommentData)
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



    else if(!editCommentId && !editCommentData){
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


}
// handle delete
    const deleteComment = (id) => {
        dispatch(thunkDeleteComment(id))
    }   
    
    
    
    //  enter key on submit
     const enterKey = (e) => {
        if(e.key ==="Enter" && !e.shiftKey){
            e.preventDefault()

        
            if(user){
            submitComment(e)
            }
            else{
                return
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
                transition: fade
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
                        <div className="dish-info">
                            <input type="text" value={editData.name} name="name" onChange={handleChange} />
                            <textarea id="box-description" name="description" value={editData.description} onChange={handleChange} />
                            <input type="text" value={editData.cuisine} name="cuisine" onChange={handleChange}/>
                            <input type="text" value={editData.price} name="price" onChange={handleChange} />
                            <select name="spicy_level" id="spicy_level" value={editData.spicy_level} onChange={handleChange}>
                                <option value="no spice">no spice</option>
                                <option value="medium">medium</option>
                                <option value="very spicy">very spicy</option>
                            </select>
                            <input type="number" value={editData.rating} name="rating" onChange={handleChange} min="1" max="5" />
                            <button onClick={saveChanges}><MdSave /> Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
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
                                    <p><span>Protein Type</span>: {dish.protein_type}</p>
                                    <p><span>Restaurant Name</span>: {dish.restaurant_id}</p>
                                    <p><span>Calories</span>: Coming soon</p>


                                </div>
                            </div>

                           {user?.id === dish.user_id && <button onClick={() => setEditMode(true)}><MdEdit /> Edit</button>}
                        </div>
                    )}
                    <hr/>
                    <div className="comment-count-container">
                        <MdMessage /><span>{comments.length}</span> 
                    </div>






                    {/* </div> */}


                </div>

            </section>
            <div className="comment-input">
                <section className="comment-container">

                    <div>
                        <h2>Comments</h2>
                        <div ref={editInPutRef}>
                        {comments.map(comment => (
                            <div key={comment.id} className="comment-content">
                                <p className="user-name">Anomnymous</p>
                                {editCommentId === comment.id ? (<input onKeyDown={enterKey}  value={editCommentData} onChange={(e) =>setEditCommentData(e.target.value)} />) :<p>{comment.comment}</p>}
                                {user.id === comment.user_id && (
                                    <div className="user-comment-action">
                                        {editCommentId === comment.id ? (
                                        <><button onClick={submitComment}>Submit</button>
                                        <button onClick={() => setEditCommentId(null)}>Cancel</button></>): 
                                        <><button onClick={() => toggleEdit(comment)}><BiCommentEdit />
                                        </button>
                                        <button onClick={() =>  deleteComment(comment.id)}><FaRegTrashCan /></button></>
                                        
                                    }
                                        


                                    </div>


                                )}
                        
                            </div>
                        ))}
                        </div>
                    </div>

                </section>
                <section className="input-comment-box">
                    
                    <textarea  onKeyDown={enterKey} value={commentData} className="text-field" name="comment" onChange={(e) => setCommentData(e.target.value)} ></textarea>
                    <button onClick={submitComment} disabled={!commentData.trim()}>Submit</button>
                    <button onClick={loadMoreComments} disabled={!isLoadComment}>Load More Comments</button>

                </section>
            </div>

        </main>
        
    )


}

export default DishDetail