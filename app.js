
function load() {
	var i;
	var mydata = JSON.parse(itemlist);
	var tableData = '';
	
	for( i =0; i < mydata.length; i++)
	{ 
		var refCode = mydata[i].code;
		var description = mydata[i].description;
		var jobNo = mydata[i].job;
		var quantity = mydata[i].quantity;
		
		tableData += '<tr>';		
		tableData += '<td >'+ refCode +'</td>';
		tableData += '<td >'+ description +'</td>';
		tableData += '<td >';		
			tableData += '<input autofocus id="qnt'+i+refCode+'" type="text" class="form-input" placeholder="Quantity" '
			tableData += 'value="'+ quantity +'"  disabled>';					
		tableData +='</td>';
		tableData += '<td class="saveBtnContainer">';
			//Save
			tableData += '<span id="sv'+i+refCode+'" class="btn-sbm btnIcon24 hide" title="Save"';
			tableData += 'onclick="saveOnClk(\''+i+refCode+'\''+',\''+refCode+'\''+',\''+jobNo+'\''+')"></span>';
		tableData += '</td>';
		tableData += '<td id="tcp'+jobNo+'"></td>';
		tableData += '<td id="tcs'+jobNo+'"></td>';
		tableData += '<td class="rhsBtnContainer">';
			//Delete
			tableData += '<span class="btn-dlt btnIcon24" title="Delete Row"';
				tableData += 'onclick="deleteOnClk(\''+refCode+'\''+',\''+description+'\''+',\''+jobNo+'\''+')"></span>';
			//Edit	
			tableData += '<span id="ed-'+i+refCode+'" class="btn-edt btnIcon24" title="Edit Row"';
				tableData += 'onclick="editOnClk(\''+i+refCode+'\')"></span>';
		tableData += '</td>';		
		tableData+= '</tr>';
		
		//get values from CSV file and add in to TD by passed id
		getValueFromCSV(mydata[i].code, mydata[i].job, mydata[i].description);
				
	};		
	
	document.getElementById("table-content").innerHTML = tableData;
};

function getValueFromCSV(itemCode, jobNo, description) {
	//alert(itemCode+'-'+jobNo+'-'+ description);
	$.ajax({	
		url:"data/rates_lookup.csv",
		dataType:"text",
		success:function(data){
			//alert('inside');
			var itemData = data.split(/\r?\n|\r/);
			//var tableData = '<table class="table">';
			
			for(var i = 0; i < itemData.length; i++){
				var cellData = itemData[count].split(",");
				//tableData+= '<tr>';
				for(var cellCount = 0; cellCount < cellData.length; cellCount++)
				{
					if(i === 0){
						//tableData+='<th>'+cellData[cellCount]+'</th>';
						//do not need this
					}
					else{
						//tableData+='<td>'+cellData[cellCount]+'</td>';
	
						if(cellData[0] == itemCode && cellData[1] == description){
							//alert(cellData[3]);
							document.getElementById("tcp"+jobNo).innerHTML = cellData[3];
							document.getElementById("tsp"+jobNo).innerHTML = cellData[4];
						}
						else{
							//alert('not');
							document.getElementById("tcp"+jobNo).innerHTML = '';
							document.getElementById("tsp"+jobNo).innerHTML = '';
						}
					}
				}
				//tableData+= '</tr>';
			}
			//tableData+= '</table>';
			
			//document.getElementById("myContent").innerHTML = tableData;
		}
		});
	
}


function editOnClk(itemCode) {
	var allQntIn = document.getElementsByClassName('form-input');
	var btnSaveArray = document.getElementsByClassName('btn-sbm');
	
	
		for(var i =0; i < allQntIn.length; i++){
			
			var inputID = allQntIn[i].getAttribute('id');
			var saveBtnID = btnSaveArray[i].getAttribute('id');
			
			if(inputID == 'qnt'+itemCode){
				document.getElementById(inputID).disabled = false;
				document.getElementById(saveBtnID).classList.remove('hide');				
				focusAtEnd(inputID);
			}else{
				document.getElementById(inputID).disabled = true;
				document.getElementById(saveBtnID).classList.add('hide');
				//alert('add hide');
			};
			
			
		}//end of FOR loop
	
}

function saveOnClk(itemCode, ref, jobNum) {
	
	var i;
	var mydata = JSON.parse(itemlist);
	var newQuantity = document.getElementById('qnt'+itemCode).value;
	//alert(newQuantity);
	
	for( i =0; i < mydata.length; i++)
	{ 
		
		if( mydata[i].code == ref && mydata[i].job == jobNum){
			//mydata[i].quantity = JSON.stringify(newQuantity);
			//mydata[i].quantity = mydata[i].quantity.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, newQuantity);
			//alert('saved');
			
		}
	}

	//disable and hide all elements
	document.getElementById('sv'+itemCode).classList.add('hide');
	document.getElementById('qnt'+itemCode).disabled = true;
	//re-populate the table
	load();
		
}


function deleteOnClk(itemCode, description, jobNo) {
	
	disableAndHideAll();
		
	document.getElementById("deleteMsg").classList.remove('hide');
	//set values for inputs
	document.getElementById("dltCodeInput").value = itemCode;
	document.getElementById("dltJobInput").value = jobNo;
	document.getElementById("dltDescriptionInput").value = description;	
}


$(document).on( 'click', '#spn-addNewLine', function () { 
	document.getElementById("addNewMsg").classList.remove('hide');
	document.getElementById("addCodeInput").focus();
	
});

function addNewLine(){
	
	var newCode = document.getElementById("addCodeInput").value;
	var newJobNo =	document.getElementById("addJobInput").value;
	var newDescription = document.getElementById("addDescriptionInput").value;
	var newQuantity = document.getElementById("addQuantityInput").value;
	//hide and reset
	hideMsg("cancel");
	
	//NOTE: dont know how to save
	
	//var obj = JSON.parse(itemlist);
	//obj['itemlist'].push({"code": "0","job": "0","description": "empty","quantity": "0"});	
	//obj = JSON.stringify(obj);
	/*
	var data = JSON.parse(itemlist);  
		data.itemlist.push({       
			code:newCode,
			job:newJobNo,
			description:newDescription,
			quantity:newQuantity
		});
		itemlist = JSON.stringify(data); 
	*/
	
}	
function hideMsg(param) {
	
	if(param == 'cancel'){
		document.getElementById("deleteMsg").classList.add('hide');
		document.getElementById("addNewMsg").classList.add('hide');
		
		//reset inputs
		document.getElementById("dltCodeInput").value ='';
		document.getElementById("dltJobInput").value ='';
		document.getElementById("dltDescriptionInput").value ='';
		
		document.getElementById("addCodeInput").value ='';
		document.getElementById("addJobInput").value ='';
		document.getElementById("addDescriptionInput").value ='';
		document.getElementById("addQuantityInput").value ='';
	}
	else if(param == 'delete'){
		document.getElementById("deleteMsg").classList.add('hide');
		//reset inputs
		var code = document.getElementById("dltCodeInput").value;
		var jonNo = document.getElementById("dltJobInput").value;
		var description = document.getElementById("dltDescriptionInput").value;
		
		//Do DELETE
	}	
	
}
 
function disableAndHideAll() {

	var allQntIn = document.getElementsByClassName('form-input');
	var btnSaveArray = document.getElementsByClassName('btn-sbm');
	for(var i =0; i < allQntIn.length; i++){
		var inputID = allQntIn[i].getAttribute('id');
		var saveBtnID = btnSaveArray[i].getAttribute('id');
		document.getElementById(inputID).disabled = true;
		document.getElementById(saveBtnID).classList.add('hide');
	}//end of FOR loop
	
}
 
/*Search or SortBy colum*/ 
$(document).ready(function(){
    $('.filterable .btn-filter').click(function(){
        var $panel = $(this).parents('.filterable'),
        $filters = $panel.find('.filters input'),
        $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

    $('.filterable .filters input').keyup(function(e){
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;
        /* Useful DOM data and selectors */
        var $input = $(this),
        inputContent = $input.val().toLowerCase(),
        $panel = $input.parents('.filterable'),
        column = $panel.find('.filters th').index($input.parents('th')),
        $table = $panel.find('.table'),
        $rows = $table.find('tbody tr');
        /* Dirtiest filter function ever ;) */
        var $filteredRows = $rows.filter(function(){
            var value = $(this).find('td').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });
        /* Clean previous no-result if exist */
        $table.find('tbody .no-result').remove();
        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
        $rows.show();
        $filteredRows.hide();
        /* Prepend no-result row if all rows are filtered */
        if ($filteredRows.length === $rows.length) {
            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="'+ $table.find('.filters th').length +'">No result found</td></tr>'));
        }
    });
});

function focusAtEnd(inputID) {
//with ID as ref it didnt work 
//getElementById did work here	
  document.getElementById(inputID).focus();
  var s = document.getElementById(inputID).value;
  document.getElementById(inputID).value = '';
  document.getElementById(inputID).value = s;
}
$(document).on( 'click', '#table-content tr', function () { 
	$(this).addClass('activeRow').siblings().removeClass('activeRow');
});


/*SORT TABLE column header click */
function sortTable(f,n){
    var rows = $('#mytable tbody  tr').get();

    rows.sort(function(a, b) {

        var A = getVal(a);
        var B = getVal(b);

        if(A < B) {
            return -1*f;
        }
        if(A > B) {
            return 1*f;
        }
        return 0;
    });

    function getVal(elm){
        var v = $(elm).children('td').eq(n).text().toUpperCase();
        if($.isNumeric(v)){
            v = parseInt(v,10);
        }
        return v;
    }

    $.each(rows, function(index, row) {
        $('#mytable').children('tbody').append(row);
    });
}
var f_code = 1; 
var f_descript = 1;
var f_quant = 1;
var f_cost = 1;
var f_sell = 1;

$(document).on( 'click', '#thCode', function () { 
	f_code *= -1;
    var n = $(this).prevAll().length;
    sortTable(f_code,n);
});

$(document).on( 'click', '#thDesc', function () { 
    f_descript *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_descript,n);
});

$(document).on( 'click', '#thQuant', function () {
    f_quant *= -1; 
    var n = $('.form-input').prevAll().length;
    sortTable(f_quant,n);
});

$(document).on( 'click', '#thCost', function () {
    f_cost *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_cost,n);
});

$(document).on( 'click', '#thSell', function () {
    f_sell *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_sell,n);
});

//Hide the Quantity INPUT and Save Button
$(window).click(function(e) {
    tagetID = e.target.id; 
	
	var quantID = tagetID.replace("ed-", "qnt");
	var saveBtnID = tagetID.replace("ed-", "sv");
	
    targetClass = e.target.className;
	
	var allQntIn = document.getElementsByClassName('form-input');
	var btnSaveArray = document.getElementsByClassName('btn-sbm');
	
	//keep it visible only if clicked on Input or Edit
	if (e.target.className == 'btn-edt'){		
		//do nothing		
	}
	else if (e.target.className == 'form-input'){ 
		//do nothing
	}
	else {
		for(var i =0; i < allQntIn.length; i++){
			var qID = allQntIn[i].getAttribute('id');
			var svID = btnSaveArray[i].getAttribute('id');
			
			if( qID !== quantID){
				allQntIn[i].disabled = true;
				btnSaveArray[i].classList.add('hide');
			}
			else{
				allQntIn[i].disabled = false;
			}
			
		}
	}
	
});

