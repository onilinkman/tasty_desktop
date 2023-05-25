var itemsArray = [];

var cambiarNombre = new Map();
cambiarNombre.set('due_date', 'Fecha de vencimiento');

var datosAOmitir = new Map();

var tablaItems = new TablasDinamicas(
	'table-container-1',
	itemsArray,
	'',
	cambiarNombre,
	['table'],
	'item_table',
	datosAOmitir,
	['hol'],
	removeItem
);

const AddMerchandise = async () => {
	let merchandise = document.getElementById('form_merchandise').value;
	let date = document.getElementById('form_data').value;
	let place = document.getElementById('form_place').value;
	let alert = document.getElementById('alertMessage');
	alert.style.display='block'
	if (merchandise === '' && date === '' && place === '') {
		alert.removeChild(alert.firstChild);
		alert.appendChild(
			document.createTextNode('debe llenar todos los campos')
		);
	} else if (itemsArray.length === 0) {
		alert.removeChild(alert.firstChild);
		alert.appendChild(
			document.createTextNode('Debe agregar algun producto')
		);
	} else {
		let msg = await window.api.AddMerchandise(
			JSON.stringify({
				merchandise,
				date,
				place,
				itemsArray,
			})
		);
		console.log(msg, msg?.errno);
	}
};

const addItemArray = () => {
	let nameItem = document.getElementById('item_name').value;
	let price = document.getElementById('item_price').value;
	let acount = document.getElementById('item_acount').value;
	let date = document.getElementById('due_date').value;
	let categoria = document.getElementById('type_item');
	let indexCat = categoria.options.selectedIndex;
	let id_categoria = categoria.options.item(indexCat).value;
	if (indexCat === 0) {
		console.log('Debe seleccionar una categoria');
		return;
	}
	itemsArray.push({
		nombre: nameItem,
		precio: price,
		cantidad: acount,
		due_date: date,
		id_categoria,
	});
	tablaItems.setRealObjeto(itemsArray);
	tablaItems.actualizarX();
	tablaItems.actualizarTabla();
	tablaItems.AddClass('table-hover');
	tablaItems.ocultarBotonExcel();
};

//tablaItems.actualizarTabla();

function removeItem(numFila) {
	let newTd = document.createElement('td');
	let newButton = document.createElement('button');
	newButton.type = 'button';
	newButton.classList.add('btn');
	newButton.classList.add('btn-danger');
	newButton.onclick = () => {
		itemsArray.splice(
			tablaItems.cantidadInPage * tablaItems.puntero + numFila,
			1
		);
		tablaItems.setRealObjeto(itemsArray);
		tablaItems.actualizarX();
		tablaItems.actualizarTabla();
	};
	newButton.appendChild(document.createTextNode('Eliminar'));
	newTd.appendChild(newButton);
	return newTd;
}
