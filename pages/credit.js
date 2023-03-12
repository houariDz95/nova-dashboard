import {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Model from '../components/Model';
import {IoMdAdd} from 'react-icons/io';
import {db} from '../utils/firebase';
import {BsFillTrashFill} from "react-icons/bs";
import {MdEdit} from "react-icons/md";
import {IoIosAddCircle} from "react-icons/io"
import {addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {flexCenter} from "../utils/styles";
import { useStateContext } from '../context/ContextProvider';
import { useRouter } from 'next/router';
const Credit = () => {
  const {darkMode, setDarkMode} = useStateContext();
  const [credits, setCredits] = useState([]);
  const [name, setName] = useState('');
  const [model, setModel] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getData = async() => {
      const collectionRef = collection(db, "person");
      const q = query(collectionRef, orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCredits(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
      })  
      return unsubscribe
    }
    getData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "") return;
    setName("");
    const collectionRef = collection(db, "person");
    await addDoc(collectionRef, {
      name: name,
      tasks: [],
      timestamp: serverTimestamp(),
    })
    setName('');
  }
  const openModel = (id) => {
    setModel(true)
    router.push(`/credit?id=${id}`);
  }
  return(
    <div className={darkMode ? 'dark' : ''}>
      <div className="dark:bg-main-dark-bg bg-main-bg dark:text-white text-[#20232A] min-h-screen h-full w-screen">
        <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
        <div>
          <form 
          className={`${flexCenter} md:w-[900px] sm:w-[650px] w-full flex-col md:flex-row gap-2 m-auto mt-10 p-5`} 
          onSubmit={handleSubmit}
          >
            <input className="flex-1 py-1  border-1 border-gray-300 focus:outline-none rounded-md text-md bg-transparent px-1" type="text" placeholder="أضف شخص.." value={name} onChange={(e) => setName(e.target.value)} />
            <button 
            type="submit"  
            className="py-1 px-3 rounded-lg cursor-pointer bg-cyan-500 text-white font-semibold">
              <IoMdAdd size={25} />
          </button>
          </form>
          <div className={`${flexCenter} md:w-[900px] sm:w-[650px] w-full flex gap-5 m-auto mt-10 p-5 flex-wrap`}>
            {credits.map(item => (
              <div key={item.id} 
              className="cursor-pointer w-40 h-40 shadow-md dark:shadow-xl dark:shadow-gray-900 hover:border-1 hover:border-cyan-500 hover:rounded-md rounded-sm flex flex-col justify-between items-center py-5"
              onClick={() => openModel(item.id)}
            >
                <h1 className='text-xl font-bold text-gray-700 dark:text-white' >{item.name}</h1>
                <h1 className='text-xl font-semibold text-teal-500'>{item.tasks.reduce((previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue.price) , 0)}DA</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
      {model && <Model setMedel={setModel} credits={credits} />}
    </div>
  )
}

export default Credit

export const getServerSideProps = async (context) => {
  const myCookie = context.req?.cookies || "";

  if(myCookie.token !== process.env.TOKEN){
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }
  return{
    props: {
      myCookie
    }
  }
}