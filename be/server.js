import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"

// app config
const app = express()
const port = 4000;

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// Logging middleware to log the request URL
app.use("/images", (req, res, next) => {
    console.log("Request for image:", req.url);
    next();
}, express.static('uploads'));

// api endpoints
app.use("/api/food",foodRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})



//previous code:

// import express from "express"
// import cors from "cors"
// import { connectDB } from "./config/db.js"
// import foodRouter from "./routes/foodRoute.js"

// // app config
// const app = express()
// const port = 4000

// // middleware
// app.use(express.json())
// app.use(cors())

// // db connection
// connectDB();

// // api endpoints
// app.use("/api/food",foodRouter)
// app.use("/images",express.static('uploads'))

// app.get("/",(req,res)=>{
//     res.send("API Working")
// })

// app.listen(port, ()=>{
//     console.log(`Server running on http://localhost:${port}`)
// })