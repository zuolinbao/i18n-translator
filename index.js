const xlsx = require("xlsx");
const fs = require("fs");

// 指定 Excel 文件路径
const filePath = "./i18n.xlsx"; // 修改为你的文件路径

// 读取 Excel 文件
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
const sheet = workbook.Sheets[sheetName];

// 将工作表转换为 JSON 数组
const data = xlsx.utils.sheet_to_json(sheet);

// 处理数据并创建两个 JSON 对象
let enDict = {};
let zhDict = {};

data.forEach((row) => {
  const module = row.module || lastModule;
  const key = row.key;
  const zhValue = row.zh;
  const enValue = row.en;

  if (!enDict[module]) enDict[module] = {};
  if (!zhDict[module]) zhDict[module] = {};

  enDict[module][key] = enValue;
  zhDict[module][key] = zhValue;

  lastModule = module; // 更新 lastModule，以便处理 NaN 值
});

// 指定 JSON 文件路径
const enJsonPath = "./result/en.json"; // 修改为你的文件路径
const zhJsonPath = "./result/zh.json"; // 修改为你的文件路径

// 保存 JSON 对象为文件
fs.writeFileSync(enJsonPath, JSON.stringify(enDict, null, 4), "utf8");
fs.writeFileSync(zhJsonPath, JSON.stringify(zhDict, null, 4), "utf8");
console.log("%c result文件夹下查看结果", "color:#0f0;");
