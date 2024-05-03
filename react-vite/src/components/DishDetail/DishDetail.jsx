import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import "./DishDetail.css"
import { useEffect, useState } from "react"
import { thunkFetchSingleDish, thunkUpdateDish, } from "../../redux/dishes"
import LoadingScreen from "../LoadingScreen"
import { MdMessage,MdEdit, MdSave } from "react-icons/md";
import { clearComment, selectorCommentsArray, thunkFetchComments, thunkPostComment } from "../../redux/comments"




const DishDetail = () => {
    const { id } = useParams()
    const user = useSelector(state => state.session.user)
    const dish = useSelector(state => state.dishes[id])
    const comments = useSelector(selectorCommentsArray)
    const [commentData, setCommentData] = useState("")
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});

    // useEffect(()=> {
    //     dispatch(thunkFetchSingleDish(parseInt(id)))
    // },[dispatch,id])

    
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
    const sortedComments = comments.sort((a,b)=>{
        return new Date(b.created_at) - new Date(a.created_at)
    })

//  post comment
const submitComment = async () => {
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
    //  enter key on submit
     const enterKey = (e) => {
        if(e.key ==="Enter" && !e.shiftKey){
            e.preventDefault()
            submitComment(e)
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
                        <>
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
                                    <p><span>Restaurant Id</span>: {dish.restaurant_id}</p>
                                    <p><span>Calories</span>: ?</p>


                                </div>
                            </div>

                           {user?.id === dish.user_id && <button onClick={() => setEditMode(true)}><MdEdit /> Edit</button>}
                        </>
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

                    <>
                        <h2>Comments</h2>
                        {comments.map(comment => (
                            <div key={comment.id} className="comment-content">
                            <p className="user-name">Anomnymous</p>
                            <p  key={comment.id}>{comment.comment}</p>
                            </div>
                        ))}
                    </>

                </section>
                <section className="input-comment-box">
                    
                    <textarea onKeyDown={enterKey} value={commentData} className="text-field" name="comment" onChange={(e) => setCommentData(e.target.value)} ></textarea>
                    <button onClick={submitComment} disabled={!commentData.trim()}>Submit</button>

                </section>
            </div>

        </main>
        
    )


}

export default DishDetail