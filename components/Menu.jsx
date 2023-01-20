import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
const Menu = ({setMenu}) => {
  return(
    <div className="fixed top-0 left-0 bg-white/60 h-full w-screen">
      <ul className={`flex items-center flex-col  gap-10 text-md font-semibold mr-20 w-[70%] h-full bg-secondary-dark-bg
      `}>
          <AiOutlineClose size={30} className="text-cyan-500 mt-10" onClick={() => setMenu(false)}/>
          <Link className="py-2" href="/credit"> 
            <li className="cursor-pointer hover:text-cyan-500">Credit</li>
          </Link>
          <Link className="py-2" href="/results">
            <li className="cursor-pointer hover:text-cyan-500">Results</li>
          </Link>
          <Link className="py-2" href="/">
            <li className="cursor-pointer hover:text-cyan-500">components</li>
          </Link>
        </ul>
    </div>
  )
}

export default Menu