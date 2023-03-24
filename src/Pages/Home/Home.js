import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Home.css';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import L, {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Paginat from '../../Components/Pagination/Paginat';

function Home() {
    const [loc, setLoc] = useState();
    const [lati, setLati] = useState(0);
    const [long, setLong] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(16);
    const [earthData, setEarthData] = useState();
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const corner1 = L.latLng(-90, -200)
    const corner2 = L.latLng(90, 200)
    const bounds = L.latLngBounds(corner1, corner2)
    
    useEffect(() => {
        getLocation()
    },[])
    
    const getLocation = async () => {
        const location = await axios.get("https://ipapi.co/json");
        setLoc(`${location.data.city}, ${location.data.country_code}`);
        setLati(location.data.latitude)
        setLong(location.data.longitude)
        const today = new Date();
        const timeset = new Date(new Date().setDate(today.getDate() - 30));
        const searchEarthquake = await axios.get(
            `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${location.data.latitude}&longitude=${location.data.longitude}&maxradiuskm=500&minmagnitude=2&starttime=${(timeset.toISOString()).split('T').shift()}`
            );
        setEarthData(searchEarthquake.data.features)
        console.log(searchEarthquake.data)
        }
        
        const searchLocation = async (searchData) => {
            const [lat, lon] = searchData.value.split(" ");
            setLati(lat)
            setLong(lon)
            setLoc(searchData.label)
            setCurrentPage(1)
            const today = new Date();
            const timeset = new Date(new Date().setDate(today.getDate() - 30));
            const searchEarthquake = await axios.get(
                `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=500&minmagnitude=2&starttime=${(timeset.toISOString()).split('T').shift()}`
                );
                setEarthData(searchEarthquake.data.features)
            }
            
        const currentRecords = earthData?.slice(indexOfFirstRecord, indexOfLastRecord);
        const nPages = Math.ceil((earthData ? earthData.length : 0) / recordsPerPage);
    return (
        <div className='Home'>
            <Header searchLocation={searchLocation}/>
            <div style={{color: 'white'}}>
                <h1>Recent Earthquakes Near You</h1>
                <h2>30 Days, 500 KM Around {loc}</h2>
                <div className='data__container'>
                    {earthData && currentRecords.map((point, index) => {
                        const time = new Date(point.properties.time)
                        if(point.properties.place == null)
                        {
                            return('')
                        }
                        else{
                            return(
                                <div className='data__box' key={index}>
                                    <h2 className='data__mag'>{point.properties.mag}</h2>
                                    <div className='data__info'>
                                        <h5 className='info__text'>{point.properties.place}</h5>
                                        <h5 className='info__text'>
                                            {time.toISOString().split('T').shift()}
                                            <br/>
                                            {(time.toISOString().split('T').pop()).split('.').shift()}
                                        </h5>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <Paginat
                    nPages = { nPages }
                    currentPage = { currentPage } 
                    setCurrentPage = { setCurrentPage }
                />
            </div>
            <div>
                {loc &&
                    <MapContainer maxBoundsViscosity={1.0} maxBounds={bounds} center={[lati,long]} zoom={3} scrollWheelZoom={false} style={{width: '90vw', height: '75vh', borderRadius: '20px', zIndex: '2'}}>
                        <TileLayer
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            style={{width: '100%', height: 'auto'}}
                        />
                        {earthData && earthData.map((point, index) => {
                            return(
                                <Marker key={index} position={[point.geometry.coordinates[1],point.geometry.coordinates[0]]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                                    <Popup>
                                        {point.properties.title}
                                    </Popup>
                                </Marker>  
                            )
                        })}
                        <Circle 
                            center={{lat:lati, lng: long}}
                            fillColor="transparent"
                            weight={1}
                            color="red"
                            radius={500000}
                        />
                    </MapContainer>
                }
            </div>
        </div>
    )
}

export default Home