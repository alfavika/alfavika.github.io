/*
Скрипт для динамического формирования итоговых таблиц по json-файлу публичной статистики турнира.

ChangeLog:
20.03.2018 - начальная версия от Alfy.
*/

// "полифил" для коварного IE (хотя, скорее всего, всё равно не заработает):
function getXhrObject(){
	if(typeof XMLHttpRequest === 'undefined'){
		XMLHttpRequest = function() {
			try { return new window.ActiveXObject( "Microsoft.XMLHTTP" ); }
			catch(e) {};
		};
	} else
	return new XMLHttpRequest(); //хотя всем соверменным браузерам должно быть достаточно этого
};


// загружает json-структуру из данного url, при успехе - вызывает callback-функцию её обработки и вывода в divMain:
function getJsonFromUrl(url, callback, divMain) {
	var xhr = getXhrObject();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() { 
		if(xhr.readyState == 4 && xhr.status == 200)
		{	var str = xhr.responseText;
			var tableData = JSON.parse(str);
			callback(tableData, divMain)
		};
	};
	xhr.send();
};


// функция сортировки массива игроков или команд:
function compareScores(a, b) {
	//if (a > b) return 1; if (a < b) return -1; // идея compare-функций вообще
	// сначала по очкам:
	if(a.score > b.score) return 1;
	if(a.score < b.score) return -1;
	// при равенстве очков - по ответам на каждом из этапов подсказки:
	if((a.stg["1"] || 0) > (b.stg["1"] || 0)) return 1;
	if((a.stg["1"] || 0) < (b.stg["1"] || 0)) return -1;
	if((a.stg["2"] || 0) > (b.stg["2"] || 0)) return 1;
	if((a.stg["2"] || 0) < (b.stg["2"] || 0)) return -1;
	if((a.stg["3"] || 0) > (b.stg["3"] || 0)) return 1;
	if((a.stg["3"] || 0) < (b.stg["3"] || 0)) return -1;
	// при равенстве всех ответов (почти невероятно) - по надбавкам:
	if (b.baseScore && !a.baseScore) return 1;
	if (a.baseScore && !b.baseScore) return -1;
	// а если дошли сюда - то уже случайно
};


//функция вызываемая если у нас есть статистика и её нужно показать в виде таблиц в заданном месте:
// pstat - структура публичной статистики турнира; divMain - место, где её нужно показать в виде таблиц
function onHaveJsonData(pstat, divMain)
{
	// панелька кастомизированных результатов (если нужно):
	if(window.makeResultCustomizer) // и если она вообще определена
	{	var divCC = document.getElementById("CustomizerContainer");
		if(divCC) divCC.style.display = "block"; // то покажем и панельку для неё:
		var divCustom = document.getElementById("CustomizerDiv"); //это должно быть внутри
		if(divCustom) // если её нету, её можно было бы и создать...
			makeResultCustomizer(pstat, divCustom); // но пусть пока так
	};
	
	// ИГРОКИ:
	var divPlayers = document.getElementById("PlayersDiv")
	if(divPlayers==undefined) {
		divPlayers = document.createElement('div');
		divPlayers.id = "PlayersDiv";
		divMain.appendChild(divPlayers);
	};
	
	var playersTop = []; // массив игроков для сортировки
	if(pstat.players) // если нет игроков, это как-то совсем плохо будет...
	for (var pnick in pstat.players) {
		var ps = pstat.players[pnick];
		if(!ps.cancel) // в структуре игрока может быть специальная метка с просьбой не учитывать его результаты
			playersTop.push(ps)
	};
	playersTop.sort(compareScores);
	playersTop.reverse(); // нам нужна сортировка по убыванию (или сразу по убыванию и сортировать?)
	updateTopTable(playersTop, divPlayers, "nick");
	
	
	// КОМАНДЫ:
	var divTeams = document.getElementById("TeamsDiv")
	if(divTeams==undefined) {
		divTeams = document.createElement('div');
		divTeams.id = "TeamsDiv";
		divMain.appendChild(divTeams);
	};
	
	var teamsTop = []; // массив команд для сортировки
	if(pstat.teams) // если нет игроков, это как-то совсем плохо будет...
	for (var tname in pstat.teams) {
		var ts = pstat.teams[tname];
		if(!ts.cancel) // в структуре команды может быть специальная метка с просьбой не учитывать её результаты
			teamsTop.push(ts)
	};
	teamsTop.sort(compareScores);
	teamsTop.reverse(); // нам нужна сортировка по убыванию (или сразу по убыванию и сортировать?)
	updateTopTable(teamsTop, divTeams, "teamName");
	
	
	// АНАЛИТИКА:
	// если мы сюда успешно дошли, плашку предупреждения про таблицы можно убрать:
	var aboutTablesDiv = document.getElementById("aboutTables");
	if(aboutTablesDiv) aboutTablesDiv.style.display = "none";
};

// функция построения таблицы рейтинга по списку mData на панели divPanel, eyname - задаёт тип элемента (nick или teamName):
function updateTopTable(mData, divPanel, keyname)
{
	var html = "";
	
	var abouts = {} // ключи - about-поля, значения - к-во звёздочек
	var lastAbout = "*"; // последнее сформированное примечание
	var aboutsArr = []; // массив сносок в порядке их формирования
	
	html+='<table border=1 cellspacing=0 cellpadding=4 style="margin:8px;" \r\n';
	
	html+="<thead><tr>"; // шапка таблицы:
	if(keyname=="nick")
		html+="<th>Место</th> <th>Счёт</th> <th>Ответы</th> <th>Ник</th>"
	else if(keyname=="teamName")
		html+="<th>Место</th> <th>Счёт</th> <th>Ответы</th> <th>Команда</th>"
	else
		html+="<th>Место</th> <th>Счёт</th> <th>Ответы</th> <th>Имя</th>"
	html+="</tr></thead>";
		
	html+="<tbody>\r\n"; // тело таблицы:
	for (var i=0; i<mData.length; i++)
	{	var ps = mData[i]; // структура игрока или команды
		html+="<tr>";
		html+="<td>" + (i+1) + "</td>";
		if(ps.baseScore)
			//html+="<td>" + ps.score +"+"+ ps.adscore + "</td>";
			html+="<td><span title='Авторская надбавка: " + ps.adscore + "' style='cursor:help;'> " + ps.baseScore +"+"+ ps.adscore + "<span></td>";
		else
			html+="<td>" + ps.score + "</td>";
		html+="<td>";
			if(ps.stg) // перестраховка, но мало ли
				html+="" + (ps.stg["1"] || "0") +"+"+ (ps.stg["2"] || "0") +"+"+ (ps.stg["3"] || "0") +" = "
			html+= ""+ ps.answ;
		html+="</td>";
		//html+="<td>" + ps.nick + "</td>";
		var n = ps[keyname] || " ? ";
		if(ps.about) if(ps.about!="") {
			var aboutStars = abouts[ps.about]
			if(!aboutStars) {
				lastAbout = lastAbout + "*";
				abouts[ps.about] = lastAbout;
				aboutStars = lastAbout;
				aboutsArr.push(lastAbout + " " + ps.about);
			};
			//n+=" <span title='" + ps.about + "' style='cursor:help;' >" + aboutStars +"</span>"; // если курсор меняется только на звёздочках
			n=" <span title='" + ps.about + "' style='cursor:help;' >" + n + " " + aboutStars +"</span>";
		}
		html+="<td>" + n + "</td>";
		html+="</tr>\r\n";
	};
	html+='</tbody></table>\r\n'
	
	if(keyname=="teamName")
		html+= "\r\n<p>* результатом команды на каждом вопросе считается лучший из ответов её игроков</p>";
	else
		html+= "\r\n<p>* в скобках указана сумма ответов данных до каждой из подсказок</p>";
	for (var i=0; i<aboutsArr.length; i++) {
		html+= "\r\n<p>" + aboutsArr[i] + "</p>";
	};
	
	html+="<br>"; // раздел завершать пустой строкой
	
	divPanel.innerHTML = html;
};

// заменяет содержимое div-ов mainPanel-блока таблицами из jsonFile:
// пример использования - getTableData("vybor-18-03-2018.json", "mainPanel");
function getTableData(jsonFile, mainPanelId) {
	var divMain = document.getElementById(mainPanelId);
	getJsonFromUrl(jsonFile, onHaveJsonData, divMain);
}