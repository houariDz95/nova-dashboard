import React, { useState, useEffect } from 'react'
import {useRouter} from "next/router";
import { onSnapshot, doc, arrayUnion, arrayRemove, updateDoc, getDoc} from 'firebase/firestore';
import { db } from '../utils/firebase';
import {IoMdAdd} from 'react-icons/io';
import { BsFillTrashFill } from "react-icons/bs";

const Model = ({setMedel}) => {
        
    const router = useRouter();
    const id = router.query.id;
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [credit, setCredit] = useState([]);

    useEffect(() => {
        const getData = async() => {
          const docRef = doc(db, "person", id);
          const docSnap = await getDoc(docRef)
            setCredit(docSnap.data())
        }
        getData();
      }, [credit, id])

    const handelSubmit = async(e) => {
        e.preventDefault()
        if (name === "" || price === "") return;
        setName("");
        setPrice("");

        const docRef = doc(db, "person", id);
        updateDoc(docRef, {
            tasks: arrayUnion({
                name: name,
                price: price,
                timestamp: new Date(),
            }),
        }, { merge: true })

    }

    const deleteTask =  async (task)=> {
        const docRef = doc(db, "person", id);
             updateDoc(docRef, {
                tasks: arrayRemove({
                    name: task.name,
                    price: task.price,
                    timestamp: task.timestamp,
                }),
            }, { merge: true })
    }
  return (
    <div className="h-screen w-screen absolute top-0 left-0 flex items-center justify-center bg-black/40">
        <div className='sm:w-[700px] w-[400px]  bg-white relative p-5'>
            <span className="absolute top-2 right-2 text-3xl text-gray-500 cursor-pointer" onClick={() => setMedel(false)}>x</span>
            <form onSubmit={handelSubmit} className="flex items-center gap-2 sm:flex-row flex-col mt-10 ">
                <input className="flex-1 w-full border-1 border-gray-200 p-2 rounded-md" value={name} placeholder='اسم' type="text" onChange={(e) => setName(e.target.value)}/>
                <input className="flex-1 w-full border-1 border-gray-200 p-2 rounded-md" value={price} placeholder='ثمن' type="number" onChange={(e) => setPrice(e.target.value)}/>
                <button type="submit" className='text-white bg-cyan-600 p-3 text-2xl rounded-md cursor-pointer '><IoMdAdd /></button>
            </form>
            <div className='w-full overflow-y-scroll mt-4 h-[350px] pr-1'> 
                {credit.tasks?.map(task => (
                <div key={task.timestamp} className="w-full flex items-center py-2 px-3 border-b-1 border-gray-200 ">
                    <span className="flex-1 text-gray-700 text-lg font-semibold">{task.name}</span>
                    <span className="flex-1 text-gray-700 text-lg font-semibold">{task.price} </span>
                    <button className="p-1 rounded-full cursor-pointer bg-red-500  text-white text-md" onClick={() => deleteTask(task)}><BsFillTrashFill /></button>
                </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Model
