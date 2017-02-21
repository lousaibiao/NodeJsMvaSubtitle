/**
 * 
 * [视频地址](https://mva.microsoft.com/en-US/training-courses/intermediate-aspnet-core-10-16964?l=Kvl35KmJD_4306218965)

[字幕地址](https://cp-mlxprod-static.microsoft.com/014952-1005/en-us/content/content_kvl35kmjd_4306218965/video_cc.xml?v=636172487285008486)
 */
var https = require("https");
var subtitleUrl = "https://cp-mlxprod-static.microsoft.com/014952-1005/en-us/content/content_kvl35kmjd_4306218965/video_cc.xml?v=636172487285008486";
var parseString = require('xml2js').parseString;
var fs = require("fs");
https.get(subtitleUrl, res=>{
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];
    let error;
    if(statusCode!=200){
        error = new Error('Request Failed, statusCode:'+statusCode);
    }else if(!/^application\/xml/.test(contentType)){
        error = new Error ("content type error "+ contentType);
    }
    if(error){
        console.log(error.message);
        res.resume();
        return ;
    }
    res.setEncoding("utf-8");
    let rawdata =  '';
    let result = "";
    var fileName = "Introduction to tag helpers.srt";
    res.on("data",(chunk)=>rawdata+=chunk);
    res.on("end",()=>{
        // console.log(rawdata);
        parseString(rawdata,(error, result)=>{
            // console.log(typeof(result));
            
            var items = result.tt.body[0].div[0].p
            
            var temp = JSON.stringify(items);
            var writer = fs.createWriteStream(fileName,{
                flags: 'w',  
                defaultEncoding: 'utf8',  
                fd: null,  
                mode: 0o666,
                autoClose: true
            });
            for (var index = 0; index < items.length; index++) {
                var item = items[index];
                var s = (index+1)+" \r\n"+item["$"]["begin"]+" --> "+item["$"]["end"]+"\r\n"+item["_"]+"\r\n\r\n";
                //Note that it is unsafe to use fs.writeFile multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream is strongly recommended.
                // fs.appendFile(fileName,s);
                writer.write(s);
            }
            console.log("finish");
        });
    });
}).on("error",(e)=>{
    console.log("got error"+e.message);
});
