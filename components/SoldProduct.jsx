import {useState, useEffect} from "react";
import {flexCenter} from '../utils/styles';
import {IoMdAdd} from 'react-icons/io';
import {BsFillTrashFill} from "react-icons/bs";
import {MdEdit} from "react-icons/md";
import {db} from "../utils/firebase";
import {collection, addDoc,   serverTimestamp, orderBy, where, query,   onSnapshot, doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {useRouter} from 'next/router';
import moment from "moment";
const SoldProducts = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [soldPrice, setSoldPrice] = useState('')
  const [posts, setPosts] = useState([]);
  const sumWithInitial = posts.reduce(
    (previousValue, currentValue) => previousValue + currentValue.profit ,
    0
  );
  const router = useRouter()
  useEffect(() =>{
    const getData = async () => {
      const collectionRef = collection(db, 'posts');
      const q = query(collectionRef, where("date", "==", moment(Date.now()).format("MM-DD-YYYY")))
      const unsubscribe =   onSnapshot(q,(snapshot) => {
        setPosts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      }) 
      return unsubscribe
    }
    getData()
  }, [])

  const handelClick = async (e) => {
    e.preventDefault();
    if(name === "" || price === "" || soldPrice === "") return;
    const id = router.query.id;
    if(id){
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, {
        name: name,
        price: price,
        soldPrice: soldPrice,
        profit: soldPrice - price,
        date: moment(Date.now()).format("MM-DD-YYYY"),
        timestamp: serverTimestamp(),
      })
    }else {
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        name: name,
        price: price,
        soldPrice: soldPrice,
        profit: soldPrice - price,
        date: moment(Date.now()).format("MM-DD-YYYY"),
        timestamp: serverTimestamp(),
      })
    }
    setName("");
    setPrice("");
    setSoldPrice("");
    router.push('/')
  }

  const handelDelete = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }

  const handelUpdate = async(item) => {
    router.push(`/?id=${item.id}`);
    setName(item.name);
    setPrice(item.price);
    setSoldPrice(item.soldPrice)

  }


  return(
    <div className="h-screen">
      <form className={`${flexCenter} md:w-[900px] sm:w-[650px] flex-col md:flex-row gap-5 w-screen md:gap-0 m-auto mt-10 p-5`}>
        <input 
        className="flex-1 mr-1 py-1 rounded-lg dark:bg-secondary-dark-bg focus:outline-none border-1 border-gray-300 text-sm px-1" 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name" 
        />
        <input 
        className="flex-1 mr-1 py-1 rounded-lg dark:bg-secondary-dark-bg focus:outline-none border-1 border-gray-300 text-sm px-1" 
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)} 
        placeholder="price" 
        />
        <input 
        className="flex-1 mr-1 py-1 rounded-lg dark:bg-secondary-dark-bg focus:outline-none border-1 border-gray-300 text-sm px-1" 
        type="number"
        value={soldPrice}
        onChange={(e) => setSoldPrice(e.target.value)} 
        placeholder="sold price" 
        />
        <button 
        type="button" 
        onClick={handelClick} 
        className="py-1 px-3 rounded-lg cursor-pointer bg-cyan-500 text-white font-semibold">
          <IoMdAdd size={25} />
        </button>
      </form>
      <div className={`flex flex-col md:w-[900px] sm:w-[650px] w-[450px] m-auto mt-[5px] p-5`}>
        {posts.map((item, i) => (
          <div key={item.name + i} className={`${flexCenter} border-b-1 border-gray-400 py-2`}>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.name}</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.price} DA</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.soldPrice} DA</span>
            <span className="flex-1 md:text-md text-sm font-semibold">{item.profit} DA</span>
            <div className={`${flexCenter}`}>
              <button onClick={() => handelUpdate(item)} className="p-1 rounded-full cursor-pointer bg-teal-500 text-white text-md mr-2"><MdEdit /></button>
              <button onClick={() => handelDelete(item.id)} className="p-1 rounded-full cursor-pointer bg-red-500  text-white text-md "><BsFillTrashFill /></button>
            </div>
          </div>
        ))}
      </div>
      <span className="fixed md:bottom-10 md:right-10 bottom-[75%] right-10 md:text-xl text-md font-bold bg-cyan-500 md:py-4 md:px-8 py-5 px-2 rounded-xl text-white">{sumWithInitial} DA</span>
    </div>
  )
}

export default SoldProducts