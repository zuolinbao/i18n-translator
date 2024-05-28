const fs = require("fs");
const xlsx = require("xlsx");

// 指定 JSON 文件路径
const enJsonPath = "./json_to_excel/en.json"; // 修改为你的文件路径
const zhJsonPath = "./json_to_excel/zh.json"; // 修改为你的文件路径

// 读取 JSON 文件
const enData = JSON.parse(fs.readFileSync(enJsonPath, "utf8"));
const zhData = JSON.parse(fs.readFileSync(zhJsonPath, "utf8"));

// 准备数据以创建 Excel 文件
let data = [];

// 遍历 enData 和 zhData，合并数据
for (const module in zhData) {
  for (const key in zhData[module]) {
    data.push({
      module: module,
      key: key,
      en: enData[module] ? enData[module][key] || "" : "",
      zh: zhData[module][key],
    });
  }
}

// 创建工作表
const worksheet = xlsx.utils.json_to_sheet(data);

// 创建工作簿
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

// 写入 Excel 文件
const excelPath = "./json_to_excel/i18n.xlsx"; // 修改为你的文件路径
xlsx.writeFile(workbook, excelPath);

console.log("Excel 文件已成功创建。");
