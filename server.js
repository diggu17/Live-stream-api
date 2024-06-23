const {server} = require( './src/app.js');
const DotEnv =  require('dotenv');
DotEnv.config();


server.listen(process.env.PORT,(err)=>{
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is runnig in port: http://localhost:${process.env.PORT}`);
});

