let jwt = require('jsonwebtoken');
let UserModel = require('../model/users');
let SessionModel = require('../model/sessions')
let { toZero, toDays } = require('../utils/common');
let { generateCaptcha } = require('../utils/captcha')
let secret = 'imooc';

let login = async (req, res, next) => {
  const userCaptcha = req.body.captcha; // 用户输入的验证码
  const userCaptchaId = req.body.captchaId;
  let captchaSession = ''; // 从 session 获取验证码
  const currentTime = Date.now();
  const expirationTime = 60 * 1000; // 设置验证码过期时间为 15秒
  const sessionAll = await SessionModel.find({}).sort({ _id: -1 })
  let pass = false
  for(let i = 0; i < sessionAll.length; i++) {
    let = sessionData = JSON.parse(sessionAll[i].session)
    if(sessionData.captcha.captchaId === userCaptchaId) {
      pass = true
      captchaSession = sessionData.captcha
    }
  }
  const { text, createdAt } = captchaSession || {};
  console.log(captchaSession)
  if (!req.body.email || !req.body.pass || !req.body.captcha) {
    return res.status(400).json({ errcode: -1, errmsg: '缺少必要的参数' });
  }
  if(!pass) {
    return res.status(400).json({ errcode: -1, errmsg: '无效验证码' });
  }
  if (!text) {
    return res.status(400).json({ errcode: -1, errmsg: '验证码未生成或已过期' });
  }
  
  // 检查验证码是否过期
  if (currentTime - createdAt > expirationTime) {
    return res.status(400).json({ errcode: -1, errmsg: '验证码已过期' });
  }

  // 验证用户输入是否匹配
  if (userCaptcha !== text) {
    return res.status(400).json({ errcode: -1, errmsg: '验证码错误' });
  }

  // 验证码正确，继续验证用户
  UserModel.findOne({ email: req.body.email, pass: req.body.pass })
    .then((user) => {
      if (user) {
        const token = jwt.sign({ infos: { name: user.name, permission: user.permission, _id: user._id, approver: user.approver, head: user.head } }, secret, { expiresIn: '1h' });
        res.json({ errcode: 0, errmsg: 'ok', token });
      } else {
        res.status(400).json({ errcode: -1, errmsg: '邮箱或密码错误' });
      }
    })
    .catch(() => {
      res.status(500).json({ errcode: -2, errmsg: '服务器错误' });
    });
};

let register = async (req, res, next) => {
  function addDate(){
    let result = {
      time: {},
      detail: {}
    };
    for(let i=1;i<=12;i++){
      result.time[toZero(i)] = {}
      result.detail[toZero(i)] = {}
      for(let j=1;j<=toDays(i);j++){
        result.detail[toZero(i)][toZero(j)] = '旷工'
      }
    }
    return result;
  }
  await UserModel.deleteMany({});
  await UserModel.insertMany([{
    "_id" : "62632f3f674b1e20c841aae2",
    "email" : "huangrong@imooc.com",
    "name" : "黄蓉",
    "pass" : "huangrong",
    "head" : "http://localhost:3000/uploads/62632f3f674b1e20c841aae2.png",
    "permission" : [ 
        "home", 
        "sign", 
        "exception", 
        "apply"
    ],
    "approver" : [ 
        {
            "_id" : "626c7236e0c7edf6ce507708",
            "name" : "洪七公"
        }
    ],
    "__v" : 0
  },
  {
    "_id" : "626c7236e0c7edf6ce507708",
    "email" : "hongqigong@imooc.com",
    "name" : "洪七公",
    "pass" : "hongqigong",
    "head" : "http://localhost:3000/uploads/626c7236e0c7edf6ce507708.png",
    "permission" : [ 
        "home", 
        "sign", 
        "exception", 
        "apply", 
        "check"
    ],
    "approver" : [ 
        {
            "_id" : "876d7136e0c9eaf62e503256",
            "name" : "虚竹"
        }
    ],
    "__v" : 0
  }]).then((ret)=>{
    res.send({"errcode": 0});
  }).catch(()=>{
    res.send({"errcode": -1});
  })
}

let captcha = (req, res, next) => {
  const captchaData = generateCaptcha();
  // 将 SVG 转换为 base64 编码
  const svgBase64 = Buffer.from(captchaData.data).toString('base64');
  const captchaId = parseInt(Math.random()*16000000000)
  req.session.captcha = {
    text: captchaData.text,
    createdAt: Date.now(), // 记录生成时间
    captchaId: captchaId
  };
  console.log(req.session)
  // 返回 Base64 格式的验证码图片
  // 生成一个 Data URL
  const captchaUrl = `data:image/svg+xml;base64,${svgBase64}`;
  // res.type('svg');
  if(captchaData.data) {
    res.send({"errcode": 0, "errmsg": "ok", "captchaDataURL": captchaUrl, "captchaId": captchaId});
  } else {
    res.send({"errcode": -2, "errmsg": "server error"});
  }
}

module.exports = {
  login,
  register,
  captcha
};
