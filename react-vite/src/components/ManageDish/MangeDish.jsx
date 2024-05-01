import DishesList from "../DishesList"
import { selectorDishesArray, thunkFetchCurrent } from "../../redux/dishes"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Navigation from "../Navigation/Navigation"
import "./ManageDish.css"



const ManageDish = () => {
    const dispatch = useDispatch()
    const dishes = useSelector(selectorDishesArray)
    const user = useSelector(state => state.session.user)
    const isManage = true
    useEffect(() => {
        dispatch(thunkFetchCurrent())

    },[])
    
    return (
        <main className="manage-container">
            <Navigation />
            <DishesList isManage={isManage}  dishes={dishes}/>
            {user === null && (
                <div style={{textAlign: "center"}}><h2 style={{color: "red"}}>NOT LOGIN YET!!!</h2></div>
            )}

        </main>
    )
}

export default ManageDish