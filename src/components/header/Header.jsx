import React from 'react'
import "./Header.css"
import { FaGithub } from "react-icons/fa";
const Header = () => {
  return (
    <>
    <header className="main">
        <div className="innerHeader container">
            <span className="logo">
                New-z
            </span>
           <span className='github_icon'> <FaGithub /></span>
        </div>
    </header>
    </>
  )
}

export default Header
