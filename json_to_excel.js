const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// 读取目录下所有 JSON 文件
function readJsonFiles(dir) {
  const files = fs.readdirSync(dir);
  let data = {};

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const moduleName = path.basename(file, ".json");
      const filePath = path.join(dir, file);
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      data[moduleName] = fileData;
    }
  });

  return data;
}

// 读取 en 和 zh 目录下的 JSON 文件
const enDir = "./json_to_excel/en";
const zhDir = "./json_to_excel/zh";

const enData = readJsonFiles(enDir);
const zhData = readJsonFiles(zhDir);

// 合并数据
let combinedData = [];
let allModules = new Set([...Object.keys(enData), ...Object.keys(zhData)]);

allModules.forEach((module) => {
  const enModule = enData[module] || {};
  const zhModule = zhData[module] || {};
  let allKeys = new Set([...Object.keys(enModule), ...Object.keys(zhModule)]);

  allKeys.forEach((key) => {
    combinedData.push({
      module: module,
      key: key,
      en: enModule[key] || "",
      zh: zhModule[key] || "",
    });
  });
});

// 指定 Excel 文件路径
const outputPath = "./json_to_excel/i18n_from_json.xlsx"; // 修改为你的文件路径

// 将数据转换为工作表
const worksheet = xlsx.utils.json_to_sheet(combinedData);

// 创建一个新的工作簿
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "i18n");

// 写入 Excel 文件
xlsx.writeFile(workbook, outputPath);

console.log("Excel 文件已成功创建。");
