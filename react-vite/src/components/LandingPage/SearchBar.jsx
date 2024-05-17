import { useState } from "react";
import "./SearchBar.css"

const SearchBar = ({onSearch}) => {
    // query state
    const[query, setQuery] = useState("")
    

    // handle input function
    const handleInputChange = (e)=>{
        setQuery(e.target.value)

    }
    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(query)

    }

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <input type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for dishes"
             />
             <button type="submit">
                Search

             </button>

        </form>
    )
}
export default SearchBar