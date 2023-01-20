import cookie from 'cookie';
export default function handler(req, res){
  const {username, password} = req.body;
  if(username === process.env.ADMINE_USERNAME && password === process.env.ADMINE_PASSWORD){
    console.log(process.env.USERNAME)
    res.setHeader("set-cookie", cookie.serialize("token", process.env.TOKEN, {
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    }))

    res.status(200).json('succesful!')
  }else {
    res.status(400).json("Wrong Credentials");
  }
}