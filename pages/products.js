import Navbar from "../components/Navbar"
import { db } from "../utils/firebase"
import {collection, addDoc, deleteDoc, query, orderBy, serverTimestamp, onSnapshot, doc} from 'firebase/firestore';
import {IoMdAdd} from "react-icons/io";
import {BsFillTrashFill} from "react-icons/bs";
import {useState, useEffect} from 'react'
import { flexCenter } from "../utils/styles";
import moment from 'moment'
const Products = () => {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, 'products')
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe =   onSnapshot(q,(snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    }) 
    return unsubscribe
  }, [])
  
  const handelClick = async () => {
    const collectionRef = collection(db, 'products');
    setName("")
    await addDoc(collectionRef, {
      name: name,
      timestamp: serverTimestamp(),
    })

  }

  const handelDelete = async (id) => {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  }

  return(
    <div>
      <Navbar />
      <div>
      <form className={`${flexCenter} md:w-[900px] sm:w-[650px] flex-col md:flex-row gap-5 w-screen md:gap-0 m-auto mt-10 p-5`}>
        <input 
        className="flex-1 mr-1 py-1 rounded-lg dark:bg-secondary-dark-bg focus:outline-none border-1 border-gray-300 text-sm px-1" 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name" 
        />
        <button 
        type="button" 
        onClick={handelClick} 
        className="py-1 px-3 rounded-lg cursor-pointer bg-cyan-500 text-white font-semibold">
          <IoMdAdd size={25} />
        </button>
      </form>
      <div className={`flex flex-col md:w-[900px] sm:w-[650px] w-full m-auto mt-[5px] p-5`}>
        {products.map((item, i) => (
          <div key={item.name + i} className={`${flexCenter} border-b-1 border-gray-400 py-2`}>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.name}</span>
            <div className={`${flexCenter}`}>
              <button onClick={() => handelDelete(item.id)} className="p-1 rounded-full cursor-pointer bg-red-500  text-white text-md "><BsFillTrashFill /></button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
} 

export default Products

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