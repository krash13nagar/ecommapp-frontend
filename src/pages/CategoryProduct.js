import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import "../styles/CategoryProductStyles.css";

const CategoryProduct = () => {
    const [products,setProducts]=useState();
    const [category,setCategory]=useState();
    const params=useParams();
    const navigate=useNavigate();
    const getProductByCat=async()=>{
        try {
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(params?.slug){
            getProductByCat();
        }
       
    },[params?.slug])
  return (
    <Layout>
      <div className="container mt-3 category">
        <h1 className="text-center">{category?.name}</h1>
        <h3 className='text-center'>{products?.length} result found</h3>
        <div className="row">
        <div className="col-md-9 offset-1">
          <div className="d-flex flex-wrap">
            {products?.map((p) => {
              return (
                <div className="card m-4" style={{ width: "18rem" }} key={p._id}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}
                    </p>
                    <h5 className="card-title card-price">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>

                    <div className="card-name-price">
                    <button  className="btn btn-info ms-1" onClick={()=>navigate(`/product/${p.slug}`)}>
                      More details
                    </button>
                    {/* <button  className="btn btn-secondary ms-1">
                      Add to Cart
                    </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <div className="m-2 p-3">
          {products && products.length < total && (
            <button
              className="btn btn-warning"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "Loading..." : "Loadmore"}
            </button>
          )}
        </div> */}
        </div>
       
        </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct
