class Fun{
async eee(req,res){
    try {
        const {a, b} = req.body
        console.log(a)
        console.log(b)
        let sum = a + b;
        let x = a*b;
        return res.status(200).json({
            sum: sum,
            x: x
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "error"
        })
    }
}
}
module.exports = new Fun()