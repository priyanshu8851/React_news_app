import React from 'react'
import "./card.css"
const Card = (props) => {
   
  return (
    <>
      <div className="card">
        <img src={props.imgurl} alt="News thumbnail" />
        <h3>{props.title}</h3>
        <p>{props.content}</p>
      </div>
    </>
  )
}

export default Card
