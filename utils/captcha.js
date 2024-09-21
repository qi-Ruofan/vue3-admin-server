const svgCaptcha = require('svg-captcha');
 
function generateCaptcha() {
  const captcha = svgCaptcha.create({
      size: 6, // 验证码长度
      ignoreChars: '0o1i', // 去除容易混淆的字符
      noise: 3, // 干扰线数量
      color: true, // 文字是否有颜色
      background: '#cc9966', // 背景颜色
  });
  // 返回验证码的数据URL
  return captcha;
}
 
// const captchaDataURL = generateCaptcha();


module.exports = {
  generateCaptcha
};
