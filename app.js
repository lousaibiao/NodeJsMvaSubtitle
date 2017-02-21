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
            // fs.writeFile("1.txt",temp,(e)=>{
            //     if (e){
            //         fs.writeFile("error.txt",e.message);
            //     }
            // });
            // return ;
            // var i = 1;
            for (var index = 0; index < items.length; index++) {
                var item = items[index];
                var s = (index)+" \r\n "+item["$"]["begin"]+" --> "+item["$"]["end"]+"\r\n"+item["_"]+"\r\n";
                fs.appendFile(fileName,s);
                // console.log(index);
                // i++;
            }
            console.log("finish");
        });
    });
}).on("error",(e)=>{
    console.log("got error"+e.message);
});
