import React, { useEffect, useState } from 'react'
import Card from '../components/card/Card'
import { FaSearch } from 'react-icons/fa';
import Loader from '../components/loader/Loader';

const Home = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const key = "a0eb95e54cfd2e5fc63e11fa5f59a409";
    const url = 'https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=20&apikey=' + key;

    const fetchdata = async () => {
        // alert("hii")
        try{
            let res = await fetch(url);
            let jsondata = await res.json();
            console.log(jsondata);
            setData(jsondata.articles); // Directly set articles to data
        }catch(err){
            console.log(err)
        }
      
    }

    const handleSearch = async (searchValue) => {
        setLoading(true)
        let res = await fetch(`https://gnews.io/api/v4/search?q=${searchValue}&lang=en&country=us&max=20&apikey=${key}`);
        let jsondata = await res.json();
        console.log(jsondata);
        setData(jsondata.articles); // Directly set articles to data
        setLoading(false)
    }

    useEffect(() => {
        fetchdata()
    }, [])

    return (
        <>
            <div className="main">
                <div className="homepage container">
                    <br />
                    <div className="searchArea">
                        <input type="text" onChange={(e) => { setSearch(e.target.value) }} placeholder='Search here' />
                        <button onClick={() => { handleSearch(search); }}><FaSearch /></button>
                    </div>
                    <div className="button_area">
                         <button onClick={()=>{handleSearch("Cars")}}>Cars</button>
                         <button onClick={()=>{handleSearch("Accidents")}}>Accidents</button>
                         <button onClick={()=>{handleSearch("Animals")}}>Animals</button>
                         <button onClick={()=>{handleSearch("Delhi")}}>Delhi</button>
                    </div>
                    {
                        loading ? <Loader/> : (
                            <div className="cards-area">
                            {
                                data.map((element, index) => {
                                    return <Card key={index} title={element.title} content={element.description} imgurl={element.image} />
                                }) 
                            }
                        </div>
                        )
                    }
                   <footer>
                    <p>Made by priyanshu</p>
                   </footer>
                </div>
            </div>
        </>
    )
}

export default Home
