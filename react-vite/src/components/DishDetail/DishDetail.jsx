import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import "./DishDetail.css"
import { useEffect, useState } from "react"
import { thunkFetchSingleDish, thunkUpdateDish, } from "../../redux/dishes"
import LoadingScreen from "../LoadingScreen"
import { MdMessage,MdEdit, MdSave } from "react-icons/md";




const DishDetail = () => {
    const { id } = useParams()
    const user = useSelector(state => state.session.user)
    const dish = useSelector(state => state.dishes[id])
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});

    // useEffect(()=> {
    //     dispatch(thunkFetchSingleDish(parseInt(id)))
    // },[dispatch,id])

    

    useEffect(() => {
        if (!dish.comments) {
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

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };


    

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
console.log(dish.comments)
    

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
                            <select name="spicy level" id="spicy_level" value={editData.spicy_level} onChange={handleChange}>
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
                            <h2>{dish.name}</h2>
                            <div className="dish-info">
                                 <p>{dish.description}</p>
                                <p>Cuisine: {dish.cuisine}</p>
                                <p>Price Level <span role="img" aria-label="money">💰</span>: {dish.price}</p>
                                <p>Spicy Level: {dish.spicy_level}</p>
                                <p>Rating: {dish.rating}</p>
                            </div>

                           {user?.id === dish.user_id && <button onClick={() => setEditMode(true)}><MdEdit /> Edit</button>}
                        </>
                    )}
                    <hr />
                    <div className="comment-count-container">
                        <MdMessage /><span>{dish.comments.length}</span> 
                    </div>






                    {/* </div> */}


                </div>

            </section>
            <section className="comment-container">

            </section>
        </main>
        
    )


}

export default DishDetail