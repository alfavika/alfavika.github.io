// ������ ������������� ���������� ����.
// ������� ������� ���������� cssmenu1 � css-������ ����;
// ���������� �������� ������ ���������� ��� chatdiv;
// ��� �������� ������ ������ ���� �������� ����� window.sm;
// ����� ����� - function initMenu().


/*  ������� ���������� ���� �� ul-������ ������ div-� � ������� horizontalcssmenu.
����� � http://javascriptt.ru/menu20.html , �� �������� ���������� ��������������� css
*/
function initMenu(){
	if(makeVikaMenu) makeVikaMenu(); //��� ������-�� ������ ������
	
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

// ��������� ������ ����:
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

// ��������� � ������ ����� ���� � ����� js-��������:
function addItem(submenu, sname, sjs)
{
	var elm = document.createElement('li');
	elm.innerHTML = ' <a href="javascript:void(0);" onclick="'+ sjs + '" >' + sname + '</a> ';
	submenu.appendChild(elm);
}

// ��������� � ������ ����� ���� � scom-�������� � arg-�����������:
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
			if(sarg==null) return; // ������
			str = str+" "+sarg;
		};
		window.sm(str);
	};
	elm.appendChild(a);
	submenu.appendChild(elm);
}

// ��������� ������� ���������� ������ ������ �� �������� ��������:
function changeFont(element,step)
{	step = parseInt(step,10);
	var el = document.getElementById(element);
	var curFont = parseInt(el.style.fontSize,10);
	el.style.fontSize = (curFont+step) + 'px';
}

// ��������, ��� ������ ����� ���� ������ ���� ���������� ���������� ������� window.sm ��� �������� � ������� ���:
function makeVikaMenu()
{
	var mm = document.getElementById("cssmenu1");
	var m;
	
	m = addSubMenu(mm, "��","you"); // you ������ ����, �� ���� �������� ������ ����
		addItem(m, "��� ����������", "sm('!myscore');");
		addItem(m, "������ ������", "setPswProc();");
		addItem(m, "--");
		addItem(m, "�����", "squit();");
	
	m = addSubMenu(mm, "����","idtops");
		addItem(m, "�� �������", "sm('!answers');");
		addItem(m, "�� �����", "sm('!scores');");
		addItem(m, "�� ��������", "sm('!strikes');");
		addItem(m, "�� ������", "sm('!�������');");
		addItem(m, "�� ������������� ������", "sm('!�����');");
		addItem(m, "�� �������� ��������", "sm('!recordes');");
	
	m = addSubMenu(mm, "�������","idtur");
		addItemCom(m, "���� (�������� ��������)", "!����", {desc:"���������� ���� �����? (5-10)", def:10});
		addItemCom(m, "���� (������� ��������)", "!�����", {desc:"���������� ���� �����? (5-10)", def:10});
		addItemCom(m, "���� (����������)", "!drag", {desc:"���������� ���� �����? (5-10)", def:10});
		addItemCom(m, "���������", "!ana", {desc:"���������� ��������? (5-10)", def:10});
		addItemCom(m, "�����-������� �������", "!������ engl-rus1.txt", {desc:"���������� �������? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "������-�������", "!������  ������-�������.txt", {desc:"���������� �������? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "�������&nbsp;������&nbsp;��&nbsp;������", "!������ ���������������������.txt", {desc:"���������� �������? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "���������&nbsp;�������", "!������ ����������������.txt", {desc:"���������� �������? (5-10)", def:10}, {value:"1"});
		addItemCom(m, "�����&nbsp;��&nbsp;�����&nbsp;(��&nbsp;��������)", "!words", {desc:"���������� ���� � ������� �����? (5-20)", def:10}, {desc:"����� �� ������ ������� ����?", def:2} );
		addItemCom(m, "�����&nbsp;��&nbsp;�����&nbsp;(�������)", "!hwords", {desc:"���������� ���� � ������� �����? (5-20)", def:10}, {desc:"����� �� ������ ������� ����?", def:2} );
		
	m = addSubMenu(mm, "����","idduels");
		addItemCom(m, "�����&nbsp;��&nbsp;������", "!duel4", {desc:"�� ������� ������� �����? (5-10)", def:10});
		addItemCom(m, "�����&nbsp;��&nbsp;��������", "!duel1", {desc:"�� ������� ������� �����? (5-10)", def:10});
		addItemCom(m, "�����&nbsp;��&nbsp;�����", "!duel2", {desc:"�� ������� ������� ������? (3-5)", def:3});
		addItem(m, "--");
		addItem(m, "������� �����", "sm('!��������');");

	m = addSubMenu(mm, "����","idinfo");
		addItem(m, "�������&nbsp;����", "sm('!show rules');");
		addItem(m, "��������", "sm('!show informer');");
		addItem(m, "���� ������", "sm('!show links');");
		//addItem(m, "--");
		addItem(m, "�����", "sm('!show topic');");
		addItem(m, "--");
		addItem(m, "����&nbsp;������", "document.getElementById('reportdiv').style.display='block';");
		
	// � ��� ������ ����� ����, �������, ������ ������������ ������� � id=TabContainer
	m = addSubMenu(mm, "���","idvid");
		addItem(m, "����� �������", "changeFont('chatdiv',1);");
		addItem(m, "����� ������", "changeFont('chatdiv',-1);");
		addItem(m, "--");
		addItem(m, "����������&nbsp;��������", "sm('!������');");
		addItem(m, "������� ����", "document.all.chatdiv.innerHTML='';"); // ������� �� chatdiv
};