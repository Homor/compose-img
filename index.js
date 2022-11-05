const images = require("images");

const fs = require("fs");
const path = require("path");
const mkdir = require("./mkdir");
const mapDir = require('./mapDir');
const Limit = require('./Limit');

const lim = new Limit();

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


function compose(list,basePath,outPut){

  // 数字排序
  const _list = list.sort(function(a,b){
      let a_name = path.basename(a).split(".")[0];
      let b_name = path.basename(b).split(".")[0];
      return parseInt(a_name)-parseInt(b_name)
  });

  // 分页
  const page={};
  _list.forEach(function(p){
    const dirname = path.dirname(p);
    console.log(dirname);
    const name =dirname.replace(':',"").replaceAll("/","-");
    if(page[name]){
      page[name].push(p);
    }else{
      page[name] = [p];
    }
  });
  console.log(page);
    
  // 分组
  let group = {};

  const page_key = Object.keys(page);
  page_key.forEach(key=>{
    const _list = page[key];

    _list.forEach(function(p){
      const p_name = path.basename(p).split(".")[0];
      const dirname = path.dirname(p);
      console.log(dirname);
      const group_index = Math.floor((p_name-1)/4);
      const _group = key+group_index;
      if(group[_group]){
        group[_group].from.push(p);
      }else{

        const _p = dirname.replace(/\\/img, '/');
        const _basePath = basePath.replace(/\\/img, '/');
        const _outPut = outPut.replace(/\\/img, '/');
        const out = _p.replace(_basePath,_outPut)
        
        group[_group] = {from:[p],out:`${out}/${group_index}.png`};
      }
    });

  });

  console.log(group);

  const key = Object.keys(group);

  lim.start(key.map(key=>composeFour(group[key])));

  // lim.start([composeFour(group[[key[0]]]),composeFour(group[[key[1]]])]);
  // lim.start([composeFour(group[[key[0]]])]);

}

async function composeFour({from,out}){
  return new Promise(function(resolve,reject){
    console.log('composeFour',from,out);
    const bg = images(1500,1500);
    // 四个
    from.forEach(function(imgUrl,index){
        const x = index%2*750;
        const y = Math.floor(index/2)*750;
        console.log(x,y);
        const file = images(imgUrl);
        bg.draw(file,x,y);
    });

    if (!fs.existsSync(path.dirname(out))) {
      console.log("无目录");
      mkdir(path.dirname(out)+"/");
    }

    save(bg,out).then(res=>resolve(res)).catch(err=>reject(err));
  })

}

function save(file,output){
    return new Promise((resolve,reject)=>{
      console.log('save',output);
        file.saveAsync(output,function(err){
          console.log('saveAsync');
            if(err){
                console.log(err);
                console.log(output);
                return reject(err);
            }
            console.log("输出完毕");
            resolve(output);
        });
    });
}

function compute(basePath, outPut, progress, finish){
    mapDir(basePath, (arr) => {
      console.log("mapDir");
      console.log(arr);
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
        
        console.log(list);
        // console.log(out);

        // 合并图片
        compose(list,basePath,outPut);
    
      });
}


compute("C:/Users/xw/Desktop/碗/原图/海天H5素材/海天H5素材/盐焗鸡","C:/Users/xw/Desktop/碗/原图/海天H5素材/海天H5素材/盐焗鸡1")