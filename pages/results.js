import { useState } from 'react';
import Navbar from '../components/Navbar';
import { flexCenter } from '../utils/styles';
import {IoMdAdd} from 'react-icons/io';
import {db} from "../utils/firebase";
import {collection, where, query,   onSnapshot, doc, deleteDoc, updateDoc, getDoc} from 'firebase/firestore';
import { useStateContext } from '../context/ContextProvider';
import {MdEdit} from "react-icons/md";
import { useRouter } from 'next/router';
import moment from 'moment'
const Model = ({results, setUpdate}) =>{
  const router= useRouter()
  const id = router.query.id;
  const post = results.filter(item => item.id === id)
  const [name, setName] = useState(post[0]?.name)
  const [price, setPrice] = useState(post[0]?.price);
  const [soldPrice, setSoldPrice] = useState(post[0].soldPrice)

  const update = async () => {
    const docRef = doc(db, "posts", id)
    updateDoc(docRef, {
      name: name,
      price: price,
      soldPrice: soldPrice,
      timestamp: post[0].timestamp,
      date: post[0].date,
      profit: soldPrice - price,
    })
    setUpdate(false)
  }
  return(<div className="z-10 w-screen h-screen bg-black/75 flex items-center justify-center absolute top-0 left-0">
    <div className="w-[350px] h-[350px] bg-white border-1 rounded-md p-4 relative">
      <span className="absolute top-4 left-4 text-cyan-500" onClick={() => setUpdate(false)}>X</span>
      <form className="flex items-center flex-col justify-evenly h-full w-full ">
        <input className="py-2 border-b-1 border-gray-500 text-gray-500 focus:outline-none focus:border-b-cyan-500" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="py-2 border-b-1 border-gray-500 text-gray-500 focus:outline-none focus:border-b-cyan-500" placeholder="price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="py-2 border-b-1 border-gray-500 text-gray-500 focus:outline-none focus:border-b-cyan-500" placeholder="sold price" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} />        
        <button type="button" className="py-1 px-4 bg-cyan-500 text-white rounded-md" onClick={update}>update</button>
      </form>
    </div>  
  </div>)
}
const Results = () => {
  const {darkMode, setDarkMode} = useStateContext();
  const [start, setStart] = useState('01-01-2023');
  const [end, setEnd] = useState(moment(Date.now()).format("MM-DD-YYYY"));
  const [results, setResults] = useState([]);
  const [update, setUpdate] = useState(false);
  const router = useRouter()
  const sumWithInitial = results.reduce(
    (previousValue, currentValue) => previousValue + currentValue.profit ,
    0
  );
    const handelClick = async () => {

    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, where("date", ">=", start), where("date", "<=", end))
    const res = onSnapshot(q, (snapshot) => {
      setResults(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
    })
    return res
  }
  const handelDelete = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }

  const openModel = (id) => {
    setUpdate(true)
    router.push(`/results?id=${id}`);
  }
  return(
    <div className={darkMode ? 'dark' : ''} >
      <div className="bg-main-bg dark:bg-main-dark-bg text-[#20232A] dark:text-white w-screen min-h-screen h-full">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div>
        <form className={`${flexCenter} md:w-[900px] sm:w-[650px]  flex-col md:flex-row gap-5 w-screen md:gap-0 m-auto mt-10 p-5`}>
        <input 
        className="flex-1 mr-1 py-1 rounded-lg dark:bg-secondary-dark-bg focus:outline-none border-1 border-gray-300 text-sm px-1" 
        type="text" 
        value={start}
        onChange={(e) => setStart(e.target.value)}
        placeholder="start date" 
        />
        <input 
        className="flex-1 mr-1 py-1 rounded-lg dark:bg-secondary-dark-bg focus:outline-none border-1 border-gray-300 text-sm px-1" 
        type="text"
        value={end}
        onChange={(e) => setEnd(e.target.value)} 
        placeholder="End Date" 
        />
        <button 
        type="button" 
        onClick={handelClick} 
        className="py-1 px-3 rounded-lg cursor-pointer bg-cyan-500 text-white font-semibold">
          <IoMdAdd size={25} />
        </button>
      </form>
      <div className={`flex flex-col md:w-[900px] sm:w-[650px] w-full m-auto mt-[5px] p-5`}>
        {results.map((item, i) => (
          <div key={item.name + i} className={`${flexCenter} border-b-1 border-gray-400 py-2`}>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.name}</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.price} DA</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.soldPrice} DA</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.profit} DA</span>
            <div className={`${flexCenter}`}>
              <button onClick={() => openModel(item.id)} className="p-1 rounded-full cursor-pointer bg-teal-500  text-white text-md "><MdEdit /></button>
            </div>
          </div>
          ))}
        </div>
        {update && <Model results={results} setUpdate={setUpdate} />}
        </div>
      </div>
      <span className="fixed md:bottom-10 md:right-10 bottom-[75%] right-10 md:text-xl text-md font-bold bg-cyan-500 md:py-4 md:px-8 py-5 px-2 rounded-xl text-white">{sumWithInitial} DA</span>
    </div>
  )
}

export default Results

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