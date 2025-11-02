/*const clientIo = io("http://localhost:3000",{
    auth:{
        authorization:"user eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGNiOWVhMmM2ZDRmODRkNWM1MmMxYSIsImVtYWlsIjoibG9qeWlicmFoZW03QGdtYWlsLmNvbSIsImlhdCI6MTc2MDE5OTQ5MSwiZXhwIjoxNzYwMjAzMDkxLCJqdGkiOiJjMzRiMTMwZS1mYzA1LTQyZGQtYWIyZi01NTQwYTI0MGViMTkifQ.70-bcSK5rsAqHweerk2iJw7-nYHrgpgEMd6OpbEaTRk"
    },
})

    

clientIo.on("connect",()=>{
    console.log("client connect");
    
})
clientIo.on("connect_error", (error) => {
  console.log({error:error.message});
});

clientIo.on("userDisconnect", (data) => {
  console.log({data});
});

clientIo.emit("sayHi","Hi backend",(data)=>{
    console.log(data);})*/