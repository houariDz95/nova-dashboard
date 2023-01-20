import Navbar from "../components/Navbar"
const Products = () => {
  return(
    <div>
      <Navbar />
      <div>
        Products goes here
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