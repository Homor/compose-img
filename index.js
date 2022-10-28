const { log } = require("console");
const fs = require("fs");
const images = require("images");
const path = require("path");
const mapDir = require('./mapDir');


// fs.readdir('./img/',(err,files)=>{

//     if (err)return console.log(err);

//     files.forEach((file) => { 
//         console.log(file);
//         // console.log(path.extname(file));
//     })
// })


function filterPath(path_list, filter) {
    const { exclude = {}, include = {} } = filter;
  
    let result = [];
    path_list.forEach(_path => {
      let useful = true;
  
      //获取文件的后缀名
      let extname = path.extname(_path);
      extname&&(extname=extname.replace('.',''));
  
      // 过滤包含的
      if (include.path && include.path.length) {
        const index = include.path.findIndex(p => !_path.includes(p));
        if (index == -1) {
          useful = true;
        } else {
          useful = false;
        }
      }
  
      if (include.ext && include.ext.length) {
        if (include.ext.includes(extname)) {
          useful = true;
        } else {
          useful = false;
        }
      }
  
      // 过滤不包含的
      if (exclude.path && exclude.path.length) {
        const index = exclude.path.findIndex(p => _path.includes(p));
        console.log(exclude.path,_path);
        console.log(index);
        if (index != -1) {
          useful = false;
        }
      }
  
  
      if (exclude.ext && exclude.ext.length) {
        if (exclude.ext.includes(extname)) {
          useful = false;
        }
      }
  
      if (useful) {
        result.push(_path);
      }
  
    });
    return result;
  
}

async function composeFour(fromList){
    const bg = images(1500,1500);
    // 四个
    fromList.forEach(function(imgUrl,index){
        const x = index%2*750;
        const y = Math.floor(index/2)*750;
        console.log(x,y);
        const file = images("./"+imgUrl);
        bg.draw(file,x,y);
    });
    await save(bg,"D:/tool/compose-img/output.png");
}

function save(file,output){
    return new Promise((resolve,reject)=>{
        file.saveAsync(output,function(err){
            if(err){
                console.log(err);
                reject(err);
                return;
            }
            resolve(output);
            console.log("输出完毕");
        });
    });
}


function compute(basePath, outPut, progress, finish){
    mapDir(basePath, (arr) => {
        // 过滤路径
        let list = filterPath(arr, {
          exclude: {
            ext: [],
            path: []
          },
          include: {
            ext: ['webp','jpg','jpeg','png'],
            path: []
          }
        });
        
        // 生成导出目录
        let out = list;
    
        if(outPut&&basePath !== outPut){
          const _basePath = basePath.replace(/\\/img, '/');
          const _outPut = outPut.replace(/\\/img, '/');
          console.log(_basePath, _outPut);
          out = list.map(item => item.replace(_basePath, _outPut));
        }
    
        console.log(list);
        // console.log(out);

        // 所有的路径
        // console.log();
        return;

        // 合并图片
        compose(list);

        // 压缩图片
        // com(list, out, progress, finish);
    
      });
}




// compute("D:/tool/compose-img/img/")