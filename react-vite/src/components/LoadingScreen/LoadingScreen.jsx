import "./LoadingScreen.css"
import { ClipLoader }  from "react-spinners"

const LoadingScreen = () => {
    return (
    <div className="loading-screen">
        <ClipLoader size={150} color={"#ffc107"} loading={true}/>

    </div>
    )
}

export default LoadingScreen