import app from './src/app.js'
import DotEnv from "dotenv";

DotEnv.config();

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is runnig in port: http://localhost:${process.env.PORT}`);
})