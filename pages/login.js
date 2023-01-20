import {useState} from 'react';
import {SlScreenSmartphone} from "react-icons/sl";
import Navbar from '../components/Navbar';
import {useRouter} from 'next/router';
import axios from 'axios';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()
  const handelClick = async () => {
    try{
     const res =await axios.post('https://nova-dashboard.vercel.app/api/auth/login', {
        username,
        password
      })
      if(res.status === 200) router.push('/')
    }catch(err){
      console.log(err)
      setError(true);
    }
  }

  return(
    <div className={darkMode ? "dark" : ""} style={{height: "100vh"}}>
      <div className="h-full w-screen bg-main-bg dark:bg-main-dark-bg dark:text-[#20232A] text-white  ">
      <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
        <div className="h-[80%] w-full flex items-center justify-center">
        <form className="w-[320px] h-[280px] p-4 flex flex-col dark:bg-main-bg bg-main-dark-bg items-center gap-8">
          <h1 className="text-2xl font-bold flex items-center dark:text-[#20232A] text-white "> <SlScreenSmartphone size={30} className="text-cyan-500"/> NovaPhone</h1>
          <input className="border-b-1 border-gray-500 w-full focus:outline-none bg-transparent p-2" type="text" placeholder="username"value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input className="border-b-1  border-gray-500 w-full focus:outline-none bg-transparent p-2"  type="password" placeholder="password"value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="button" className="bg-cyan-500 px-10 py-2 cursor-pointer text-white text-md font-semibomd rounded-sm" onClick={handelClick}>Login</button>
          {error && <span className="text-red-500">Wrong Credentials</span>}
        </form>
        </div>
      </div>
    </div>
  )
}

export default Login