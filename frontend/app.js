async function predict(){

let rain = document.getElementById("rain").value
let wind = document.getElementById("wind").value

let res = await fetch("http://localhost:8000/predict",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({rainfall:rain,wind:wind})
})

let data = await res.json()

document.getElementById("result").innerText =
"Severity: "+data.severity

}

async function sendSOS(){

let name = document.getElementById("name").value
let msg = document.getElementById("msg").value

await fetch("http://localhost:5000/sos",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,msg})
})

alert("SOS Sent")
}