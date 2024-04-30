import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import "./DishDetail.css"
import { useEffect } from "react"

const DishDetail = () => {
    const { id } = useParams()
    const dish = useSelector(state => state.dishes[id])
    const dispatch = useDispatch()

    

    const image = dish?.dish_images[0]
    return (
        <main className="dish-detail-main">
            <Navigation />
            
            <section className="dish-view-container">
                <div className="image-container">
                    <img src={image?.image_url} alt={dish?.name} />
                </div>

            </section>
        </main>
        
    )


}

export default DishDetail