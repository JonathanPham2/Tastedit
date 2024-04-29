import { useEffect, useState } from "react"
import "./CreateDish.css"
import { FaStar } from "react-icons/fa"

// initialize proteins so we can map and display it
const proteins = [
    {name: "Beef", icon: "../../public/icons/beef.png"},
    {name: "Fish", icon: "../../public/icons/fish.png"},
    {name: "Chicken", icon:"../../public/icons/chicken.png"},
    {name: "Lamb", icon: "../../public/icons/lamb.png"},
    {name: "Pork", icon: "../../public/icons/pork.png"},
    {name: "Planted-base", icon: "../../public/icons/planted.png"},

]


const CreateDish = () => {
    const [stage, setStage] = useState(1)
    const [vegan, setVegan] = useState(false)
    const [dishName, setDishName]  = useState("")
    const [protein, setProtein] = useState("")
    const [cuisine, setCuisine] = useState("")
    const [description, setDescription] = useState("")
    const [recommended, setRecommended] = useState(null)
    const [starRating, setStarRating] = useState(0)
    const [starHover, setStarHover] = useState(0)
    const [imageUrl, setImageUrl] = useState(null)
    const [file, setFile] = useState(null)
    const [spicyLevel, setSpicyLevel] = useState("")

    

    // generate thumbnail
    const fileWrap = (e) => {
        e.stopPropagation();
        console.log("files",e.target.files)
    
        const tempFile = e.target.files[0];
    
        // Check for max image size of 5Mb
        if (tempFile.size > 5000000) {
          setFilename(maxFileError); // "Selected image exceeds the maximum file size of 5Mb"
          return
        }
    
        const newImageURL = URL.createObjectURL(tempFile); 
        setImageUrl(newImageURL);
        setFile(tempFile);
        // setFilename(tempFile.name);
        // setOptional("");
      }


    // function will handle star rating
    const starRender = () => {
        let stars = [];
        for(let i = 1; i <= 5; i++){
            stars.push(
                <FaStar 
                key={i}
                className={i <= (starHover || starRating) ? "filled-star": "empty-star"}
                onMouseEnter={() => setStarHover(i)} // this part for hovering
                onMouseLeave={() => setStarHover(0)} // also for hovering
                onClick={() => {
                    if(starRating === i){
                        setStarRating(currentStage => currentStage -1)
                    }
                    else {
                        setStarRating(i)
                    }

                }}
                />
            )
        }
        return stars

    }



    const validateCurrentStage = () => {
        switch (stage) {
            case 1:
                return vegan !== undefined;
            case 2:
                return dishName.trim() !== "" && (vegan || (protein !== "" && cuisine !== "")) && spicyLevel !== "";
            case 3:
                return description.trim() !== "" && recommended !== null && starRating !== 0;
            case 4:
                return file !== null;
            default:
                return false;
        }
    };
    // handle next button
    const handleNext = () => {
        if(validateCurrentStage() ){
            
            setStage(currentStage => currentStage +1)
        }

    }

    // handle protein click
    const handleProteinClick = (proteinName) => {
        setProtein(proteinName);
    
    }
// console.log(dishName,vegan,protein, cuisine,description, recommended, starRating,spicyLevel, file )
const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateCurrentStage()){
        console.log("not validate")
    }

    // initialize form data
    const formData = new FormData();    

    formData.append("name", dishName)
    formData.append("vegan", vegan)
    formData.append("spicy_level", spicyLevel)
    formData.append("cuisine", cuisine)
    formData.append("protein_type", protein)
    formData.append("description", description)
    // formData.append("price", price)
    formData.append("recommended", recommended)
    formData.append("rating", starRating)
    formData.append("images", file)

    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }
   



}
    return (
        <main className="create-form-container">
            <div className="util-container">
                <a href="/"><img className="logo-image" src="../../public/favicon.ico" alt="logo" /></a>
                <button>Save and Exit</button>
            </div>

                {stage === 1 && (
                    <section className={`vegan-section ${stage === 1 ? "" : "hidden"}`}>
                        <h2>Is this a vegan dish?</h2>
                        <div className="vegan-button">
                        <button className="button-yes" onClick={() => {
                            setVegan(true)
                            setStage(2)}}>Yes</button>
                        <button className="button-yes" onClick={() => setStage(2)}>No</button>
                        </div>
                    

                    </section>
                )}
                {stage === 2 &&(
                    <section className={`name-protein  ${stage === 2 ? "" : "hidden"} `}>
                        {/* <h2>What is the name of your dish ?</h2> */}
                        <input 
                        className="dish-name"
                        
                        value={dishName} onChange={(e) => setDishName(e.target.value)} id="dish_name" type="text" />
                        <label htmlFor="dish_name" className="label-name">
                            <span className="content-name">What is the name of your dish?</span>
                        </label>
                        <h2>Select the protein type:</h2>
                        <div className="protein-grid">
                            {proteins.map(({name, icon})=> (
                                <button key={name}
                                className={`protein-button ${protein === name ? "selected" : ""}`}
                                onClick={() => handleProteinClick(name)}>
                                    <img src={icon} alt={name} className="protein-icon" />
                                    <span>{name}</span>
                                </button>
                    

                            ))}
                        </div>
                        {/* <h2>What cuisine is your dish ?</h2> */}
                        <input className="cuisine-text" type="text"
                            id="cuisine"
                            name="cuisine"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                         />
                         <label htmlFor="cuisine" className="cuisine-name">
                            <span className="cuisine-content">What cuisine is your dish?</span>
                        </label>
                        <select onChange={(e) => setSpicyLevel(e.target.value)} value={spicyLevel} name="spicy_level" id="spicy_level">
                            <option value="no spice">No Spice</option>
                            <option value="mild">Mild</option><option value="medium">Medium</option>
                            <option value="very spicy">Very Spicy</option>
                        </select>
        
                    </section>
                )} 
                {stage === 3 &&(
                    <section className={`last-section  ${stage === 3 ? "" : "hidden"} `}>
                        <h2>What's in your dish? Tell us about it!</h2>
                        <textarea onChange={(e) => setDescription(e.target.value)} id="description" type="text" />

                        <h2>Would you recommend this dish to others?</h2>
                            <div className="stage-3-button-container">
                                <button className="button-yes" onClick={() => setRecommended(true)}>Yes</button>
                                <button className="button-no" onClick={() => setRecommended(false)}>No</button>
                            </div>
                        <h2>How many stars would you give your dish</h2>
                        <div className="stars-container">{starRender()} Stars</div>
                    </section>
                )} 
                {stage === 4 && (
                    <section className="upload-image">
                        <h2>Add some photos of your dish</h2>
                        <div className="file-inputs-container">
                            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={fileWrap}/>
                            <label htmlFor="post-image-input" className="file-input-labels-noname"><img src={imageUrl} className="thumbnails-noname"></img></label>
                        </div>

                    </section>
                )}
                

                {stage >1 && stage < 4 &&<div className="back-next-button">
                            <button onClick={() => setStage(currentStage => currentStage - 1)}>Back</button>
                            <button onClick={handleNext}>Next</button>
                        </div>}
                
                {stage === 4 &&  (
                    <button className="post-dish" disabled={!validateCurrentStage()} onClick={handleSubmit}>
                        POST
                    </button>
                )}
                    
        
        </main>

    )
}


export default CreateDish