import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse} from 'next/server'
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';
connect()

export async function POST(request:NextRequest) {
  try {
    const reqBody = await request.json()
    const {username,email,password} = reqBody

    //validation
    console.log(reqBody);

    const user = await User.findOne({email})
    
    if(!user){
      return NextResponse.json({error: "user does not exit"},
          {status:400})
  }
     console.log("user exits")    

   const validPassword = await bcryptjs.compare(password, user.password)

   if(!validPassword){
    return NextResponse.json({error: "check your password"},
        {status:400})
}

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }    

    const token = jwt.sign(tokenData,process.env.TOKEN_SECERET!, {expiresIn:'1d'})

  const reponse =   NextResponse.json({
      message: "Log In Success",
      success:true
    })

    reponse.cookies.set("token",token,{
      httpOnly:true,
    })
    return reponse

  } catch (error:any) {
      return NextResponse.json({error: error.message},
          {status:500}
      )
  }
}