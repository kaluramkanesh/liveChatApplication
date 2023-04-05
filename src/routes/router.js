const express = require("express")

const router = express.Router()
router.get("/", (req, res) => {
    res.send("Testing Api")
})
// router.get("/api/chat", (req, res) => {
//      res.sendFile("index.html", { root: "public" });
// })
router.get("/api/chat")
module.exports=router