import { useNavigate } from 'react-router-dom'
import './DishesList.css'
import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { FiThumbsDown } from "react-icons/fi";
import { FiThumbsUp } from "react-icons/fi";
import { FaStar } from 'react-icons/fa';

// This function help to generate stars on the card
const starRender = (rating) => {
    let stars = []
    for(let i = 1; i<= rating; i++){
        stars.push(<FaStar key={i} style={{fontSize: "20px"}} className='filled-star'/>)
    }
    return stars
}


const DishesList = ({dishes, isManage, handleDelete}) => {
    const navigate = useNavigate()

    return (
        <div className="dishes-list ">
            {dishes.map(dish => (
                <div key={dish.id} className="dish-post-card">
                    <div onClick={() => navigate(`/dishes/${dish.id}`) } >
                    {dish.dish_images.map(image => (
                        <div key={image.id} className="image-container">
                            <img src={image.image_url} alt={dish.name} />
                        </div>
                    ))}
                    <section className='dish-post-card-info'>
                        <h1>{dish.name}</h1>
                        <p>Vegan: {dish.vegan?<FcCheckmark /> : <FcCancel />}</p>
                        <p>{dish.recommended?<FiThumbsUp /> :<FiThumbsDown />}</p>
                        <p>{dish.description}</p>
                        <p>{starRender(dish.rating)}</p>
                    </section>
                    </div>

                    <div className='user-manage-container'>

                                {     
                                    isManage && (<div>
                                        <button onClick={() => handleDelete(dish.id)}>Delete</button>
                                    </div>)
                                }
                    </div>
                   
                    
                </div>
                

            ))}
            

        </div>
    
        
        
    )

    
}
export default DishesList