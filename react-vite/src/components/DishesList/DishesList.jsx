import './DishesList.css'

const DishesList = ({dishes}) => {
    return (
        <div className="dishes-list ">
            {dishes.map(dish => (
                <div key={dish.id} className="dish-post-card">
                    {dish.dish_images.slice(2).map(image => (
                        <div key={image.id} className="image-container">
                            <img id={`image-${image.id}`} src={image.image_url} alt={dish.name} />
                        </div>
                    ))}
                
                    <h1>{dish.name}</h1>
                    <p>{dish.spicy_level}</p>
                    <p>{dish.vegan}</p>
                    <p>{dish.price}</p>
                    <p>{dish.description}</p>
                    <p>{dish.recommended}</p>
                    <p>{dish.rating}</p>
                    
                </div>
                

            ))}

        </div>
    
        
        
    )

    
}
export default DishesList