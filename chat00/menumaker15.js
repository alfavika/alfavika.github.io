// Модуль динамического построения меню.
// Требует наличия контейнера cssmenu1 и css-стилей меню;
// управление размером шрифта определено для chatdiv;
// для отправки команд должен быть определён метод window.sm;
// точка входа - function initMenu().


/*  Функция построения меню по ul-списку внутри div-а с классом horizontalcssmenu.
Взята с http://javascriptt.ru/menu20.html , не забываем подключать соответствующий css
*/
function initMenu(){
	if(makeVikaMenu) makeVikaMenu(); //так почему-то писать нельзя
	
	var cssmenuids=["cssmenu1"] //Enter id(s) of CSS Horizontal UL menus, separated by commas
	var csssubmenuoffset=-1 //Offset of submenus from main menu. Default is 0 pixels.
	function createcssmenu2(){
	for (var i=0; i<cssmenuids.length; i++){
	  var ultags=document.getElementById(cssmenuids[i]).getElementsByTagName("ul")
		for (var t=0; t<ultags.length; t++){
				ultags[t].style.top=ultags[t].parentNode.offsetHeight+csssubmenuoffset+"px"
			var spanref=document.createElement("span")
				spanref.className="arrowdiv"
				spanref.innerHTML="    "
				ultags[t].parentNode.getElementsByTagName("a")[0].appendChild(spanref)
			ultags[t].parentNode.onmouseover=function(){
						this.style.zIndex=1000000
			this.getElementsByTagName("ul")[0].style.visibility="visible"
						this.getElementsByTagName("ul")[0].style.zIndex=0
			}
			ultags[t].parentNode.onmouseout=function(){
						this.style.zIndex=0
						this.getElementsByTagName("ul")[0].style.visibility="hidden"
						this.getElementsByTagName("ul")[0].style.zIndex=1000000
			}    }  }}
	/*
	if (window.addEventListener)
	window.addEventListener("load", createcssmenu2, false)
	else if (window.attachEvent)
	window.attachEvent("onload", createcssmenu2)
	*/
	createcssmenu2();
}

// добавляет раздел меню:
function addSubMenu(mainmenu, sname, sid)
{
	var elm = document.createElement('li');
	if(sid) elm.innerHTML = ' <a id="' + sid + '" href="javascript:void(0);">' + sname + '</a> '; else
	elm.innerHTML = ' <a href="javascript:void(0);">' + sname + '</a> ';
	
	var eul = document.createElement('ul');
	elm.appendChild(eul);
	
	mainmenu.appendChild(elm);
	return eul;
}

// добавляет в раздел пункт меню с явной js-командой:
function addItem(submenu, sname, sjs)
{
	var elm = document.createElement('li');
	elm.innerHTML = ' <a href="javascript:void(0);" onclick="'+ sjs + '" >' + sname + '</a> ';
	submenu.appendChild(elm);
}

// добавляет в раздел пункт меню с scom-командой и arg-аргументами:
function addItemCom(submenu, sname, scom, arg1, arg2, arg3)
{
	var args = [arg1, arg2, arg3];
	var elm = document.createElement('li');
	var a = document.createElement('a');
	a.innerHTML = sname;
	a.href = "javascript:void(0);";
	a.onclick = function()
	{	var str = scom;
		for(var i=0; i<3; i++)
		{	if(!args[i]) continue;
			var ais = {};
			if(typeof(args[i])=="object") ais = args[i];
			if(ais.value) {
				str = str + " " + ais.value;
				continue;
			}
			var adesc = ais.desc || ais;
			var adef = ais.def || "";
			//var sarg = window.prompt(args[i], "");
			var sarg = window.prompt(adesc, adef);
			if(sarg==null) return; // отмена
			str = str+" "+sarg;
		};
		window.sm(str);
	};
	elm.appendChild(a);
	submenu.appendChild(elm);
}

// служебная функция изменяющая размер шрифта на заданную величину:
function changeFont(element,step)
{	step = parseInt(step,10);
	var el = document.getElementById(element);
	var curFont = parseInt(el.style.fontSize,10);
	el.style.fontSize = (curFont+step) + 'px';
}

// внимание, для работы этого меню должна быть определена глобальная функция window.sm для отправки в главный чат:
function makeVikaMenu()
{
	var mm = document.getElementById("cssmenu1");
	var m;
	
	m = addSubMenu(mm, "Вы","you"); // you должен быть, по нему делается замена ника
		addItem(m, "Моя статистика", "sm('!myscore');");
		addItem(m, "Задать пароль", "setPswProc();");
		addItem(m, "--");
		addItem(m, "Выйти", "squit();");
	
	m = addSubMenu(mm, "Топы","idtops");
		addItem(m, "По ответам", "sm('!answers');");
		addItem(m, "По очкам", "sm('!scores');");
		addItem(m, "По цепочкам", "sm('!strikes');");
		addItem(m, "По дуэлям", "sm('!блицтоп');");
		addItem(m, "По эффективности дуэлей", "sm('!эфтоп');");
		addItem(m, "По рекордам скорости", "sm('!recordes');");
	
	m = addSubMenu(mm, "Словари","idtur");
		addItemCom(m, "Драг (короткие руссские)", "!драг", {desc:"Количество слов драга? (5-10)", def:10});
		addItemCom(m, "Драг (длинные руссские)", "!драгг", {desc:"Количество слов драга? (5-10)", def:10});
		addItemCom(m, "Драг (английские)", "!drag", {desc:"Количество слов драга? (5-10)", def:10});
		addItemCom(m, "Анаграммы", "!ana", {desc:"Количество Анаграмм? (5-10)", def:10});
		addItemCom(m, "Англо-русский словарь", "!турнир engl-rus1.txt", {desc:"Количество заданий? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "Страны-столицы", "!турнир  страны-столицы.txt", {desc:"Количество заданий? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "Назвать&nbsp;страну&nbsp;по&nbsp;городу", "!турнир НазватьСтрануПоГороду.txt", {desc:"Количество заданий? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "Турнирные&nbsp;вопросы", "!турнир ТурнирныеВопросы.txt", {desc:"Количество заданий? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "Слова&nbsp;из&nbsp;слова&nbsp;(на&nbsp;скорость)", "!words", {desc:"Количество букв в базовом слове? (5-20)", def:10}, {desc:"Слова не меньше скольки букв?", def:2} );
		addItemCom(m, "Слова&nbsp;из&nbsp;слова&nbsp;(скрытые)", "!hwords", {desc:"Количество букв в базовом слове? (5-20)", def:10}, {desc:"Слова не меньше скольки букв?", def:2} );
		
	m = addSubMenu(mm, "Блиц","idduels");
		addItemCom(m, "Дуэль&nbsp;на&nbsp;знание", "!duel4", {desc:"До скольки ответов дуэль? (5-10)", def:10});
		addItemCom(m, "Дуэль&nbsp;на&nbsp;скорость", "!duel1", {desc:"До скольки ответов дуэль? (5-10)", def:10});
		addItemCom(m, "Дуэль&nbsp;на&nbsp;отрыв", "!duel2", {desc:"До скольки ответов отрыва? (3-5)", def:3});
		addItem(m, "--");
		addItem(m, "Принять вызов", "sm('!принимаю');");

	m = addSubMenu(mm, "Инфо","idinfo");
		addItem(m, "Правила&nbsp;хаба", "sm('!show rules');");
		addItem(m, "Информер", "sm('!show informer');");
		addItem(m, "Наши ссылки", "sm('!show links');");
		//addItem(m, "--");
		addItem(m, "Топик", "sm('!show topic');");
		addItem(m, "--");
		addItem(m, "Вижу&nbsp;ошибку", "document.getElementById('reportdiv').style.display='block';");
		
	// а для работы этого меню, понятно, должен существовать элемент с id=TabContainer
	m = addSubMenu(mm, "Вид","idvid");
		addItem(m, "Шрифт крупнее", "changeFont('chatdiv',1);");
		addItem(m, "Шрифт мельче", "changeFont('chatdiv',-1);");
		addItem(m, "--");
		addItem(m, "Управление&nbsp;игнорами", "sm('!игноры');");
		addItem(m, "Очистка чата", "document.all.chatdiv.innerHTML='';"); // завязка на chatdiv
};