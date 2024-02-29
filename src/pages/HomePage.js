import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-hot-toast";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const {cart,setCart}=useCart();
  const navigate=useNavigate();
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(()=>{
    if(page===1){
      return;
    }
    loadMore();

  },[page]);
  
  const loadMore=async()=>{
    try {
      setLoading(true);
      const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products,...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
}

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/allcategory`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data?.success) {
        setProducts(data?.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!checked.length || !radio.length) {
      getAllProducts();
    }
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts();
    }
  }, [checked, radio]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const filterProducts = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/filter-product`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"All Product-Best offers"}>
       <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center mt-4"> Filter By categories</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4"> Filter By Prices</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Reset Filter
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p,idx) => {
              return (
                <div className="card m-2" style={{ width: "18rem" }} key={idx}>
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
                    <button  className="btn btn-primary ms-1" onClick={()=>navigate(`/product/${p.slug}`)}>
                      More details
                    </button>
                    <button  className="btn btn-secondary ms-1" onClick={()=>{
                      setCart([...cart,p]);
                      localStorage.setItem('cart',JSON.stringify([...cart,p]));
                      toast.success("item added to cart successfully");
                    }}>
                      Add to Cart
                    </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="m-2 p-3">
          {products && products.length < total && (
            <button
              className="btn loadmore"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? ("Loading...") :( 
                <>
                {" "}
                Loadmore <AiOutlineReload />
              </>
              )}
            </button>
          )}
        </div>
        </div>
       
      </div>
    </Layout>
  );
};

export default HomePage;
