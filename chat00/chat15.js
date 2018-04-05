
var apihost = ""; // "http://alfy.no-ip.org/";  // "http://alfavika.ru/"; // "http://localhost/";
var picthost = "http://alfy.no-ip.org/";

var memmes = ""; // ����������� ��������� ��� ������� ��� �������
var authorized = false; // ������� � ���� ���� ������ ��� ���������� ������
var authNick = ""; // ���, �� ������� ���� ������� �����������
var t = "t0"; // ��������� ��������� ��������� ���� (���������� �������� = ����������� ���������)

var aColor = "red"; // ���� ���� ��������������� ����� � ������ ������ (����� �������� � ����������)


var localSett = { // ��������� ������ ����� ��� ������� ������
	nick:"", 
	styleName:"Normal",
	unrevChar:"^" // ������, ������� ���������� @
};  

var StylesTable =
{	// � ������ �������� ���������� ��� ������ ������ ����� �����������:
	// ns - NickStyle - ����� ���� � ��� ����������
	// ps - ParagraphStyle - ����� ������ ������ �� ������� ����
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

var groups = StylesTable.Normal.groups;  // ����� �������� ������ �� ��������� ����� �������� ���������� �����

var nicks = { //���������� �������������� ���� � ������, ������� ���� ���������:
	"Vika":"QuesBot",
	//"System":"QuesBot", // ����������� 17.06.2017
	"Drag":"QuesBot",
	"drag":"QuesBot",
	"������":"QuesBot",
	"����":"QuesBot",
	"���������": "QuesBot", //"InfoBot", �������, �� ���� ��������� � ���������
	"��������":"InfoBot", // ������ �� InfoBot, ��� ���, ��� �������
	"�����������":"InfoBot",
	"�����-���":"InfoBot",
	"UserStyle":"MyNick",
	"MyStyle":"User"
} // ���� ��� ����� ���������� �� localStorage ������ ������, ������� � �.�.
// �������� ����� ������ ������� ��� ����� ������������� ����� ��������� ����� � ������������� � ��� ��������� �����


function gOfNick(n) // ����������� ����� ������ � ������� ��������� ������ ���
{	var g; // = "User";
	if(n==authNick) g = "MyNick"; else 
	if(n in nicks) g = nicks[n];else //if(nick in nicks) g = nicks[nick];else // ������ ����
		g = "User"; //�� ��������� ��� ��������� - ������ �����
	return g;
}

function htmlForNick(n)
{	// ������ ������������� gOfNick
	var sl = groups[gOfNick(n)];
	return "<b class="+ sl.ns +" onclick='onNC(this);' >" + n + "</b>";
}

function ChatAppendOld(news)
{	document.all.chatarea.value += news;
	if(document.all.ChBxScr.checked) // todo - ������� � ���������
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
{	if(document.all.ChBxScr.checked) // todo - ������� � ���������
		document.all.chatdiv.scrollTop = document.all.chatdiv.scrollHeight;
		//document.all.chatdiv.scrollTop += 1000000; // �� ������� ���
}

function testNoScrool()
{
	var cd = document.all.chatdiv;
	if(cd.scrollTop < (cd.scrollHeight - cd.clientHeight))
	{ 	document.all.ChBxScr.checked = false;
		var bs = document.getElementById("ButtonScrool");
		bs.value = "�������� ���������";
		bs.style.display = "block";
	}
	else
	{ 	document.all.ChBxScr.checked = true;
		var bs = document.getElementById("ButtonScrool");
		bs.value = "��������� ��������";
		bs.style.display = "none";
	}
}

var qstate =
{
	theme:"����", //���������� ����
	qdiv:0 //������ �� div ���������� �������
}

var ols =
{
	n: authNick,
	u: "img.jpg",
	dt: 0
}

var last_sg = "User"; // ���������� �����������

var r_s=/\:(yahoo|am|s5|sceptic|secret|blush|cry|good|lol|O_o|04|05|14|smile|sad|give-rose|wacko|gibe|ad|ae|O|music|fig|07|blink|hahaha|lol2|thanks|laughting|o2|wall|flowers|rose|Df|heart|aggressive|cem|rolleyes)\:/gi;

// ����� � ������ ���� ������� �� ����������� ��������� r_s � �������� �� �� img-�����:
function makeSmiles(str)
{
	//������-����������, �� ������������ � ���� :���: ����� �������� � ������ ����:
	str = str.replace(/\:\-?\)/g, ":smile:");
	str = str.replace(/\:\-?\(/g, ":sad:");
	
	// ���������� ��������� ���� ���������� ���� ":���:" � �������� �� �������:
	str=str.replace(r_s, function(dummy, match) {
		return '<img src="../img/smiles/' + match+'.gif">';
		//testScrool(); // ���� ��� ������ ���� ��� ���������� �������, ��������� �� �����
	});
	return str;
}

function ChatAppend(news)
{
	if(news=="") return; //!
	
	// testNoScrool(); //������ :-(
	
	var arr = news.split("\n");
	var uch = localSett.unrevChar || "^"; // �� ������ ����� ���� ������-������, ���� ��������
	var clp = groups["User"].ps; //  ""; // ����� ��������� ����������� ��� ��������������� ������ �����
	var sg = last_sg; //"User"; // � ����� ������ ��������� ����������� (SenderGroup)
	var notif = "";
	var l = arr.length;
	for (var i = 0; i < l; i++)
	{	var str= arr[i];
		if ((str=="")) continue; // �������, ���� ������ ��������� ������ \r\n � ����� ������
		var prestr =""; // ����� ������ ����������� �����
		var j = str.indexOf("<");
		if(j!=-1) // ���� ������� ����
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
			//��������� ����� ����� ������ �������� �����, � ����� ������� ����� ������� ������
			
			str = str.substring(j1+1);
		  };
		}
	
		str = str.replace(new RegExp("<",'g'), "&lt;");
		str = str.replace(new RegExp(">",'g'), "&gt;");
		//str = str.replace(new RegExp("\t",'g'), '<img src="tab2.gif" height="15" width="60" alt="" />');
		//str = str.replace(new RegExp("\t",'g'), '<span style="padding-left:60;"></span>');
		str = str.replace(new RegExp("\t",'g'), '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
		// str = str.replace('\n', "<br>"); // ����� split ������ �� ������ �� ��������
		if(uch!="@") str = str.replace(new RegExp("@",'g'), uch); 
		
		//str = str.replace(authNick, "<b style='color:" + aColor + "'> "+authNick +" </b>"); // ���������� ����, ��� ����� �� ������
		
		var allowImg = (sg!="Hidden"); // ���������� �� ����������� �� ������� ���� (����� ����� ���� � ����� ������� �������)
		
		// ������ ������������� ������
		var haveurl = "";
		str=str.replace(/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function(url) {
		    nice = url;
		    if( url.match('^https?:\/\/') )
		      nice = nice.replace(/^https?:\/\//i,'')
		    else
		      url = 'http://' + url;
			// haveurl = url;
			
			// ������, �������� ������ �������� ������� ��������� ������ ��������� �, ����� ����, �������
			var r=/.(jpg|jpeg|gif|png|bmp)$/i;
			if(allowImg && (r.test(url))) //if (r.test(url))
			{
				var style = 'min-width: 16px; min-height: 16px; background: url(/img/loading-16x16.gif) transparent no-repeat;';
				style+= ' display:block; margin:0 auto; '; // ������� �������� � ��������� ������ � ���������� (��� �� �����?)
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
		// ��������� ������ ������������� ������
		
		if(allowImg) // �������� ������������ ������ �� ����� (���� ��������, �������� ��� �� ����� � �� �����-�����)
		str = makeSmiles(str); // ���� ����� - ������� �������� (���, � ���� ������ - ��� ������ ��� �� ��������)
		  
		if(sg=="QuesBot")
		{
			// qstate.qdiv; qstate.theme
			var isT = (str.indexOf("����:")!=-1) //&& (prestr.indexOf("������")!=-1) // ���� ������ � �������� ��...
			if(isT) 
			{	qstate.theme = str.substr(str.indexOf("����"));
				document.all.themediv.innerHTML = str;
				document.all.scena.style.display = "block";
			};
			
			var isTop = (str.indexOf("���:")!=-1);
			if(isTop)
			{	qstate.theme = "";
				document.all.themediv.innerHTML = "";
				document.all.scena.style.display = "none";
			};
			
			var isQ = (str.indexOf("������")!=-1) || isT || isTop; 
			isQ = isQ || (str.indexOf("����� �")!=-1); // ��� �����
			isQ = isQ || (str.indexOf("���������")!=-1); // ��� ��������
						
			// ������ ����� ������ ������ ����� ���� �������� ������� ����� (����� ���� � �����, ���� ����)
			if(isQ) str = "<b style='margin-top:8px;' >" + str + "</b>";
			
			if((last_sg != sg)||isQ) // (str.indexOf("������")!=-1))
			{
				//*var elm = document.createElement('div');
				//elm.style.width = "50%";
				
				qstate.qdiv = document.createElement('div');
				qstate.qdiv.className = "dw";
				//qstate.qdiv.style = "width: 50%; margin: 0 auto; ";
				//qstate.qdiv.style = "display:table; margin: 0 auto; "; //���������� div
				//qstate.qdiv.style = "width:75%; margin-left:20%"; // �� �������� � �����
				qstate.qdiv.style.marginLeft = '20%'; // ��������� ���, � ����� - � dw
				
				if(isQ) qstate.qdiv.style.paddingTop = '16px';
				
				if(isTop||isT) qstate.qdiv.style.border = "1px solid #000";
				
				qstate.qdiv.title = qstate.theme;
				
				//*elm.appendChild(qstate.qdiv);
				document.all.chatdiv.appendChild(qstate.qdiv);
				//*document.all.chatdiv.appendChild(elm);
			};
			
			// ������ ����� ���� ������ ���, ������ � �������� ����� �������� � ��� �����:
			var z = str.indexOf(" ����� ��"); // ��� �� � "������ ����� ��"
			if(z==-1) z = str.indexOf(" ������ ��");
			if(z!=-1)
			{	var nl = str.indexOf(" ", 1); // ��� ��� ������ ���� ����� ����� ������� �� 2-�� �������
				var anick = str.substr(1, nl-1);
				str = " <i>" + htmlForNick(anick) + "</i>" + str.substr(nl); 
			};
			
			if(str.indexOf("�������:")!=-1) // ������ ��� ��������
			str = "<span style='background-color:#E0FFFF;' >" + str + "</span>";
			
			var pr = str.indexOf("���������� �����:");
			if(pr!=-1)
				//str = str.substr(0,pr+18) + "<span style='background-color:#E0FFFF;' >" + str.substr(pr+18) + "</span>";
				str = str.substr(0,pr+18) + "<b>" + str.substr(pr+18) + "</b>";
			
			str = str.replace(" "+authNick, "<b style='color:" + aColor + "'> "+authNick +"</b>"); // todo - ���� �����������
			// ������, �� ���� ��� ��� ����� ������������ � �������� ���������; ������� � ��� �����, ��� ���� ����� 
			// ���� � ������ �������, ��� ���� ������� ����������� ������ � �� ����� ����� ������, ��� �������� ���������� ��� �� ����
			
			var elm = document.createElement('div');
			if (clp!="") elm.innerHTML = prestr + str; // �����, ��������, �� ����� ��������� �����
					else elm.innerHTML = prestr + str;
			if((str!="")&&(str!=" ")&&(str!="  "))  // ������ ������ �� �������� ����������
				if(qstate.qdiv!=0) qstate.qdiv.appendChild(elm);
		}
		else
		{
			//������������� ��� ������� �����:
			str = str.replace(" "+authNick, "<b style='color:" + aColor + "'> "+authNick +"</b>"); // todo - ���� �����������
			// ��������, ������ ����������� � ��������!
			
			var elm = document.createElement('div');
			if (clp!="") elm.innerHTML =  prestr + " <span class="+ clp + ">" + str + "</span>";
					else elm.innerHTML = prestr + str;
			
			if(sg=="Hidden") // ���� ��� ��������� � ������ ���������� (������������)
			{	elm.classList.add("hiddenMes"); // ��������� ��� div-� � ���� ���������� ���� ����� (���� ������=���� ���� � ������� �����)
				elm.innerHTML = prestr + str;
			}
			
			document.all.chatdiv.appendChild(elm);
			// ��. ����� removeChild, cont.insertBefore(div2, table.nextSibling);
		};
		
		last_sg = sg; //���������� ��� ���������� ����������� ������
		
		if(sg=="QuesBot") notif+=arr[i]+"\n"; // ���������� ��� ��������� �������� ��� �����������
	};
	
	testScrool();

	if(false) // ���� ��������� ��������� ����������� �� ���, ���������� ����� ���. ����� ������������.
	if(notif!="")
	{
		var mailNotification = new Notification("�����-���", {
			tag : "��������",  //��� ����� ��� ����������� ���������
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

			if(vt=="no") //setTimeout(UpdateChat, 20000); // ���� ��-�������� ����� ������� �� ������ ������� �����������
			{	authorized = false;
				onAuthChange();
				document.getElementById('authansw').innerHTML = data;
				ChatAppend(vdata); // � ����� �� ���������� ������� ������ ����� � ����, � �� ������ � authansw ?
			}
			else // ���� ����� �� 'no', �� ������ ��� ������ - ������� �����:
			{ 	t = vt;
				ChatAppend(vdata);
				if(authorized)
					UpdateChat(); // � ��� �� ����� ��������� ������
			};
		},
		error: function(e){
			console.log("err");
			setTimeout(UpdateChat, 20000);  // ������ �� ������� ����� 20 ������
			ChatAppend("��� ����� � �����");
		},
		dataType: "html"
	  });
}

function sm(mes) {

	document.all.ChBxScr.checked = true; // ��� �������� ��������� ��������� ���� ������� ������

	mes = mes.trim(); // �� �� ������� ������� ������ ���������

	if(mes=="") return; // ������ ���������� �� ����� �������
	
	if(mes[0]=='!')
	{
		if(mes=="!�") { document.all.chatdiv.innerHTML=""; return; }; // special for Susl:
		if(mes=="!������") {
			var nstr = ""; 
			for (var n in nicks) if(nicks[n]=="Hidden") nstr+= n + " ";
			if(nstr!="") ChatAppend("<System> ������ ������������: " + nstr);
					else ChatAppend("<System> ������ ������������ ����� ����");
			ChatAppend('<System> ������� �������� � ����� - "!����� ���", ������� �� ������ - "!������� ���", ���������� ������ ������� - "!������"');
			return;
		};
		if(mes.indexOf("!�����")==0) { 
			var n = mes.substring(6).trim(); 
			if(n!="") { nicks[n]= "Hidden"; ChatAppend("<System> " + "�� ��������� � ����� ��� "+n+ " (������� ������� - �������� !������� " + n + ")"); };
			return;
		};
		if(mes.indexOf("!�������")==0) { 
			var n = mes.substring(8).trim(); 
			if(n!="") { if(nicks[n]=="Hidden") delete nicks[n]; ChatAppend("<System> " + "�� ������ �� ������ ��� "+n+ " (������� ������� - �������� !����� " + n + ")"); };
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
			// ���� ������� "no" - ���������� ������� ��� ��� ��������� ������ �� ���������������?
			var vt = data
			var i = data.indexOf("\r")
			if(i>=0)
			{ 	var vt = data.substring(0,i);
				var vdata = data.substring(i+2); // ���������� \r\n\
				if( vdata!="") // ���� �� ���� ��������� �������� ��������� - ������� ��� � ����:
					// ChatAppend("post answ: " + vdata+"\r\n"); // ���� ����� �� ������ ��� ��������
					ChatAppend("<System> " + vdata+"\r\n"); // ���� ����� �� ������ ��� ��������
			};
			if(vt!="ok") // ���� � ������ ������ ������ �� �� - ���� ��������� �� �������
			{ /* �����-�� ����������� �������, ������ ���� ������
				memmes = mes; // ��������� ��������� ��������� ��� ��������� ��������
			  authorized = false; // ��� ������� ��������������� ���� ���������� �� �������
			  sauth(document.getElementById("nick").value);  // � �������������� ��� ���
				*/
			} else memmes = "";
		},
		error: function(e){
			console.log("mes-err");
			ChatAppend("��� ������ �� �������� ���������");
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
				//ChatAppend("auth answ: " + data+"\r\n"); // ������� ����� �� ������ ����������� as is (������ �� ��������)
				ChatAppend("<System> �����������:" + data+"\r\n"); // ������� ����� �� ������ ����������� as is (������ �� ��������)
				authorized = (data=="ok")
				if(authorized) 
				{ 	if(memmes!="") sm(memmes); // �������� ����������� (����������� ���������?)
					authNick = mes;
					localSett.nick = authNick; //���������� ���� ������ ������� �������������� ���
					localSett.pass = aquery.p; // � ������ (��� �� ��� ����� ������� ���)
					document.getElementById('authansw').innerHTML = "        "; // "�� ����� ��� ����� "+authNick;
					//document.getElementById('authansw').innerHTML = "�� ����� ��� ����� <span style='color:" + aColor + "'>"+authNick +"</span>";
					document.getElementById('you').innerHTML = "<b style='color:" + aColor + "'>"+authNick +"</b>";
					document.getElementById('send').focus();
					UpdateChat(); // �������� ����������� - ����� ��������� ��������� ����
					UpdateUsers(); // ��� �� ������ ��� ����� ���� ������ ��� �����������
				} else
				{	document.getElementById('authansw').innerHTML = data; };
				onAuthChange();
				setAuthEnabled(true);
		},
		error: function(e){
			console.log("auth-err");
			//ChatAppend("��� ������ �� ������ �����������");
			ChatAppend("<System> " + "��� ������ �� ������ �����������");
			setAuthEnabled(true);
		},
		dataType: "html"
	  });  
}

function squit(){
	authorized = false; //���������� �� ������ ������� ����� �������� ���������� �������
	onAuthChange(); // � �������� �������� �����������
	// authNick = "";
	var qquery = { n:authNick };
	$.ajax({
		url: apihost +"api0/quit",
		type:"POST",
		data: qquery,
		dataType: 'text',
		success: function(data) {
			console.log("quit-yes: " + data);
			document.getElementById('authansw').innerHTML = "";//data; // ����� �������� ����� �� ������ ������ � ������ ���� 
			document.getElementById('you').innerHTML = "?";
		},
		error: function(e) {
			console.log("quit-err");
			ChatAppend("��� ������ �� ������ ������");
		}
	});
}

function onAuthChange()
{
	document.getElementById('ButtonSend').disabled = !authorized;
	
	if(authorized)
	{
		document.getElementById('ButtonAuth').value = "�����";
		document.getElementById("nick").style.display = "none";
		document.getElementById("pass").style.display = "none";
		document.getElementById("ButtonQuit").style.display = "block";
		document.getElementById("ButtonAuth").style.display = "none";
	}
	else
	{
		document.getElementById('ButtonAuth').value = "�����";
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
		
		ChatAppend("�� �������� ����� "+newStyle);
	}
	else ChatAppend("�� ��������� ����������� ����� "+newStyle);
}

var hist = []; // ������ ���� ������������ ����������
var histIndex=-1; // ������ (��� �������� �������� � hist.length)


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
		
		// ������ � �������� ���������
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
			if(histIndex == hist.length) ts.value = ""; else  // ��������� ������� ���� - ������ ������
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
		bs.value = "��������� ��������";
		document.getElementById("send").focus();
	};
	*/
	
	var sl = document.getElementById("StSel");
	sl.onchange = function () {
		var newStyle = sl.value; //ChatAppend(sl.options[sl.selectedIndex].value);
		setStyle(newStyle);
	}
	
	// �������� �� ��������� ��������:
	lsYes = ('localStorage' in window) && window['localStorage']!==null;
	if(lsYes) {
		var savedSett = JSON.parse(localStorage.getItem('_AlfaVikaSett1'));
		if(savedSett) localSett = savedSett; // ���� ������ ������ ��� �� ����������
		tn.value = localSett.nick;
		if(localSett.pass) tp.value = localSett.pass; // ��� �� ���� ������ ������� ������?
		//setStyle(localSett.styleName);
		for (var i=0; i<sl.options.length; i++)
			if(sl.options[i].value==localSett.styleName) sl.options[i].selected = true;
		sl.onchange(); // ���������� select-� ���� �������� ����
		
		if(localSett.nicks) //��������� �������������� ��������� �����
		for (var key in localSett.nicks) {
			if(nicks[key]) continue; // �������������� � ������� ����� ���������
			nicks[key] = localSett.nicks[key];
		};
	}
	
	// �������� ��� �������� ��� ���������� ����:
	window.onbeforeunload = function (e) { 
		if(authorized) // �������� �������� ��������� �������
			squit();
		if(lsYes) {
			localSett.nicks = nicks; // ��������� ��������� ��� �����
			localStorage.setItem('_AlfaVikaSett1', JSON.stringify(localSett));
		}
	}
		
	tn.focus();
	
	// UpdateChat(); // ��������� ���� ������ ���� �������� �� ����� ��� �����������
	UpdateUsers(); // � ��� ������ ��� ������ - ��� � ����, �����
}

function setPswProc()
{
	var psw = window.prompt("���������� ����� ������", "");
	if(psw==null) return; // ���� ������ "������" prompt ���������� null
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
				spanref.innerHTML="����"
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