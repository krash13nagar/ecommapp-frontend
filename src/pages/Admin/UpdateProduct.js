import { React, useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Select } from "antd";
import { useAuth } from "../../context/auth";
import { useNavigate,useParams } from "react-router-dom";



const UpdateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState();
  const [id,setId]=useState("");
  const { Option } = Select;


  const {auth}=useAuth();
  const navigate=useNavigate();
  const params=useParams();

  const getSingleProduct=async()=>{
    try {
      const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
      if(data?.success){
        setName(data.product.name);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping);
        setCategory(data.product.category._id);
        setId(data.product._id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getSingleProduct();
  },[])

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/allcategory`
      );
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate=async(e)=>{
      e.preventDefault();
    
      try {
         const productData={name,description,price,category,shipping,quantity};
         if(photo){
          productData.append(photo);
         }

        const {data}=await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,productData,
        {
          headers:{
            "authorization":auth?.token,
            "Content-Type": "multipart/form-data"
          }
        });

        if(data?.success){
          toast.success("Produt successfully Updated");
        }else{
          toast.error(data?.message);
        }
        
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong in update product")
      }
  }

  const handleDelete=async(e)=>{
    e.preventDefault();
    try {
      let answer=window.prompt("Are you Sure to delete this product?");
      if(!answer){
        return;
      }
      const {data}=await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`,{
        headers:{
          "authorization":auth?.token,
        }
      });
      if(data?.success){
        toast.success("delete Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Layout title={"dashboard- create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">

            <h1>Update Product</h1>
            <form onSubmit={handleUpdate} method="put" encType="multipart/form-data">
            <div className="m-1 w-75">
              <Select
                variant={false}
                placeholder="select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
              >
                {categories.map((c) => {
                  return (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
              <div className="mb-3 ">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Image"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden

                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ):(
                  <div className="text-center">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`}
                      alt="product photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  placeholder="description"
                  cols={50}
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  variant={false}
                  placeholder="select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                  value={shipping?"Yes":"No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" >Update Product</button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger"  onClick={handleDelete}>Delete Product</button>
              </div>
            </div>
            </form>
          
           
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UpdateProduct
