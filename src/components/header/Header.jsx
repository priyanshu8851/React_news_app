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
           <a className='github_icon' href='https://github.com/priyanshu8851/React_news_app'> <FaGithub /></a>
        </div>
    </header>
    </>
  )
}

export default Header
