import React,{useState,useEffect} from 'react';
import { CssBaseline,Grid } from "@material-ui/core";

import { getPlacesdata,getWeatherData } from "./api/index";

import Header from './components/Header/Header';
import Map from './components/Map/Map';
import List from './components/List/List';


const App = () => {

    const [places, setplaces] = useState([]);
    const [weatherData, setweatherData] = useState([])

    const [coordinates, setcoordinates] = useState({});
    const [bound, setbound] = useState({});

    const [filteredPlaces, setfilteredPlaces] = useState([])

    const [type, settype] = useState('restaurants')
    const [rating, setrating] = useState('')

    const [loading, setloading] = useState(false)
    const [childClicked, setchildClicked] = useState(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({coords : { latitude,longitude}}) => {
            setcoordinates({lat:latitude,lng:longitude})
        })
    },[])

    useEffect(() => {
        const filteredPlaces = places.filter((places) => places.rating > rating)

        setfilteredPlaces(filteredPlaces)
    },[rating])

    useEffect(() => {
        // console.log(bound);
        if(bound.sw && bound.ne){
            setloading(true);

            getWeatherData(coordinates.lat,coordinates.lng)
                .then((data) => setweatherData(data))
        
            getPlacesdata(type,bound.sw,bound.ne)
            .then((data) => {
                // console.log(data);
                setplaces(data?.filter((place) => place.name && place.num_reviews>0))
                setfilteredPlaces([])
                setloading(false);
            })
        }   
    }, [type,bound])

    return (
        <>
            <CssBaseline/>
            <Header setcoordinates={setcoordinates} />
            <Grid container spacing={3} style ={{width:'100%'}}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        loading={loading}
                        type={type}
                        settype={settype}
                        rating={rating}
                        setrating={setrating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        setcoordinates={setcoordinates}
                        setbound={setbound}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setchildClicked={setchildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default App;