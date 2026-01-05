const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class HTMLService {

  async getDocument(src) {
    return await JSDOM.fromFile(src);
  }

  async addFieldsToHTML(template, fields){
    const document = await template.window.document;
    for (let field of fields) {
      //console.log(field);
      const key = Object.keys(field)[0];
      const element = document.getElementById(key);
      //console.log(element)
      element.innerHTML = field[key];
    }
    return template;
  }

  async addHrefToHTML(template, fields){
    const document = await template.window.document;
    for (let field of fields) {
      //console.log(field);
      const key = Object.keys(field)[0];
      const element = document.getElementById(key);
      //console.log(element)
      element.href = field[key];
    }
    return template;
  }

  async addSrcToHTML(template, fields){
    const document = await template.window.document;
    for (let field of fields) {
      //console.log(field);
      const key = Object.keys(field)[0];
      const element = document.getElementById(key);
      //console.log(element)
      element.scr = field[key];
    }
    return template;
  }

}

module.exports = new HTMLService();
