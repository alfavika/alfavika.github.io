// �������������� ������ ����������� ������ �������� ������
// ������� ������� ���������� usersdiv, jquery, ���������� apihost � authorized
// �������� ����������� �� �������� ����������� � chat.js
// ����� ����� - function UpdateUsers

function DrawSubList(list) {
	for(var key in list) 
	{	if(key=="count") continue;
		$('#usersdiv').append("<p class="+ groups[gOfNick(key)].ns +" onclick='onNC(this);' >" + key + "</p>");
		// �����-������ � list[key] ����� �����-�� ��������� ������������, � ���� ����� ����� ������, ��� �� ������
	};
	$('#usersdiv').append("<p>&nbsp;</p>");
};

function DrawUserList(u) {
	
	$('#usersdiv').html("");
	$('#usersdiv').append("<b> Web (" + u.web.count +"): </b>");
	DrawSubList(u.web);
	$('#usersdiv').append("<b> DC ops (" + u.ops.count +"): </b>");
	DrawSubList(u.ops);
	$('#usersdiv').append("<b> DC users (" + u.dc.count +"): </b>");
	DrawSubList(u.dc);
	if(u.topic) { //upd �� 21.07.2017
		$('#authansw').html(u.topic);
		document.title = "�����-���: " + u.topic;
	};
	return;
}

function UpdateUsers() {
	$.getJSON(apihost+'api0/users.json')
	.success(function(data) { 
				DrawUserList(data);
				if(authorized) setTimeout(UpdateUsers, 60000);  // ������ �� �������
			})
	.error(function() { 
				document.all.usersdiv.innerHTML = "<p>users err</p>"
				if(authorized) setTimeout(UpdateUsers, 60000);  // ������ �� �������
			})
	//.complete(function() { console.log("���������� ����������"); }); // ������ then
	;
}