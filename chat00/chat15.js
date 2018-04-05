
var apihost = ""; // "http://alfy.no-ip.org/";  // "http://alfavika.ru/"; // "http://localhost/";
var picthost = "http://alfy.no-ip.org/";

var memmes = ""; // запомненное сообщение для повтора при неудаче
var authorized = false; // запросы к чату идут только при включенном флажке
var authNick = ""; // ник, на котором была удачная авторизация
var t = "t0"; // последнее известное состояние чата (нечисловое значение = неизвестное состояние)

var aColor = "red"; // цвет ника авторизованного юзера в разных местах (может меняться в настройках)


var localSett = { // локальные данные юзера для данного домена
	nick:"", 
	styleName:"Normal",
	unrevChar:"^" // значок, которым заменяется @
};  

var StylesTable =
{	// в каждом варианте оформления для каждой группы ников указываются:
	// ns - NickStyle - стиль ника и его упоминаний
	// ps - ParagraphStyle - стиль реплик идущих от данного ника
	Normal: {
		groups: {
			"QuesBot": { ns:"BotStyle1", ps:"QuesStyle1" },
			"InfoBot":{ ns:"BotStyle1", ps:"MesStyle1" },
			//"Hidden":{ ns:"UserStyle1", ps:"MesStyle1" },
			//"Hidden": { ns:"HiddenMes", ps:"HiddenMes" },
			"Hidden": { ns:"HiddenNick", ps:"HiddenMes" },
			"MyNick": { ns:"MyNickStyle1", ps:"MyMesStyle1" },
			"User":{ ns:"UserStyle1", ps:"MesStyle1" }
		}
	},
	
	Twix: {
		groups: {
			"QuesBot": { ns:"BotStyle1", ps:"QuesStyle2" },
			"InfoBot":{ ns:"BotStyle1", ps:"MesStyle1" },
			"Hidden": { ns:"UserStyle1", ps:"MesStyle1" },
			"MyNick": { ns:"MyNickStyle1", ps:"MyMesStyle1" },
			"User":{ ns:"UserStyle1", ps:"MesStyle1" }
		}
	},
	
	DarkSusl: {
		groups: {
			"QuesBot": { ns:"BotStyle1", ps:"QuesStyle3" },
			"InfoBot":{ ns:"BotStyle1", ps:"MesStyle1" },
			"MyNick": { ns:"MyNickStyle1", ps:"MyMesStyle1" },
			"User":{ ns:"UserStyle1", ps:"MesStyle1" }
		}
	},
	
	DcStyle: {
		groups: {
			"QuesBot": { ns:"BotStyle4", ps:"QuesStyle4" },
			"InfoBot":{ ns:"BotStyle4", ps:"MesStyle4" },
			"MyNick": { ns:"MyNickStyle1", ps:"MyMesStyle1" },
			"User":{ ns:"UserStyle4", ps:"MesStyle4" }
		}
	}
}

var groups = StylesTable.Normal.groups;  // здесь хранится ссылка на настройки групп текущего выбранного стиля

var nicks = { //определяет принадлежности ника к группе, имеющей свои настройки:
	"Vika":"QuesBot",
	//"System":"QuesBot", // эксперимент 17.06.2017
	"Drag":"QuesBot",
	"drag":"QuesBot",
	"Турнир":"QuesBot",
	"Блиц":"QuesBot",
	"Секундант": "QuesBot", //"InfoBot", пожалуй, он тоже относится к квестерам
	"Информер":"InfoBot", // вообще он InfoBot, это так, для отладки
	"Голосование":"InfoBot",
	"Альфа-хаб":"InfoBot",
	"UserStyle":"MyNick",
	"MyStyle":"User"
} // сюда ещё можно подгрузить из localStorage списки друзей, игноров и т.п.
// возможно нужно делать таблицу где никам соответствуют сразу структуры групп и перевычислять её при изменении стиля


function gOfNick(n) // определение имени группы к которой относится данный ник
{	var g; // = "User";
	if(n==authNick) g = "MyNick"; else 
	if(n in nicks) g = nicks[n];else //if(nick in nicks) g = nicks[nick];else // ошибка была
		g = "User"; //по умолчанию все остальные - просто юзеры
	return g;
}

function htmlForNick(n)
{	// пример использования gOfNick
	var sl = groups[gOfNick(n)];
	return "<b class="+ sl.ns +" onclick='onNC(this);' >" + n + "</b>";
}

function ChatAppendOld(news)
{	document.all.chatarea.value += news;
	if(document.all.ChBxScr.checked) // todo - вынести в настройки
	document.all.chatarea.scrollTop += 1000000; 
};

function onNC(s)
{	var bs= document.getElementById("send");
	bs.value = bs.value + s.innerHTML + ": ";
	bs.focus();
}

function changeFont(element,step)
{	step = parseInt(step,10);
	var el = document.getElementById(element);
	var curFont = parseInt(el.style.fontSize,10);
	el.style.fontSize = (curFont+step) + 'px';
}

function testScrool()
{	if(document.all.ChBxScr.checked) // todo - вынести в настройки
		document.all.chatdiv.scrollTop = document.all.chatdiv.scrollHeight;
		//document.all.chatdiv.scrollTop += 1000000; // не делайте так
}

function testNoScrool()
{
	var cd = document.all.chatdiv;
	if(cd.scrollTop < (cd.scrollHeight - cd.clientHeight))
	{ 	document.all.ChBxScr.checked = false;
		var bs = document.getElementById("ButtonScrool");
		bs.value = "Включить прокрутку";
		bs.style.display = "block";
	}
	else
	{ 	document.all.ChBxScr.checked = true;
		var bs = document.getElementById("ButtonScrool");
		bs.value = "Прокрутка включена";
		bs.style.display = "none";
	}
}

var qstate =
{
	theme:"Тема", //актуальная тема
	qdiv:0 //ссылка на div последнего вопроса
}

var ols =
{
	n: authNick,
	u: "img.jpg",
	dt: 0
}

var last_sg = "User"; // предыдущий отправитель

var r_s=/\:(yahoo|am|s5|sceptic|secret|blush|cry|good|lol|O_o|04|05|14|smile|sad|give-rose|wacko|gibe|ad|ae|O|music|fig|07|blink|hahaha|lol2|thanks|laughting|o2|wall|flowers|rose|Df|heart|aggressive|cem|rolleyes)\:/gi;

// ищует в строке коды смайлов из регулярного выражения r_s и заменяет их на img-гифки:
function makeSmiles(str)
{
	//смайлы-исключения, не представимые в виде :код: нужно привести к такому виду:
	str = str.replace(/\:\-?\)/g, ":smile:");
	str = str.replace(/\:\-?\(/g, ":sad:");
	
	// регулярное выражение ищет комбинации типа ":код:" и заменяет их гифками:
	str=str.replace(r_s, function(dummy, match) {
		return '<img src="../img/smiles/' + match+'.gif">';
		//testScrool(); // если все смайлы один раз прогрузить заранее, прокрутка не нужна
	});
	return str;
}

function ChatAppend(news)
{
	if(news=="") return; //!
	
	// testNoScrool(); //глючит :-(
	
	var arr = news.split("\n");
	var uch = localSett.unrevChar || "^"; // на замену можно хоть уникод-символ, хоть картинку
	var clp = groups["User"].ps; //  ""; // класс параграфа сохраняется для последовательно идущих строк
	var sg = last_sg; //"User"; // к какой группе относится отправитель (SenderGroup)
	var notif = "";
	var l = arr.length;
	for (var i = 0; i < l; i++)
	{	var str= arr[i];
		if ((str=="")) continue; // костыль, пока сервер присылает лишний \r\n в конце ответа
		var prestr =""; // здесь обычно оказывается время
		var j = str.indexOf("<");
		if(j!=-1) // блок анализа ника
		{ var j1 = str.indexOf(">", j+1);
		  if(j1!=-1)
		  { var nick = str.substring(j+1, j1);
			var sl;
			if(nick==authNick) sg = "MyNick"; else
			if(nick in nicks) sg = nicks[nick];else
				sg = "User";
			sl = groups[sg];
			  
			var cln = sl.ns; 
			clp = sl.ps;
			
			//prestr = str.substring(0,j) + "&lt;<b class="+ cln +">" + nick + "</b>&gt;";
			prestr = str.substring(0,j) + "&lt;<b class="+ cln +" onclick='onNC(this);' >" + nick + "</b>&gt;";
			//подстрока перед ником обычно означает время, её можно сделать более бледным цветом
			
			str = str.substring(j1+1);
		  };
		}
	
		str = str.replace(new RegExp("<",'g'), "&lt;");
		str = str.replace(new RegExp(">",'g'), "&gt;");
		//str = str.replace(new RegExp("\t",'g'), '<img src="tab2.gif" height="15" width="60" alt="" />');
		//str = str.replace(new RegExp("\t",'g'), '<span style="padding-left:60;"></span>');
		str = str.replace(new RegExp("\t",'g'), '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
		// str = str.replace('\n', "<br>"); // после split такого не должно же остаться
		if(uch!="@") str = str.replace(new RegExp("@",'g'), uch); 
		
		//str = str.replace(authNick, "<b style='color:" + aColor + "'> "+authNick +" </b>"); // перенесено ниже, это нужно не всегда
		
		var allowImg = (sg!="Hidden"); // показывать ли изображения от данного ника (здесь может быть и более сложное условие)
		
		// делаем кликабельными ссылки
		var haveurl = "";
		str=str.replace(/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function(url) {
		    nice = url;
		    if( url.match('^https?:\/\/') )
		      nice = nice.replace(/^https?:\/\//i,'')
		    else
		      url = 'http://' + url;
			// haveurl = url;
			
			// кстати, возможно давать картинки следует разрешить только викторине и, может быть, админам
			var r=/.(jpg|jpeg|gif|png|bmp)$/i;
			if(allowImg && (r.test(url))) //if (r.test(url))
			{
				var style = 'min-width: 16px; min-height: 16px; background: url(/img/loading-16x16.gif) transparent no-repeat;';
				style+= ' display:block; margin:0 auto; '; // выделим картинку в отдельную строку и центрируем (это же нужно?)
				if ( url.indexOf(picthost + "img") == -1 )
				style += ' max-width: 480px; max-height: 200px;';  //style += ' max-width: 300px; max-height: 400px;';
				//return '<noindex><img src="'+ url +'" style="' + style + '" onload="testScrool();" align="top" /> </noindex>';
				//return '<noindex> <a href="'+ url +'" target="_blank" > <img src="'+ url +'" style="' + style + '" onload="testScrool();" align="top" />  </a> </noindex>';
				
				ols.u = url; ols.dt = performance.now();
				return '<noindex> <a href="'+ url +'" target="_blank" > <img src="'+ url +'" style="' + style + '" onload="onLoadMes();" align="top" />  </a> </noindex>';
			}
			else 
			return '<noindex><a target="_blank" rel="nofollow" href="'+ url +'">'+ url +'</a></noindex>'; 	
		  });
		// закончили делать кликабельными ссылки
		
		if(allowImg) // смайлики заигноренных видеть не нужно (надо подумать, возможно они не нужны и от квест-ботов)
		str = makeSmiles(str); // если нужно - покажем смайлики (увы, в этой версии - без панели для их отправки)
		  
		if(sg=="QuesBot")
		{
			// qstate.qdiv; qstate.theme
			var isT = (str.indexOf("Тема:")!=-1) //&& (prestr.indexOf("Турнир")!=-1) // темы только в турнирах бы...
			if(isT) 
			{	qstate.theme = str.substr(str.indexOf("Тема"));
				document.all.themediv.innerHTML = str;
				document.all.scena.style.display = "block";
			};
			
			var isTop = (str.indexOf("топ:")!=-1);
			if(isTop)
			{	qstate.theme = "";
				document.all.themediv.innerHTML = "";
				document.all.scena.style.display = "none";
			};
			
			var isQ = (str.indexOf("Вопрос")!=-1) || isT || isTop; 
			isQ = isQ || (str.indexOf("слово №")!=-1); // для драга
			isQ = isQ || (str.indexOf("Анаграмма")!=-1); // для анаграмм
						
			// начало блока нового опроса можно чуть выделять верхним топом (можно даже с темой, если есть)
			if(isQ) str = "<b style='margin-top:8px;' >" + str + "</b>";
			
			if((last_sg != sg)||isQ) // (str.indexOf("Вопрос")!=-1))
			{
				//*var elm = document.createElement('div');
				//elm.style.width = "50%";
				
				qstate.qdiv = document.createElement('div');
				qstate.qdiv.className = "dw";
				//qstate.qdiv.style = "width: 50%; margin: 0 auto; ";
				//qstate.qdiv.style = "display:table; margin: 0 auto; "; //центрирует div
				//qstate.qdiv.style = "width:75%; margin-left:20%"; // не работает в хроме
				qstate.qdiv.style.marginLeft = '20%'; // правильно так, а лучше - в dw
				
				if(isQ) qstate.qdiv.style.paddingTop = '16px';
				
				if(isTop||isT) qstate.qdiv.style.border = "1px solid #000";
				
				qstate.qdiv.title = qstate.theme;
				
				//*elm.appendChild(qstate.qdiv);
				document.all.chatdiv.appendChild(qstate.qdiv);
				//*document.all.chatdiv.appendChild(elm);
			};
			
			// первое слово десь всегда ник, потому в принципе можно выяснить и его класс:
			var z = str.indexOf(" ответ за"); // тут же и "первый ответ за"
			if(z==-1) z = str.indexOf(" подряд за");
			if(z!=-1)
			{	var nl = str.indexOf(" ", 1); // ник это всегда одно целое слово начиная со 2-го символа
				var anick = str.substr(1, nl-1);
				str = " <i>" + htmlForNick(anick) + "</i>" + str.substr(nl); 
			};
			
			if(str.indexOf("Рейтинг:")!=-1) // только для турниров
			str = "<span style='background-color:#E0FFFF;' >" + str + "</span>";
			
			var pr = str.indexOf("Правильный ответ:");
			if(pr!=-1)
				//str = str.substr(0,pr+18) + "<span style='background-color:#E0FFFF;' >" + str.substr(pr+18) + "</span>";
				str = str.substr(0,pr+18) + "<b>" + str.substr(pr+18) + "</b>";
			
			str = str.replace(" "+authNick, "<b style='color:" + aColor + "'> "+authNick +"</b>"); // todo - звук опционально
			// кстати, не факт что ник нужно подсвечивать в репликах викторины; человек и так знает, что туда писал 
			// хотя с другой стороны, это ведь признак правильного ответа и по звуку можно понять, что варианты перебирать уже не надо
			
			var elm = document.createElement('div');
			if (clp!="") elm.innerHTML = prestr + str; // здесь, наверное, не нужны настройки стиля
					else elm.innerHTML = prestr + str;
			if((str!="")&&(str!=" ")&&(str!="  "))  // пустые строки от квестера пропускаем
				if(qstate.qdiv!=0) qstate.qdiv.appendChild(elm);
		}
		else
		{
			//предобработка для обычных строк:
			str = str.replace(" "+authNick, "<b style='color:" + aColor + "'> "+authNick +"</b>"); // todo - звук опционально
			// внимание, искать обязательно с пробелом!
			
			var elm = document.createElement('div');
			if (clp!="") elm.innerHTML =  prestr + " <span class="+ clp + ">" + str + "</span>";
					else elm.innerHTML = prestr + str;
			
			if(sg=="Hidden") // если ник относится к группе скрываемых (игнорируемых)
			{	elm.classList.add("hiddenMes"); // установим для div-а с этим сообщением свой стиль (цвет шрифта=цвет фона и меньший шрифт)
				elm.innerHTML = prestr + str;
			}
			
			document.all.chatdiv.appendChild(elm);
			// см. также removeChild, cont.insertBefore(div2, table.nextSibling);
		};
		
		last_sg = sg; //запоминаем имя последнего отображённой группы
		
		if(sg=="QuesBot") notif+=arr[i]+"\n"; // запоминаем все сообщения квестера для нотификации
	};
	
	testScrool();

	if(false) // если набралось несколько уведомлений за раз, показывать нужно ВСЕ. одной нотификацией.
	if(notif!="")
	{
		var mailNotification = new Notification("Альфа-хаб", {
			tag : "получено",  //тэг нужен для групиировки сообщений
			body : notif, 
			icon : "../learn/SmileCat.gif"
		})
	};
};

function onLoadMes()
{
	ols.n = authNick;
	ols.dt = performance.now() - ols.dt;
	$.ajax({
		url: apihost + "api0/onload",
		data: ols
	});
	testScrool();
};

function UpdateChat() {
	if(!authorized) return;
	
	var uquery = { n:authNick, t:t };
	$.ajax({
		url: apihost + "api0/update",  //ChatState.php
		dataType: 'text', //'html', 
		data: uquery, 
		//timeout: '27000',
		success: function(data){
			console.log("yes");
			
			var i = data.indexOf("\n")
			var vt = data.substring(0,i);
			var vdata = data.substring(i+1);

			if(vt=="no") //setTimeout(UpdateChat, 20000); // хотя по-хорошему нужно молчать до явного запроса авторизации
			{	authorized = false;
				onAuthChange();
				document.getElementById('authansw').innerHTML = data;
				ChatAppend(vdata); // а нужно ли показывать причину отказа прямо в чате, а не только в authansw ?
			}
			else // если ответ не 'no', то первая его строка - текущее время:
			{ 	t = vt;
				ChatAppend(vdata);
				if(authorized)
					UpdateChat(); // и тут же пошлём следующий запрос
			};
		},
		error: function(e){
			console.log("err");
			setTimeout(UpdateChat, 20000);  // повтор по таймеру через 20 секунд
			ChatAppend("Нет связи с хабом");
		},
		dataType: "html"
	  });
}

function sm(mes) {

	document.all.ChBxScr.checked = true; // при отправке сообщения прокрутку надо вернуть всегда

	mes = mes.trim(); // всё же обрежем пробелы вокруг сообщения

	if(mes=="") return; // пустым сообщением не нунжо флудить
	
	if(mes[0]=='!')
	{
		if(mes=="!ы") { document.all.chatdiv.innerHTML=""; return; }; // special for Susl:
		if(mes=="!игноры") {
			var nstr = ""; 
			for (var n in nicks) if(nicks[n]=="Hidden") nstr+= n + " ";
			if(nstr!="") ChatAppend("<System> Список игнорируемых: " + nstr);
					else ChatAppend("<System> Список игнорируемых ников пуст");
			ChatAppend('<System> Команда отправки в игнор - "!игнор ник", вернуть из игнора - "!неигнор ник", посмотреть список игноров - "!игноры"');
			return;
		};
		if(mes.indexOf("!игнор")==0) { 
			var n = mes.substring(6).trim(); 
			if(n!="") { nicks[n]= "Hidden"; ChatAppend("<System> " + "Вы поставили в игнор ник "+n+ " (вернуть обратно - командой !неигнор " + n + ")"); };
			return;
		};
		if(mes.indexOf("!неигнор")==0) { 
			var n = mes.substring(8).trim(); 
			if(n!="") { if(nicks[n]=="Hidden") delete nicks[n]; ChatAppend("<System> " + "Вы убрали из игнора ник "+n+ " (вернуть обратно - командой !игнор " + n + ")"); };
			return;
		};
	}
	
	var mquery = { n: authNick, m: mes};
  	$.ajax({
		url: apihost+'api0/send',
		type: "POST",
		//dataType: 'text', //'text',
		data:  mquery,
		// processData: false, 
		success: function(data){
			console.log(data);
			// если пришлют "no" - предложить сменить ник или отправить запрос на переавторизацию?
			var vt = data
			var i = data.indexOf("\r")
			if(i>=0)
			{ 	var vt = data.substring(0,i);
				var vdata = data.substring(i+2); // пропускаем \r\n\
				if( vdata!="") // если на наше сообщение ответили приватным - покажем его в чате:
					// ChatAppend("post answ: " + vdata+"\r\n"); // хотя лучше бы цветом ещё выделить
					ChatAppend("<System> " + vdata+"\r\n"); // хотя лучше бы цветом ещё выделить
			};
			if(vt!="ok") // если в первой строке ответа не ок - наше сообщение не пускают
			{ /* какая-то неочевидная функция, скорее даже лишняя
				memmes = mes; // попробуем запомнить сообщение для повторной отправки
			  authorized = false; // для быстрой переавторизации если выкидывало по таймеру
			  sauth(document.getElementById("nick").value);  // и авторизоваться ещё раз
				*/
			} else memmes = "";
		},
		error: function(e){
			console.log("mes-err");
			ChatAppend("Нет ответа на отправку сообщения");
		},
		dataType: "html"
	  }); 
}

function setAuthEnabled(b){
	document.getElementById('ButtonAuth').disabled = !b;
	document.getElementById('nick').disabled = !b;
	document.getElementById('pass').disabled = !b;
}

function sauth(mes){  
	setAuthEnabled(false);
	var aquery = { n:mes, p: document.getElementById('pass').value };
	var comand = apihost;
	if (!authorized) comand+='api0/auth'; else comand+='api0/quit';
	$.ajax({
		url:  comand, //apihost+ comand, // 'auth.php',
		type: "POST",
		dataType: 'text', //'text',
		data:  aquery,
		//processData: false, 
		//timeout: '27000',
		success: function(data){
				console.log("auth-yes");
				//ChatAppend("auth answ: " + data+"\r\n"); // покажем ответ на запрос авторизации as is (цветом бы выделить)
				ChatAppend("<System> Авторизация:" + data+"\r\n"); // покажем ответ на запрос авторизации as is (цветом бы выделить)
				authorized = (data=="ok")
				if(authorized) 
				{ 	if(memmes!="") sm(memmes); // отправим запомненное (неочевидное поведение?)
					authNick = mes;
					localSett.nick = authNick; //запоминать надо только успешно авторизованный ник
					localSett.pass = aquery.p; // и пароль (как бы его потом стереть ещё)
					document.getElementById('authansw').innerHTML = "        "; // "Вы вошли под ником "+authNick;
					//document.getElementById('authansw').innerHTML = "Вы вошли под ником <span style='color:" + aColor + "'>"+authNick +"</span>";
					document.getElementById('you').innerHTML = "<b style='color:" + aColor + "'>"+authNick +"</b>";
					document.getElementById('send').focus();
					UpdateChat(); // успешная авторизация - повод запросить состояние чата
					UpdateUsers(); // раз мы решили что юзеры тоже только при авторизации
				} else
				{	document.getElementById('authansw').innerHTML = data; };
				onAuthChange();
				setAuthEnabled(true);
		},
		error: function(e){
			console.log("auth-err");
			//ChatAppend("Нет ответа на запрос авторизации");
			ChatAppend("<System> " + "Нет ответа на запрос авторизации");
			setAuthEnabled(true);
		},
		dataType: "html"
	  });  
}

function squit(){
	authorized = false; //независимо от ответа сервера выход означает прекратить запросы
	onAuthChange(); // и показать панельку авторизации
	// authNick = "";
	var qquery = { n:authNick };
	$.ajax({
		url: apihost +"api0/quit",
		type:"POST",
		data: qquery,
		dataType: 'text',
		success: function(data) {
			console.log("quit-yes: " + data);
			document.getElementById('authansw').innerHTML = "";//data; // можно показать ответ на случай выхода с чужого ника 
			document.getElementById('you').innerHTML = "?";
		},
		error: function(e) {
			console.log("quit-err");
			ChatAppend("Нет ответа на запрос выхода");
		}
	});
}

function onAuthChange()
{
	document.getElementById('ButtonSend').disabled = !authorized;
	
	if(authorized)
	{
		document.getElementById('ButtonAuth').value = "Выйти";
		document.getElementById("nick").style.display = "none";
		document.getElementById("pass").style.display = "none";
		document.getElementById("ButtonQuit").style.display = "block";
		document.getElementById("ButtonAuth").style.display = "none";
	}
	else
	{
		document.getElementById('ButtonAuth').value = "Войти";
		document.getElementById("nick").style.display = "block";
		document.getElementById("pass").style.display = "block";
		document.getElementById("ButtonQuit").style.display = "none";
		document.getElementById("ButtonAuth").style.display = "block";
		
		document.getElementById("nick").focus();
	}
}

function setStyle(newStyle) {
	if (newStyle in StylesTable)
	{
		groups =  StylesTable[newStyle].groups;
		
		localSett.styleName = newStyle;
		
		ChatAppend("Вы включили стиль "+newStyle);
	}
	else ChatAppend("Вы запросили неизвестный стиль "+newStyle);
}

var hist = []; // массив всех отправленных соообщений
var histIndex=-1; // индекс (при отправке ставится в hist.length)


function onLoadProc()
{
	initMenu();
	
	var ts=document.getElementById("send");
	ts.onkeydown = function (e) {
		e = e.which;
		
		if (e == 13) {
			sm(ts.value); 
			hist.push(ts.value); histIndex = hist.length;
			ts.value='';
			return false;
		}
		
		// работа с историей сообщений
		if(e==38) // up arrow
		{	histIndex--; if(histIndex<0) histIndex = 0;
			ts.value = hist[histIndex];
			ts.focus(); //ts.setSelectionRange(0, ts.value.length);// ts.selectionStart=0; ts.selectionEnd = ts.value.length; 
			ts.selectionStart = ts.value.length;
			return false;
		}
		if(e==40) // down arrow
		{	histIndex++; // if(histIndex>=(hist.length-1)) histIndex = (hist.length-1);
			if(histIndex>hist.length) histIndex = hist.length;
			if(histIndex == hist.length) ts.value = ""; else  // последний переход вниз - пустая строка
			ts.value = hist[histIndex]; 
			ts.focus(); //ts.setSelectionRange(0, ts.value.length);//ts.selectionStart=0; ts.selectionEnd = ts.value.length;
			ts.selectionStart = ts.value.length;
			return false;
		}
		
		return true;
	}
	
	var bs= document.getElementById("ButtonSend");
	bs.onclick = function (e) {
		var t=document.getElementById("send");
		sm(t.value);
		ts.value = '';
	}
	
	var ba= document.getElementById("ButtonAuth");
	ba.onclick = function (e) {
		var nb=document.getElementById("nick");
		sauth(nb.value);
	}
	
	var tn=document.getElementById("nick");
	tn.onkeydown = function (e) {
		e = e.which;
		if (e == 13) {
			sauth(tn.value); 
			return false;
		}
		return true;
	}
		
	var tp=document.getElementById("pass");
	tp.onkeydown = function (e) {
		// document.getElementById('ButtonSend').disabled = true; //?
		e = e.which;
		if (e == 13) {
			sauth(document.getElementById("nick").value); 
			return false;
		}
		return true;
	}
		
	var ba= document.getElementById("ButtonQuit");
	ba.onclick = function (e) {
		squit();
	}
	
	/*
	var bs= document.getElementById("ButtonScrool");
	bs.onclick = function (e) {
		document.all.ChBxScr.checked = true;
		testScrool()
		//document.all.chatdiv.scrollTop = document.all.chatdiv.scrollHeight;
		bs.style.display = "none";
		bs.value = "Прокрутка включена";
		document.getElementById("send").focus();
	};
	*/
	
	var sl = document.getElementById("StSel");
	sl.onchange = function () {
		var newStyle = sl.value; //ChatAppend(sl.options[sl.selectedIndex].value);
		setStyle(newStyle);
	}
	
	// загрузка из локальных настроек:
	lsYes = ('localStorage' in window) && window['localStorage']!==null;
	if(lsYes) {
		var savedSett = JSON.parse(localStorage.getItem('_AlfaVikaSett1'));
		if(savedSett) localSett = savedSett; // если такого пункта ещё не существует
		tn.value = localSett.nick;
		if(localSett.pass) tp.value = localSett.pass; // или не надо пароль хранить вообще?
		//setStyle(localSett.styleName);
		for (var i=0; i<sl.options.length; i++)
			if(sl.options[i].value==localSett.styleName) sl.options[i].selected = true;
		sl.onchange(); // обработчик select-а надо вызывать явно
		
		if(localSett.nicks) //загружаем индивидуальные настройки ников
		for (var key in localSett.nicks) {
			if(nicks[key]) continue; // захардкоренные в скрипте имеют приоритет
			nicks[key] = localSett.nicks[key];
		};
	}
	
	// действия при закрытии или обновлении окна:
	window.onbeforeunload = function (e) { 
		if(authorized) // закрытие страницы считается выходом
			squit();
		if(lsYes) {
			localSett.nicks = nicks; // сохраняем настройки для ников
			localStorage.setItem('_AlfaVikaSett1', JSON.stringify(localSett));
		}
	}
		
	tn.focus();
	
	// UpdateChat(); // запускать цикл опроса чата наверное не нужно без авторизации
	UpdateUsers(); // а вот узнать кто онлайн - так и быть, можно
}

function setPswProc()
{
	var psw = window.prompt("Установите новый пароль", "");
	if(psw==null) return; // если нажали "отмена" prompt возвращает null
	sm("!regmefast "+psw);
	document.getElementById("pass").value = psw;
}

function initMenu(){
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
						this.style.zIndex=100
			this.getElementsByTagName("ul")[0].style.visibility="visible"
						this.getElementsByTagName("ul")[0].style.zIndex=0
			}
			ultags[t].parentNode.onmouseout=function(){
						this.style.zIndex=0
						this.getElementsByTagName("ul")[0].style.visibility="hidden"
						this.getElementsByTagName("ul")[0].style.zIndex=100
			}    }  }}
	/*
	if (window.addEventListener)
	window.addEventListener("load", createcssmenu2, false)
	else if (window.attachEvent)
	window.attachEvent("onload", createcssmenu2)
	*/
	createcssmenu2();
}