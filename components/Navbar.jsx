import {SlScreenSmartphone} from "react-icons/sl";
import {MdOutlineDarkMode, MdOutlineLightMode} from 'react-icons/md';
import {AiFillFacebook} from 'react-icons/ai';
import {HiMenu} from "react-icons/hi"
import {flexCenter} from '../utils/styles';
import {useState} from 'react'
import Link from 'next/Link'
import Menu from './Menu'

const Navbar = ({setDarkMode, darkMode}) => {
  const [menu, setMenu] = useState(false);
  return(
    <div className={`${flexCenter} py-5 md:px-10 px-4 justify-between border-b-1 border-gray-200 w-screen` }>
      <Link href="/" >
        <div className="flex items-center">
          <SlScreenSmartphone size={30} className="text-cyan-500 " />
          <p className="text-xl font-bold font-display">NovaPhone</p>
        </div>      
      </Link>
      <div className={`${flexCenter}`}>
        <p className="md:hidden block">
          <HiMenu  size={30} onClick={() => setMenu(true)} />
        </p>
        <ul className={`md:flex items-center gap-10 text-md font-semibold mr-20 border-r-1 border-gray-200 hidden`}>
          <Link href="/credit"> 
            <li className="cursor-pointer hover:text-cyan-500">Credit</li>
          </Link>
          <Link href="/results">
            <li className="cursor-pointer hover:text-cyan-500">Results</li>
          </Link>
          <Link href="/products">
            <li className="cursor-pointer hover:text-cyan-500">Products</li>
          </Link>
          <div className="h-full w-[2px] bg-main-dark-bg dark:bg-main-bg " />
        </ul>
        <div className={`${flexCenter} gap-5 mr-5`}>
          <div onClick={() => setDarkMode((prev) => !prev)}>{!darkMode ? <MdOutlineLightMode size={30} className="text-cyan-500 cursor-pointe"  /> : <MdOutlineDarkMode size={30} className="text-cyan-500 cursor-pointe" />}</div>
          <div>
            <a
            href="https://www.facebook.com/p.rofile.php?id=100057621872269"
            target='_blank'
            rel='noreferrer'
            >
              <AiFillFacebook size={30} className="text-gray-500 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
      {menu && <Menu setMenu={setMenu} />}
    </div>
  )
}

export default Navbar