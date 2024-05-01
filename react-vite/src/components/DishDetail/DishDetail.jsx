import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import "./DishDetail.css"
import { useEffect } from "react"
import { thunkFetchSingleDish } from "../../redux/dishes"
import LoadingScreen from "../LoadingScreen"
import { MdMessage } from "react-icons/md";

const DishDetail = () => {
    const { id } = useParams()
    const dish = useSelector(state => state.dishes[id])
    const dispatch = useDispatch()

    useEffect(()=> {
        dispatch(thunkFetchSingleDish(parseInt(id)))
    },[dispatch])
    

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
                        <div className="image-box" >
                        <img key={image.id} src={image.image_url} alt={dish.name} className="dish-image" />
                        </div>

                    ))}
                    
                </div>
                <div className="dish-details-container">
                    <h2>{dish.name}</h2>
                    <p>{dish.description}</p>
                    <div className="dish-detail-list">
                    <div className="dish-info">
                <p>Price Level <span role="img" aria-label="money">💰</span>: {dish.price}</p>
                <p>Spicy Level: {dish.spicy_level}</p>
                <p>Rating: {dish.rating}</p>
               
            </div>
            <hr />
            <div className="comment-count-container"><MdMessage/><span>2</span>
                <div className="line-break">
                </div></div>


                    </div>


                </div>

            </section>
        </main>
        
    )


}

export default DishDetail