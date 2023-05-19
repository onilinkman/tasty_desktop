var itemsArray = [];

var cambiarNombre = new Map();

var datosAOmitir = new Map();

var tablaItems = new TablasDinamicas(
	'table-container-1',
	itemsArray,
	'Productos',
	cambiarNombre,
	'table',
	datosAOmitir,
	['hol'],
	removeItem
);

const AddMerchandise = async () => {
	let msg = await window.api.AddMerchandise(
		'prueba1',
		'2023-05-17 05:37:19',
		'05EF0S'
	);
	console.log(msg, msg?.errno);
};

const addItemArray = () => {
	let nameItem = document.getElementById('item_name').value;
	let price = document.getElementById('item_price').value;
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
		'fecha de vencimiento': date,
		id_categoria,
	});
	tablaItems.setRealObjeto(itemsArray);
	tablaItems.actualizarTabla();
	tablaItems.AddClass('table-hover');
	tablaItems.ocultarBotonExcel();
};

//tablaItems.actualizarTabla();

function removeItem(numFila) {
	let newTd = document.createElement('td');
	newTd.appendChild(document.createTextNode(numFila));
	return newTd;
}
