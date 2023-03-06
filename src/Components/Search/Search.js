import React, {useState} from 'react'
import {AsyncPaginate} from 'react-select-async-paginate';
import { options, GEO_API_URL } from "../../api";
import axios from 'axios';
import './Search.css';

function Search({searchLocation}) {
    const [search, setSearch] = useState();

    const handleOnChange = (searchData) => {
        setSearch(searchData)
        searchLocation(searchData)
    }

    const loadOptions = (inputValue) => {
        return axios.request(
            `${GEO_API_URL}?namePrefix=${inputValue}`,
            options
        ).then(function (response) {
            return {
                options: response.data.data.map((city) => {
                  return {
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.countryCode}`,
                  };
                }),
            };
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <div className='search__container'>
            <AsyncPaginate
                value={search}
                debounceTimeout={600}
                onChange={handleOnChange}
                placeholder="Enter City Name"
                loadOptions={loadOptions}
            />
        </div>
    )
}

export default Search