import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
      
    const[articles, setarticles]=useState([])
    const[loading, setloading]=useState(true)
    const[page, setpage]=useState(1)
    const[totalResults, settotalResults]=useState(0)
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    const updatenews =async()=>{
        props.setProgress(10);
        const url=    `http://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
        setloading(true)
        let data = await fetch(url)
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setarticles(parsedData.articles)
        settotalResults(parsedData.totalResults)
        setloading(false)
        props.setProgress(100);

    }
    useEffect(() => {
        updatenews();
       document.title = `${capitalizeFirstLetter(props.category)} - News Point`;
    },[])
    
   
   
  const fetchMoreData = async () => {
       
          
     
        const url=    `http://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`
        setpage(page+1)
        setloading(true)
        let data = await fetch(url)
        let parsedData = await data.json()
        setarticles(articles.concat(parsedData.articles))
        settotalResults(parsedData.totalResults)
        setloading(false)
      };
   
        return (
            <>
            <h2 className='text-center' style={{margin : "40px 0px", marginTop :"90px"}}>News Point - Top {capitalizeFirstLetter(props.category)} Headlines </h2>
            {loading && <Spinner/>}
            <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
        > <div className="container">
              <div className="row ">
                {articles.map((element)=>{
                    return <div className="col-md-4" key={element.url}>
                <NewsItem  title={element.title} description={ element.description } imageURL={element.urlToImage} newsURL={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/> 
                </div>
                })}
                </div>
                </div>
                </InfiniteScroll>
                
            </>
            
        )
    
}
News.defaultProps = {
    country : "in",
    pageSize : 8,
    category : "general"

}

News.propTypes = {
    country : PropTypes.string,
    pageSize :PropTypes.number,
    category: PropTypes.string
}

export default News
