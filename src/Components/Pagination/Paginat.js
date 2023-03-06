import React, { useEffect } from 'react'
import { Pagination } from 'react-bootstrap'

function Paginat({nPages, currentPage, setCurrentPage}) {
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
    const nextPage = () => {
        if(currentPage !== nPages) 
            setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if(currentPage !== 1) 
            setCurrentPage(currentPage - 1)
    }
    useEffect(() => {
      window.scroll(0,0)
    }, [currentPage])
    
    return (
        <Pagination className='d-flex justify-content-center'>
            <Pagination.First onClick={() => setCurrentPage(1)}/>
            <Pagination.Prev onClick={prevPage}/>
            {pageNumbers.map((number, index)=> {
                return (index + 1) === currentPage
                ?  
                    <div className='d-flex justify-content-center' key={index}>
                        {number > 1 && <Pagination.Item onClick={() => setCurrentPage(index)} key={index-1}>{number - 1}</Pagination.Item>}
                        <Pagination.Item active key={index}>{number}</Pagination.Item>
                        {nPages >= number+1 && <Pagination.Item onClick={() => setCurrentPage(index+2)} key={index+1}>{number+1}</Pagination.Item>}
                    </div>
                :  ''
            })}
            <Pagination.Next onClick={nextPage} className='paginate'/>
            <Pagination.Last onClick={() => setCurrentPage(nPages)}/>
        </Pagination>
    )
}

export default Paginat