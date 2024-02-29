import { React, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import CategoryForm from "../../components/Form/CategoryForm";
import { useAuth } from "../../context/auth";
import { Modal} from 'antd'
const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const { auth } = useAuth();
  const [visible,setVisible]=useState(false);
  const [selected,setSelected]=useState(null);
  const [updatedName,setUpdatedName]=useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,{name},
        {
          headers: {
            "authorization": auth.token,
          },
        }
      );

      if (data?.success) {
        toast.success(`${data.category.name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in input category form");
    }
  };

  const handleUpdate=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,{name:updatedName},
      {
        headers:{
          "authorization": auth.token,
        }
      }
      );
      if(data?.success){
         toast.success("updated successfully");
         setSelected(null);
         setUpdatedName("");
         setVisible(false);
         getAllCategory();
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error("error in update category");
    }

  }

  const handleDelete=async(id)=>{

    try {
      const {data}=await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`,
      {
        headers:{
          "authorization": auth.token,
        }
      }
      );
      if(data?.success){
         toast.success("Deleted successfully");
         setSelected(null);
         getAllCategory();
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error("error in delete category");
    }

  }

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

  return (
    <Layout title={"dashboard- create Category"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => {
                    return (
                      <>
                        <tr>
                          <td key={c._id}>{c.name}</td>
                          <td>
                            <button className="btn btn-primary ms-2" onClick={()=>{setVisible(true);setUpdatedName(c.name);setSelected(c)}}>Edit</button>
                            <button className="btn btn-danger ms-2" onClick={()=>{handleDelete(c._id)}}>Delete</button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Modal onCancel={()=>setVisible(false)} footer={null} open={visible}>
            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
