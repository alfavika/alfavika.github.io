/* 
	Пока ещё экспериментальный модуль, позволяющий желающим формировать свою версию итогов турнира.
	
	ChangeLog:
	20.03.2018 - начальная версия от Alfy.
*/

// версия функции сортировки, не учитывающая авторские надбавки:
function compareScoresBase(a, b) {
	var ascore = a.score;
	if(a.baseScore) ascore = a.baseScore;
	var bscore = b.score;
	if(b.baseScore) bscore = b.baseScore;
	// сначала по очкам:
	if(ascore > bscore) return 1;
	if(ascore < bscore) return -1;
	// при равенстве очков - по ответам на каждом из этапов подсказки:
	if((a.stg["1"] || 0) > (b.stg["1"] || 0)) return 1;
	if((a.stg["1"] || 0) < (b.stg["1"] || 0)) return -1;
	if((a.stg["2"] || 0) > (b.stg["2"] || 0)) return 1;
	if((a.stg["2"] || 0) < (b.stg["2"] || 0)) return -1;
	if((a.stg["3"] || 0) > (b.stg["3"] || 0)) return 1;
	if((a.stg["3"] || 0) < (b.stg["3"] || 0)) return -1;
	// а если дошли сюда - то уже случайно
};

// сервисная функция создания чекбокса с подписью справа:
function addChBx(toDiv, caption, onclickFunc) {
	var elCheck = document.createElement('input');
	elCheck.type = "CheckBox"; elCheck.checked = true;
	elCheck.onclick = onclickFunc;
	toDiv.appendChild(elCheck);
	var elText = document.createElement('span');
	elText.innerHTML = caption;
	toDiv.appendChild(elText);
	return elCheck;
};

// функция самостоятельно рендерит таблицы для pstat внутри указанного блока:
function makeResultCustomizer(pstat, divCustom) {
	
	divCustom.innerHTML = ""; // содержимое перестраиваем полностью
	
	var elSelect = document.createElement('select'); // кобмобокс выбора темы
	divCustom.appendChild(elSelect);
	
	var opt0 = document.createElement('option'); // его 0-ой вариант - все темы вместе
	opt0.value = "all";
	opt0.innerHTML = "Все темы вместе --- нажмите здесь для выбора отдельной темы ---"; //"Все темы вместе";
	opt0.gameStruct = pstat;
	elSelect.appendChild(opt0);
	
	var addOpt = function(tname) { // а это функция для добавления option-ов:
		var opt1 = document.createElement('option');
		opt1.value = tname;
		opt1.innerHTML = tname;
		opt1.gameStruct = pstat.themes[tname];
		elSelect.appendChild(opt1);
	};
	
	// создаём option-ы для каждой из тем:
	if (pstat.themeList) // если есть список тем - покажем правильно:
	{	for (var i=0; i<pstat.themeList.length; i++)
			addOpt(pstat.themeList[i]);
	} else // если нет - то хотя бы в случайном порядке:
	for (var tname in pstat.themes) 
		addOpt(tname);
	
	var elDivTable = document.createElement('div'); // тут у нас будут все таблички:
	divCustom.appendChild(elDivTable);
	
	// флажки настроек:
	var elCheckA = addChBx(elDivTable, "Учитывать авторские надбавки");
	var elCheckR = addChBx(elDivTable, "Показывать игравших в другие дни");
	
	var trustPlayers = {}; // список заслуживающих доверия (не отозванных) игроков
	for (var nick in pstat.players){
		var ps = pstat.players[nick];
		trustPlayers[nick] = (ps.cancel==undefined);
	};
	
	// эта паленькая позволяет выключать результаты отдельных ников...
	var elTrustPlayers = document.createElement('div');
	elTrustPlayers.style.backgroundColor = "#FFFFD0";
	//elDivTable.appendChild(elTrustPlayers); // ...но зачем
	
	var elDivPlayers = document.createElement('div'); // панель для таблицы игроков
	elDivTable.appendChild(elDivPlayers);
	
	var elDivTeams = document.createElement('div'); // панель для таблицы команд
	elDivTable.appendChild(elDivTeams);
	
	// главное событие перерисовки таблиц вызывается по выбору темы в кобмобоксе:
	elSelect.onchange = function () {
		var players = elSelect.options[elSelect.selectedIndex].gameStruct.players;
		var playersTop = [];
		for (var pnick in players) {
			var ps = players[pnick];
			if(ps.about) if(ps.about!="") if(!elCheckR.checked) continue; // если нужно - фильтруем about-игроков
			if(!trustPlayers[pnick]) continue; // фильтруем отозванных игроков
			if(ps.cancel) continue;  // так тоже можно фильтровать, но отзыв может быть ведь и на уровне выше
			playersTop.push(ps) 
		};
		
		if(elCheckA.checked)
			playersTop.sort(compareScores);
		else
			playersTop.sort(compareScoresBase);
		playersTop.reverse();
		updateTopTable(playersTop, elDivPlayers, "nick");
		
		var teams = elSelect.options[elSelect.selectedIndex].gameStruct.teams;
		var teamsTop = []; // массив команд для сортировки
		if(pstat.teams) // если нет команд, это как-то совсем плохо будет...
		for (var tname in teams) {
			var ts = teams[tname];
			if(!ts.cancel) // в структуре команды может быть специальная метка с просьбой не учитывать её результаты
				teamsTop.push(ts)
		};
		teamsTop.sort(compareScores);
		teamsTop.reverse();
		updateTopTable(teamsTop, elDivTeams, "teamName");
	};
	
	// но перерисовать таблицы нужно и по клику на чекбоксах настройки:
	elCheckA.onclick = elSelect.onchange;
	elCheckR.onclick = elSelect.onchange;
	
	// возня с чекбоксами выключения отдельных игроков (видимо ненужная):
	var onTrustClick = function(e) { // обработчик клика такого чекбокса:
		var cbx = e.target;
		trustPlayers[cbx.ps.nick] = cbx.checked;
		elSelect.onchange();
	};
	for (var nick in pstat.players){ // назначением всем чекбоксам ников этого обработчика
		var ps = pstat.players[nick];
		var cbx = addChBx(elTrustPlayers, nick);
		cbx.ps = ps;
		cbx.onclick = onTrustClick;
	};
	
	elSelect.onchange(); // выполним первый вызов вручную, чтобы построилась таблица всех тем вместе.
};
