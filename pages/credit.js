import {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import {IoMdAdd} from 'react-icons/io';
import {db} from '../utils/firebase';
import {BsFillTrashFill} from "react-icons/bs";
import {MdEdit} from "react-icons/md";
import {IoIosAddCircle} from "react-icons/io"
import {addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {flexCenter} from "../utils/styles";
import { useStateContext } from '../context/ContextProvider';

const Credit = () => {
  const {darkMode, setDarkMode} = useStateContext();
  const [credits, setCredits] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [inc, setInc] = useState('0');
  const [dec, setDec] = useState(0);
  const sumWithInitial = credits.reduce(
    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.price) ,
    0
  );
  useEffect(() => {
    const getData = async() => {
      const collectionRef = collection(db, "credit");
      const q = query(collectionRef, orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCredits(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
      })  
      return unsubscribe
    }
    getData();
  }, [])
  const handelDelete = async(id) =>{
    const docRef = doc(db, "credit", id);
     await deleteDoc(docRef);
  }
  const handelUpdate = async (item) => {
    const docRef = doc(db, "credit", item.id);
    await updateDoc(docRef, {
      update: true,
    })
  }
  const update = async (item) => {
  
   const docRef = doc(db, "credit", item.id);
    await updateDoc(docRef, {
      update: true,
      price: Number(item.price) + Number(dec) - Number(inc),
      update: false,
    })
    setInc(0)
    setDec(0)
  }
  const handelClick = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, "credit");
    await addDoc(collectionRef, {
      name: name,
      price: price,
      update: false,
      timestamp: serverTimestamp(),
    })
    setName('');
    setPrice('');
  }

  return(
    <div className={darkMode ? 'dark' : ''}>
      <div className="dark:bg-main-dark-bg bg-main-bg dark:text-white text-[#20232A] min-h-screen h-full w-screen">
        <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
        <div>
          <form className={`${flexCenter} md:w-[900px] sm:w-[650px] w-full flex-col md:flex-row gap-2 m-auto mt-10 p-5`}>
            <input className="flex-1 py-1  border-1 border-gray-300 focus:outline-none rounded-md text-md bg-transparent px-1" type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="flex-1 py-1  border-1 border-gray-300 focus:outline-none rounded-md text-md bg-transparent px-1" type="number" placeholder="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button 
            type="button" 
            onClick={handelClick} 
            className="py-1 px-3 rounded-lg cursor-pointer bg-cyan-500 text-white font-semibold">
              <IoMdAdd size={25} />
          </button>
          </form>
          <div className={`flex flex-col md:w-[900px] sm:w-[650px] w-full m-auto mt-[5px] p-5`}>
        {credits.map((item, i) => (
          <div key={item.name + i} className={`${flexCenter} border-b-1 border-gray-400 py-2`}>
            <span className="flex-1 text-md font-semibold">{item.name}</span>
            <span className="flex-1 text-md font-semibold">{item.price} DA</span>
            <div className={`${flexCenter}`}>
              {!item.update && <button onClick={() => handelUpdate(item)} className="p-1 rounded-full cursor-pointer bg-teal-500 text-white text-md mr-2"><MdEdit /></button>}
              <button onClick={() => handelDelete(item.id)} className="p-1 rounded-full cursor-pointer bg-red-500  text-white text-md "><BsFillTrashFill /></button>
            </div>
            {item.update && <div className={`${flexCenter}`}>
                <input type="number" value={inc} onChange={(e) => setInc(e.target.value)} className="w-[70px] border-1 border-teal-500 text-teal-500 focus:outline-none mx-1" />
                <input type="number" value={dec} onChange={(e) => setDec(e.target.value)} className="w-[70px] border-1 border-red-500 text-red-500 focus:outline-none mx-1" />
                <span className="fixed md:bottom-10 md:right-10 bottom-[75%] right-10 md:text-xl text-md font-bold bg-cyan-500 md:py-4 md:px-8 py-5 px-2 rounded-xl text-white">{sumWithInitial} DA</span>
              </div>}
          </div>
        ))}
      </div>
      <span className="fixed md:bottom-10 md:right-10 bottom-[75%]  right-5 md:text-xl text-sm font-bold bg-cyan-500 md:py-4 md:px-8 py-5 px-2 rounded-xl text-white">{sumWithInitial} DA</span>
        </div>
      </div>
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