
// "полифил" для коварного IE (хотя скорее всего всё равно не заработает):
function getXhrObject(){
	if(typeof XMLHttpRequest === 'undefined'){
		XMLHttpRequest = function() {
			try { return new window.ActiveXObject( "Microsoft.XMLHTTP" ); }
			catch(e) {};
		};
	} else
	return new XMLHttpRequest(); //хотя всем соверменным браузерам должно быть достаточно этого
};

function getTableData(addr, panelName)
{
	var xhr = getXhrObject();
	var url = addr;
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() { 
		if(xhr.readyState == 4 && xhr.status == 200)
		{	var str = xhr.responseText;
			var tableData = JSON.parse(str);
			updateTable(tableData, panelName);
		};
	};
	xhr.send();
};


function updateTable(tData, panelName)
{
	var html = "";
	html+='<table id="mainTable" border="1" >\r\n';
	html+="<thead><tr>";
	html+="<th>Ник</th> <th>Ранг</th> <th>Ответы</th> <th>Очки($)</th> <th>Цепочки</th>"
	html+="</tr></thead><tbody>\r\n";
	
	//for (var i=0; i<arjArray.length; i++)
	for (var n in tData)
	{	html+="<tr>";
		var t = tData[n];
		html+="<td>" + n + "</td>";
		//html+="<td>" + t.RankName + "</td>";
		html+="<td>" + t.RankName.substr(n.length) + "</td>";
		
		html+="<td>" + t.Answ + "</td>";
		html+="<td>" + t.Score + "</td>";
		html+="<td>" + t.Streak + "</td>";

		html+="</tr>\r\n";
	};
	
	html+='</tbody></table>\r\n'
	
	var panel = document.getElementById(panelName);
	panel.innerHTML = html;
	
	$("#mainTable").dataTable({
		"aaSorting": [[ 2, "desc" ]], // сортировка по первому столбцу
		"iTotalDisplayRecords": 25,
		"iDisplayLength": 25
	});
};