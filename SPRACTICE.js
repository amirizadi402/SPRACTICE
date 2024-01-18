let http=require('http');

let fs=require('fs');

let server=http.createServer(SeHandler);
let port=8037;

server.listen(port);

console.log("Server Running On Port 8037");

let Headers={
    txt:{"Content-type":"text/plain"},
    htm:{"Content-type":"text/html"}
}

let route={
    a:dynamicWrite,
    insertToFile:insertToFile,
    getFile:getFile,
    Filler:Filler
}
function Filler(request,response,Data)
{
    if(request.method=="GET")
    {
        console.log("Your Selected Method Is : "+request.method);
        fs.readFile("Text.txt","utf8",function(error,data)
        {
            if(error)
            {
                write('txt',"Your File Can't Read :(",response);
            }
            else
            {
                write('txt',data,response);
            }
        });
    }
    if(request.method=="POST")
    {
        console.log("Your Selected Method Is : "+request.method);
        fs.readFile("Text.txt",function(error,DD)
    {
        if(error)
        {
            write('txt',"Fs Error :(",response,request);
           

        }
        else
        {
             DD=JSON.parse(DD);
            
            DD.data.push(JSON.parse(Data));
        
            DD=JSON.stringify(DD);
            fs.writeFile("Text.txt",DD,function(error)
            {
                if(error)
                {
                    write('txt',"Fs Error :(",response,request);
                }
                else
                {
                    write('txt',"Your File Has Saved :)",response,request);
                }
            });
            
        }
    });
    }
}
function getFile(response,request)
{
    fs.readFile("Text.txt","utf8",function(error,DD)
    {
        
        if(error)
        {
            console.log("CCCCC");
        }
        else
        {
        console.log(DD);
        }
    });

}
function insertToFile(request,response,dt)
{
    fs.readFile("Text.txt",function(error,DD)
    {
        if(error)
        {
            write('txt',"Fs Error :(",response,request);
            console.log("aaaa");

        }
        else
        {
             DD=JSON.parse(DD);
            console.log( "A",DD);
            DD.data.push(JSON.parse(dt));
            console.log("B",DD);
            DD=JSON.stringify(DD);
            fs.writeFile("Text.txt",DD,'utf8',function(error)
            {
                if(error)
                {
                    write('txt',"Fs Error :(",response,request);
                }
                else
                {
                    write('txt',"Your File Has Saved :)",response,request);
                }
            })
            
        }
    });
}
function write(type,data,response)
{
    response.writeHead(200,Headers[type]);
    response.write(data);
    response.end();
}
function dynamicWrite(request,response,data)
{
    console.log("Your Data Inserted is : ",data);
    write("txt",data,response,request);
}
function SeHandler(request,response)
{
    let Get=request.url.split('/')[1];
    console.log("--------------------------------------------------");
    console.log(request.method);
    if(Get!=="favicon.ico")
    {
        let Data="";
        request.on('data',function(chunck)
        {
            Data+=chunck;
        });
        request.on('end',function()
        {
            try{
                route[Get](request,response,Data);
            }
            catch(error)
            {
                console.log("Your Evented Error Is : ",error);
            }
        });
        
    }
}