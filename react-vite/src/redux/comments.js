import { createSelector } from 'reselect'



// Action constants

const LOAD_COMMENTS = "dishes/:id/comments"

const POST_COMMENT = "/dishes/:id/comments/new"

const EDIT_COMMENT = "/comments/:commentId/edit"

const DELETE_COMMENT = "/comments/:commentId/delete"

const CLEAR_COMMENTS = "/clear/comments"


// Action creator


const loadComments = comments => ({
    type: LOAD_COMMENTS,
    payload: comments

})
const postComment = comment => ({
    type: POST_COMMENT,
    payload: comment

})
const editComment = comment => ({
    type: EDIT_COMMENT,
    payload: comment

})
const deleteComment = comment => ({
    type: DELETE_COMMENT,
    payload: comment

})

export const clearComment = () => ({
    type: CLEAR_COMMENTS
})
// thunk action
// fetch all comment

export const thunkFetchComments = (id)=> async(dispatch) => {
    const res = await fetch(`/api/dishes/${id}/comments`)
    if(res.ok){
        const comments = await res.json()
        dispatch(loadComments(comments))

    }
    else if(res.status < 500){
        const errorMessages = await res.json()
        return errorMessages
    }
    else {
        return {server: "Something is wrong. Please try again"}
    }
}

export const thunkPostComment = (id, formData) => async(dispatch) => {
    const res = await fetch(`/api/dishes/${id}/comments`, {
        method: "POST",
        body: formData
    })
    if(res.ok){
        const comment = await res.json()
        dispatch(postComment(comment))
    }
    else if(res.status < 500) {
        const errorMessages = await res.json()
        return errorMessages
    }
    else{
        return {server: "Something went wrong. Please try again"}
    }
}
const selectorComments = (state) => state.comments
export const selectorCommentsArray = createSelector(selectorComments, (comments) =>
    Object.values(comments))



const commentReducer = (state ={}, action ) => {
    switch(action.type){
        case LOAD_COMMENTS:{
            const newState = { ...state}
            action.payload.forEach(comment => {
                newState[comment.id] = comment;
            
            })
            return newState
        }
        case POST_COMMENT:
            return{...state,[action.payload.id]:action.payload}
        case CLEAR_COMMENTS :
            return {}
        default:
            return state
    }
}

export default commentReducer