import Head from 'next/head'
import Image from 'next/image'
import  {useState} from 'react'
import Navbar from '../components/Navbar';
import SoldProduct from '../components/SoldProduct';
import { useStateContext } from '../context/ContextProvider';
export default function Home() {
  const {darkMode, setDarkMode} = useStateContext()
  return (
    <div className={darkMode ? "dark" : ""}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-main-bg dark:bg-main-dark-bg text-[#20232A] dark:text-white min-h-screen h-full w-screen">
        <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
        <SoldProduct />
      </div>
    </div>
  )
}

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