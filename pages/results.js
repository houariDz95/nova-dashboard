import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { flexCenter } from '../utils/styles';
import {IoMdAdd} from 'react-icons/io';
import {BsFillTrashFill} from "react-icons/bs";
import {MdEdit} from "react-icons/md";
import {db} from "../utils/firebase";
import {collection, where, query,   onSnapshot, doc, deleteDoc} from 'firebase/firestore';

const Results = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [start, setStart] = useState('01-17-2023');
  const [end, setEnd] = useState('01-19-2023');
  const [results, setResults] = useState([]);
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


  return(
    <div className={darkMode ? 'dark' : ''} >
      <div className="bg-main-bg dark:bg-main-dark-bg text-[#20232A] dark:text-white w-screen min-h-screen h-full">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div>
        <form className={`${flexCenter} md:w-[900px] sm:w-[650px] flex-col md:flex-row gap-5 w-screen md:gap-0 m-auto mt-10 p-5`}>
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
      <div className={`flex flex-col md:w-[900px] sm:w-[650px] w-[450px] m-auto mt-[5px] p-5`}>
        {results.map((item, i) => (
          <div key={item.name + i} className={`${flexCenter} border-b-1 border-gray-400 py-2`}>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.name}</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.price} DA</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.soldPrice} DA</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.profit} DA</span>
            <div className={`${flexCenter}`}>
              <button onClick={() => handelDelete(item.id)} className="p-1 rounded-full cursor-pointer bg-red-500  text-white text-md "><BsFillTrashFill /></button>
            </div>
          </div>
          ))}
        </div>
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