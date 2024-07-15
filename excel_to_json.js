const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// 指定 Excel 文件路径
const filePath = "./excel_to_json/i18n.xlsx"; // 修改为你的文件路径

// 读取 Excel 文件
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
const sheet = workbook.Sheets[sheetName];

// 将工作表转换为 JSON 数组
const data = xlsx.utils.sheet_to_json(sheet);

// 处理数据并创建多个 JSON 对象
let enDict = {};
let zhDict = {};

data.forEach((row) => {
  const module = row.module;
  const key = row.key;
  const zhValue = row.zh || "";
  const enValue = row.en || "";

  if (!enDict[module]) enDict[module] = {};
  if (!zhDict[module]) zhDict[module] = {};

  enDict[module][key] = enValue;
  zhDict[module][key] = zhValue;
});

// 创建目录
const enDir = "./excel_to_json/en";
const zhDir = "./excel_to_json/zh";

if (!fs.existsSync(enDir)) fs.mkdirSync(enDir, { recursive: true });
if (!fs.existsSync(zhDir)) fs.mkdirSync(zhDir, { recursive: true });

// 保存 JSON 对象为文件
for (const module in enDict) {
  const enJsonPath = path.join(enDir, `${module}.json`);
  const zhJsonPath = path.join(zhDir, `${module}.json`);

  fs.writeFileSync(enJsonPath, JSON.stringify(enDict[module], null, 4), "utf8");
  fs.writeFileSync(zhJsonPath, JSON.stringify(zhDict[module], null, 4), "utf8");
}

console.log("json 文件已成功创建。");
