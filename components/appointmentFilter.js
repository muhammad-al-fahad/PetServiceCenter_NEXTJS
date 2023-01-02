import React, {useState, useEffect} from 'react'
import filterProduct from '../utils/filterProduct'
import { useRouter } from 'next/router'

const Filter = ({state}) => {

    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [categories, setCategories] = useState('')

    const {services} = state
    const router = useRouter()

    const Category = (props) => {
        setCategories(props.target.value)
        filterProduct({router, category: props.target.value})
    }

    const Sort = (props) => {
        setSort(props.target.value)
        filterProduct({router, sort: props.target.value})
    }

    useEffect(() => {
        filterProduct({router, search: search ? search.toLowerCase() : 'all'})
    }, [search])


    return (
        <div className="form-group input-group">
            <div className='input-group=prepend col-md-2 px-0 my-2'>
                <select name='categories' value={categories} className='form-control text-capitalize w-100 mx-2' onChange={Category}>
                    <option value='all'> All </option>
                   {
                    services.map(item => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))
                   }
                </select>
            </div>

            <form autoComplete='off' className='my-2 col-md-8 px-0'>
                <input type="text" className="form-control" value={search.toLowerCase()} placeholder='Search' onChange={(props) => setSearch(props.target.value)}/>
            </form>

            <div className='input-group=prepend col-md-2 my-2'>
                <select name='sort' value={sort} className='form-control text-capitalize w-100' onChange={Sort}>
                    <option value='-date'> Newest </option>
                    <option value='date'> Oldest </option>
                </select>
            </div>
        </div>
    )
}

export default Filter