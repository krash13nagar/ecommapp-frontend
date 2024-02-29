import {React,useState} from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


const ForgotPassword = () => {
   const [email,setEmail]=useState('');
   const [answer,setAnswer]=useState('');
   const [newpassword,setNewpassword]=useState('');
   const navigate=useNavigate();

const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
        const res=await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgotpassword`,{
            email,answer,newpassword
        });
        console.log(res.data);

        if(res && res.data.success){
            toast.success(res.data.message);
            navigate('/login');
        }else{
            toast.error(res.data.mesesage);
        }
       


    } catch (error) {
        console.log(error);
        toast.error("Something went wrong")
    }


}
  return (
    <Layout title={"forgot-password"}>
        <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            value={answer}
            onChange={(e)=>setAnswer(e.target.value)}
            className="form-control"
            id="exampleInputEmail2"
            aria-describedby="emailHelp"
            placeholder="College Name"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={newpassword}
            onChange={(e)=>setNewpassword(e.target.value)}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="New password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Change Password
        </button>
      </form>
    </div>
    </Layout>
  )
}

export default ForgotPassword