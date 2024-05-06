import { useNavigate } from 'react-router-dom'
import './DishesList.css'
import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { FiThumbsDown } from "react-icons/fi";
import { FiThumbsUp } from "react-icons/fi";
import { FaStar } from 'react-icons/fa';
import { LazyLoadImage } from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';
import React from 'react';
import { useModal } from '../../context/Modal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteModal from '../DeleteModal/DeleteModal';


// This function help to generate stars on the card
const starRender = (rating) => {
    let stars = []
    for(let i = 1; i<= rating; i++){
        stars.push(<FaStar key={i} style={{fontSize: "20px"}} className='filled-star'/>)
    }
    return stars
}


const DishesList = React.memo(({dishes, isManage, handleDelete, explored}) => {
    const navigate = useNavigate()

    

    return (
        <div className="dishes-list " >
            {dishes.map(dish => (
                <div key={dish.id} className="dish-post-card">
                    <div onClick={() => navigate(`/dishes/${dish.id}`) } >
                    {dish.dish_images.map(image => (
                        <div key={image.id} className="image-container">
                                <LazyLoadImage
                                key={image.id}
                                alt={dish.name}
                                src={image.image_url}
                                effect="blur"
                                width={"100%"}
                                height={"100%"}
                                />
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
                                       <OpenModalMenuItem className={"delete-dish-button"}  modalComponent={<DeleteModal handleDelete={handleDelete} dishId={dish.id} />} itemText={"Delete"}/>
                                    </div>)
                                }
                    </div>
                   
                    
                </div>
                

            ))}
            

        </div>
    
        
        
    )

    
})
DishesList.displayName = 'DishesList';
export default DishesList