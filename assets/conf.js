pet={ // 宠物配置
  name:"OPet", // 宠物名称
  description: "OPet example", // 宠物描述
  birthday:"2020/3/1", // 宠物生日，显示宠物属性需要。
  master:"Master", // 宠物对主人的称呼
  master_birthday:"2023/2/4", // 主人生日
  imgs:{
    default:"pet/normal.svg", // 默认形象（不管他、不逗他、不放鼠标他身上的时候）
    hover:"pet/smile.svg", // 鼠标放在宠物显示界面时的形象
    // 【名称】:"【对应形象文件位置及名称】"
    // 可以依据此格式继续添加自定义形象，触发方式要改下面。
  }
};
dict=[ // 点击宠物会讲的话
  "你好",
  {content:"很高兴认识你！",button:"^_^"},
  {content:"Hello！",button:"Hi！"},
  // 以下两种配置方式都可以：
  // {content:"【内容】",button:"关闭按钮显示内容"},
  // "【内容】",
];
config_petmenu=[ // 宠物菜单配置
  {label:"帮助",exec:`help();petmenu_close();`},
  {label:"宠物信息",exec:`pet_info();petmenu_close();`},
  {label:"重新加载",exec:"location.reload();"},
  {label:"关于此软件",exec:`about();petmenu_close();`},
  // {label:"隐藏宠物",exec:`window.eAPI.minimize();petmenu_close();`},
  {label:"退出宠物",exec:`window.close();petmenu_close();`},

  // {label:"【须要显示的文本】",exec:"【点击后执行的 JS 代码】"},
]
config_pet_button=[ // 宠物按钮配置
  {label:"拖拽移动",id:"move",img:"ui/move.svg"}, // 建议保留ID，否则窗口很难移动。
  {label:"调整大小",id:"resize",img:"ui/resize.svg",exec:"rs();"},
  {label:"菜单",id:"petmenu",img:"ui/menu.svg",exec:"petmenu();"},
  {label:"宠物状态信息",id:"about",img:"ui/about.svg",exec:"window.open('winframe.html?target=info');"},
  {label:"最小化",id:"minimize",img:"ui/minimize.svg",exec:"window.eAPI.minimize();"},
  // {label:"【须要显示的文本】",img:"【图标路径】",exec:"【点击后执行的 JS 代码】",dblexec:"【双击后运行的 JS 代码】",Rexec:"【右键点击运行的 JS 代码】"},
]
// petmenu_close(); --> 关闭宠物菜单
conf={ // 程序配置
  popup_delay:10000, // 对话框延时，单位毫秒
  plugins:[ // 插件
    // "psi.js", // PSI
    "achievements.js", // 成就插件，正在开发
    "status.js", // 新状态值
  ],
  stat:{ // 状态值插件相关配置
    心情值最大值: 1000,
    心情值减少延迟: 600000, // 10 分钟
    心情值减少值: 100,
    心情值增加值: 100,
    清洁值最大值: 1000,
    清洁值减少延迟: 1200000, // 20 分钟
    清洁值减少值: 100,
    清洁值增加值: 100,
    饥饿值最大值: 1000,
    饥饿值减少延迟: 1800000, // 30 分钟
    饥饿值减少值: 100,
    饥饿值增加值: 100,
    更新延时: 10000
  }
};
config_win_default="about.html"
config_win_tabs=[ // 软件窗口左侧显示的标签页
  {label:"宠物信息",id:"pet_info",exec:"$('iframe').src='info.html'"},
  {label:"成就",id:"pet_info",exec:"$('iframe').src='plugins/achievements/index.html'"},
  {label:"关于此软件",id:"pet_info",exec:"$('iframe').src='about.html'"},
]

/*==【鼠标行为】==*/
function pet_click(){ // 点击
  var target=随机数(0,(dict.length-1));
  if(typeof(dict[target])=="object"){ // 新配置
    popup(dict[target].content,dict[target].button);
  }
  else{ // 旧配置
    popup(dict[target]);
  }
  pet_click_count++;
  localStorage.setItem("pet_click_count",pet_click_count);
}
function pet_hover(){ // 鼠标进入宠物界面
  petload(pet.imgs.hover);
}
function pet_leave(){ // 鼠标离开宠物界面
  petload(pet.imgs.default);
}
function pet_dblclick(){ // 鼠标双击宠物界面
  // 点击次数不统计双击↓
   pet_click_count=pet_click_count-2;
   localStorage.setItem("pet_click_count",pet_click_count);
}
function pet_Rclick(e){ // 鼠标右键宠物界面
  e.preventDefault(); // 谨慎删除
  petmenu(); // 默认是弹出宠物菜单
}
/*==【通用函数功能区】==*/
function weather(){ // 天气，有技术没来源。
  // window.open("weather.html");
}
function pet_info(){
  window.open("winframe.html?target=info");
}
function isbirthday(){ // 判断今天是不是主人的生日。如果是的话，显示给主人的祝福消息。
  try{
    var birthday=new Date(pet.master_birthday);
    var today=new Date();
    var birthday_str=(birthday.getMonth()+1)+'/'+birthday.getDate();
    var today_str=(today.getMonth()+1)+'/'+today.getDate();
    if(birthday_str==today_str){
      if(!pet.master){pet.master="你"}
      popup("今天是"+birthday_str.replace('/','月')+'日'+"，"+"你的生日！祝你生日快乐，"+pet.master+"！","谢谢");
    }
  }catch{}
}
/*==【定时运行部分】==*/
spend_with_pet=parseFloat(localStorage.getItem("spend_with_pet"));
if(spend_with_pet==null||isNaN(spend_with_pet)){
  spend_with_pet=0;
  localStorage.setItem("spend_with_pet",0);
}
function spend_w_p(){ // 记录陪伴时长
  spend_with_pet=spend_with_pet+0.5;
  localStorage.setItem("spend_with_pet",spend_with_pet);
  console.log('+1')
  setTimeout("spend_w_p();",1800000);
}
/*==【预加载】==*/
var pet_click_count=parseFloat(localStorage.getItem("pet_click_count"));
if(pet_click_count==null||isNaN(pet_click_count)){
  pet_click_count=0;
  localStorage.setItem("pet_click_count",0);
}
function load_plugins(){
  if(conf.plugins){
    try{
      for(var a=0;a<conf.plugins.length;a++){
        loadjs(conf.plugins[a]);
      }
    }
    catch(e){alert(e)}
  }
}
function preload(){ // 预加载
  petmenu_load(config_petmenu); // 加载宠物菜单
  petbtn_load(config_pet_button); // 加载按钮
  petload(pet.imgs.default); // 加载宠物
  isbirthday();
  // ↓ 添加鼠标动作响应，小心修改
  $("#pet").addEventListener("click",new Function(`pet_click();`));
  $("#pet").addEventListener("pointerenter",new Function(`pet_hover();`));
  $("#pet").addEventListener("pointerleave",new Function(`pet_leave();`));
  $("#pet").addEventListener("contextmenu",new Function(`e`,`pet_Rclick(e);`));
  $("#pet").addEventListener("dblclick",new Function(`pet_dblclick();`));
  // ↓ 定时运行部分
  setTimeout("spend_w_p();",1800000);
  // ↓ 为以后作准备
  // setTimeout("tired();",1800000);
  // setTimeout("sick();",1800000);
}