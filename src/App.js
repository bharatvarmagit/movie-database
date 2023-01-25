/* eslint-disable no-unreachable */
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import { dummy_movies} from './assets/dummyData';
import { useEffect, useState } from 'react';
import {  Button, Grid, Pagination, Paper, TextField } from '@mui/material';

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

function App() {
  // console.log(dummy_movies)

  const [trendingMovies,setTrendingMovies] = useState({})
  const [searchResults,setSearchResults] = useState({})
  const [page,setPage]  = useState('1')
  const [searchText,setSearchText] = useState('')

  useEffect(()=>{
    fetchTrending()
  },[])

  useEffect(()=>{
    console.log("trending movies= ",trendingMovies)
    console.log("searchMovies = ",searchResults)

  },[trendingMovies,searchResults])



  const fetchTrending =async (pageNumber='1')=>{
    const uri = 'https://api.themoviedb.org/3/trending/movie/week?api_key=f0785042a8019945faa6b24189914745&page='+pageNumber
    const response = await fetch(uri)
    const jsonResponse = await response.json()
    console.log("json response \n",jsonResponse)
    setTrendingMovies(prev=>{
      return {[pageNumber]:jsonResponse.results,...prev,total_pages:jsonResponse.total_pages}
      })
    setPage(pageNumber)
    }


    // eslint-disable-next-line no-unreachable


  const onClear=()=>{
    setSearchResults({})
    setPage('1')
    setSearchText('')
  }

  const onSearch=async (pageNumber='1')=>{
     console.log("Searching for",searchText)
      const uri = 'https://api.themoviedb.org/3/search/movie?api_key=f0785042a8019945faa6b24189914745&query='+searchText+'&page='+pageNumber
      const response = await fetch(uri)
      const jsonResponse = await response.json()
      console.log("json respjnse ",jsonResponse)

      setSearchResults(prev=>{
        if(searchText===prev.searchText){
          console.log("search text matched with prev")
         return {[pageNumber]:jsonResponse.results,...prev,total_pages:jsonResponse.total_pages,searchText}
        }
         else{
          console.log("search text did not match with prev")
         return {[pageNumber]:jsonResponse.results,total_pages:jsonResponse.total_pages,searchText}
         }
      })
      setPage(pageNumber)
      //waiting one second for set state to finish loading
    // await delay(1000)

  }
  const handlePagination=async (event,value)=>{
    console.log(value)
    //if page already fetched
    if(value in trendingMovies) setPage(value)
    else{
      await fetchTrending(value)
    }
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    //   /* you can also use 'auto' behaviour
    //      in place of 'smooth' */
    // });
  }

  const handleSearchPagination=async (event,value)=>{
    console.log(value)
    if(value in searchResults)setPage(value)
    else{
      await onSearch(value)

    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  }



  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <div className='searchBarContainer'>
      <TextField id="outlined-basic" label="Search Movies" variant="outlined"  style={{width:'70%'}}
        value={searchText} onChange={e=>setSearchText(e.target.value)}
      />
      <Button variant="contained" color='primary' className='my_btn' style={{marginLeft:10}}
        disabled={!searchText} onClick={()=>onSearch(1)}
      >Search</Button>
      <Button variant="contained" color='error' className='my_btn' style={{marginLeft:10}}
        onClick={onClear}
      >Clear</Button>
      </div>
      <Grid container spacing={2} className='grid_container'>
        {page in trendingMovies  && trendingMovies[page].length && !Object.keys(searchResults).length&&
        trendingMovies[page].map(movie=>
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Paper elevation={3} className='movie_card'>
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
                height={1016/2}
                width={686/2}/>
                {(movie.name || movie.title )&&
                <h2 className='title'>{movie.title?movie.title:movie.name}</h2>
                }
                { movie.release_date&&
                <h3 className='release_date' >{new Date(movie.release_date)>new Date()?'Releasing on '+new Date(movie.release_date).toLocaleDateString():'Released on '+new Date(movie.release_date).toDateString()}</h3>
                }
            </Paper>
          </Grid>
        )}
          {page in searchResults &&
              searchResults[page].map(movie=>
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <Paper elevation={3} style={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',paddingTop:10}}>
                    <img
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                      height={508}
                      width={343}/>
                      {(movie.name || movie.title )&&
                      <h2 className='title'>{movie.title?movie.title:movie.name}</h2>
                      }
                      { movie.release_date&&
                      <h3 className='release_date' >{new Date(movie.release_date)>new Date()?'Releasing on '+new Date(movie.release_date).toLocaleDateString():'Released on '+new Date(movie.release_date).toDateString()}</h3>
                      }
                  </Paper>
                </Grid>
          )}


        {/* <Grid item xs={8}>
          <Paper elevation={3} >xs=8</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3}>xs=4</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} >xs=4</Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={3} >xs=8</Paper>
        </Grid> */}
      </Grid>
      <div className='pagination_container'>
        {Object.keys(trendingMovies).length && ! searchResults['1'] &&
      <Pagination count={trendingMovies.total_pages} color="primary" page={parseInt(page)} onChange={handlePagination}/>
        }
        {searchResults['1']&&
          <Pagination count={searchResults.total_pages} color="primary" className='pagination' page={parseInt(page)} onChange={handleSearchPagination}/>
        }
      </div>


    </div>
  );
}

export default App;
