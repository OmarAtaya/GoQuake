import React from 'react'
import Search from '../Search/Search';
import Logo from '../../assets/Logo.png';
import './Header.css';

function Header({searchLocation}) {
    return (
        <div className='header__container'>
            <img src={Logo} alt='' className='header__logo'/>
            <Search searchLocation={searchLocation}/>
        </div>
    )
}

export default Header