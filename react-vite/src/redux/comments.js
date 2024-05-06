import { createSelector } from 'reselect'



// Action constants
const LOAD_MORE_COMMENTS =  "/comments/more"

const LOAD_COMMENTS = "dishes/:id/comments"

const POST_COMMENT = "/dishes/:id/comments/new"

const EDIT_COMMENT = "/comments/:commentId/edit"

const DELETE_COMMENT = "/comments/:commentId/delete"

const CLEAR_COMMENTS = "/clear/comments"


// Action creator

const loadMoreComments = comments => ({
    type: LOAD_MORE_COMMENTS,
    payload: comments
})


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
const deleteComment = id => ({
    type: DELETE_COMMENT,
    payload: id

})

export const clearComment = () => ({
    type: CLEAR_COMMENTS
})
// thunk action

export const thunkLoadMoreComments = (id,page) => async(dispatch) => {
    const res =  await fetch(`/api/dishes/${id}/comments?page=${page}&per_page=5`)
    if(res.ok){
    
        const moreComments = await res.json()
        if(moreComments.length === 0 ){
            return {errorMessage: "No more comments to load"}
        }
        dispatch(loadMoreComments(moreComments))

    }
    else if(res.status < 500) {
        const errorMessages = await res.json()
        return errorMessages
    }
    else {
        return {server: "Something went wrong. Please try again"}
    }
}



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

// Edit comment Thunk

export const ThunkEditComment = (id,formData)=> async(dispatch) => {
    const res = await fetch(`/api/dishes/comments/${id}`,{
        method:"PUT",
        body: formData

    })
    if(res.ok){
        const comment = await res.json()
        dispatch(editComment(comment))
    }
    else if(res.status < 500) {
        const errorMessages = await res.json()
        return errorMessages
    }
    else {
        return {server: "Something went wrong. Please try again"}
    }
}

// delete comment
export const thunkDeleteComment = (id) => async(dispatch) => {
    const res = await fetch(`/api/dishes/comments/${id}`, {
        method: "DELETE"
    }
    )
    if(res.ok){
        const id = await res.json()
        dispatch(deleteComment(id))

    }
    else if(res.status < 500) {
        const errorMessages = await res.json()
        return errorMessages
    }
    else {
        return {server: "Something is wrong. Please try again"}
    }
}



// grabbing commentIds and comments from comments state 
const getCommentIds = state => state.comments.commentIds;
const getComments = state => state.comments.comments;
//  use those state in create selector to optimize performance and memoize state 
export const selectorCommentsArray = createSelector([getCommentIds, getComments],(commentIds, comments)  =>{
    if(commentIds && comments){
        return commentIds.map(id => comments[id])
    }
    else {
        return []
    }
} 
    
    

    
  
)
    
const initialState = {
    commentIds : [],
    comments: {}
}


const commentReducer = (state =initialState, action ) => {
    switch(action.type){
        case LOAD_COMMENTS:{
            return {...state,
                commentIds: action.payload.map(comment => comment.id),
                comments: action.payload.reduce((acc, comment) => ({...acc, [comment.id]:comment}), {})
                    
                
            }
        }
        case LOAD_MORE_COMMENTS:{
            const newLoadComments = action.payload.reduce((acc, comment) => {
                acc[comment.id] = comment
                return acc
            }, {...state.comments})

            const newLoadCommentsId = Object.keys(newLoadComments).map(id => parseInt(id)).filter(id => !state.commentIds.includes(id))
            return {
                ...state,
                commentIds: [...state.commentIds, ...newLoadCommentsId],
                // using reduce function to normalize the comment data
                comments: newLoadComments
            }
            
            
           
        }
        case POST_COMMENT:
            return{...state,
                commentIds: [action.payload.id, ...state.commentIds],
                comments: {
                    ...state.comments,[action.payload.id]: action.payload
                }
            }
        case EDIT_COMMENT:{
            return {...state,
                commentIds: state.commentIds,
                comments: {...state.comments, [action.payload.id]:action.payload}

            }
        }
        case DELETE_COMMENT: {
            const {[action.payload]: _, ...newCommentsState} = state.comments
            
            
            return {...state,
                commentIds: [...state.commentIds.filter(id => id !== action.payload)],
                comments : newCommentsState

            }
        }
        case CLEAR_COMMENTS :
            return {}
        default:
            return state
    }
}

export default commentReducer