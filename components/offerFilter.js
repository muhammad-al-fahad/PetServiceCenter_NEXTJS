import React, {useState, useEffect, useContext} from 'react'
import filterProduct from '../utils/filterProduct'
import { useRouter } from 'next/router'
import { DataContext } from '../redux/store'

const Filter = ({category}) => {

    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [categories, setCategories] = useState('')
    const {state, dispatch} = useContext(DataContext)
    const router = useRouter()
    const {auth} = state

    const select = ">>> Select <<<"

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

    if(!auth.user) return null
    return (
        <div className="form-group input-group">
            <div className='input-group=prepend col-md-2 px-0 my-2'>
                <select name='categories' value={categories} className='form-control text-capitalize w-100 mx-2' onChange={Category}>
                    <option value='all'> All Offers </option>
                    <option value='basic'> Basic </option>
                    <option value='standard'> Standard </option>
                    <option value='premium'> Premium </option>
                </select>
            </div>

            <form autoComplete='off' className='my-2 col-md-8 px-0'>
                <input type="text" className="form-control" value={search.toLowerCase()} placeholder='Search' onChange={(props) => setSearch(props.target.value)}/>
            </form>

            <div className='input-group=prepend col-md-2 my-2'>
                <select name='sort' value={sort} className='form-control text-capitalize w-100' onChange={Sort}>
                    <option value='-createdAt'> Newest </option>
                    <option value='createdAt'> Oldest </option>
                    <option value='endDate'> Duration: Low-High </option>
                    <option value='-endDate'> Duration: High-Low </option>
                    <option value='title'> Ascending </option>
                    <option value='-title'> Descending </option>
                </select>
            </div>
        </div>
    )
}

export default Filter