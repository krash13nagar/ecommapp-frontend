import React from 'react'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import useCategory from '../hooks/useCategory'
const Categories = () => {
    const categories=useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container mt-5">
        <div className="row">
            {categories.map((c)=>(
                <div className="col-md-6 mt-4 mb-3 gx-2 gy-2" key={c._id}>
                   
                        <Link to={`/category/${c.slug}`} className="btn cat-btn">{c.name}</Link>
                  
                </div>
            ))}
        </div>
      </div>
    </Layout>
  )
}

export default Categories
