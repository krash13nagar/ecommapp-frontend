import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/ProductDetailsStyles.css";
const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [relatedProducts,setRelatedProducts] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data.product._id,data.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

const getSimilarProduct = async(pid,cid)=>{
    try {
        const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
        setRelatedProducts(data.products);

        
    } catch (error) {
        console.log(error);
    }
}


  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-4">
          <img
            src={product._id?`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`:""}
            className="card-img-top"
            alt={product.name}
            height={"300px"}
            width={"150px"}
          />
        </div>
        {
            product._id?<> <div className="col-md-6 product-details-info text-center mb-4">
            <h2 className="text-center mb-4">Product Details</h2>
            <h5>Name: {product.name}</h5>
            <h5>Description: {product.description}</h5>
            <h5>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h5>
            <h5>Category:{product.category.name}</h5>
          </div></>:<></>
        }

      </div>
      <hr />

      <div className="row container similar-products">
        <h3>Similar Products</h3>
        {relatedProducts.length<1 && (<p className="text-center">No Similar Products</p>)}
        <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => {
              return (
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                    </div>
                    <p className="card-text">
                      {p.description.substring(0, 30)}
                    </p>
                    <div className="card-name-price">
                    <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    {console.log(p.slug)}
                    More Details
                  </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
