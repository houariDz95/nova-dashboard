import react, { createContext, useContext, useState, useEffect} from 'react';


const Context = createContext();

export const StateContext = ({children}) => {
  const [darkMode, setDarkMode] = useState(false)
    return (
        <Context.Provider value={{
          darkMode,
          setDarkMode
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);