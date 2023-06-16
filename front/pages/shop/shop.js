var cambiarNombre = new Map();
cambiarNombre.set('name', 'Producto');
cambiarNombre.set('price', 'Precio (Bs)');
cambiarNombre.set('due_date', 'Fecha de vencimiento');
cambiarNombre.set('amount', 'Cantidad disponible');
var datosAOmitir = new Map();
datosAOmitir.set('id_item', 'id_item');

var tableItems = new TablasDinamicas(
	'table-container-1',
	[],
	'',
	cambiarNombre,
	['table'],
	'item_table',
	datosAOmitir,
	['Agregar'],
	CreateBtnSale
);

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
var cambiarNombreSale = new Map();
var datosAOmitirSale = new Map();

var tableItemsSale = new TablasDinamicas(
	'table-container-2',
	[],
	'',
	cambiarNombreSale,
	['table'],
	'item_table_sale',
	datosAOmitirSale,
	['Eliminar'],
	btnRemoveSale
);

var itemToSale = new Map();

const getAllItems = async () => {
	let body = JSON.parse(await window.api.GetAllItems());
	if (body.status === 200) {
		tableItems.setRealObjeto(body.data);
		tableItems.actualizarX();
		tableItems.actualizarTabla();
	}
};

function CreateBtnSale(numFila) {
	let newTd = document.createElement('td');
	newTd.classList.add('container');
	newTd.classList.add('text-center');

	let newDiv = document.createElement('div');
	newDiv.classList.add('row');

	let newInput = document.createElement('input');
	newInput.type = 'number';
	newInput.placeholder = 'Cantidad';
	newInput.classList.add('form-control');
	newDiv.appendChild(newInput);

	newTd.appendChild(newDiv);

	let newButton = document.createElement('button');
	newButton.appendChild(document.createTextNode('Agregar'));
	newButton.classList.add('row');
	newButton.classList.add('btn');
	newButton.classList.add('btn-primary');
	newButton.onclick = () => AddSale(numFila, newInput.value.trim());
	newTd.appendChild(newButton);

	return newTd;
}

function AddSale(numFila, amount) {
	let obj =
		tableItems.realObjeto[
			tableItems.cantidadInPage * tableItems.puntero + numFila
		];
	if (amount !== '' && amount > 0 && amount <= obj.amount) {
		//si existe entonces solo sumara
		if (itemToSale.get(obj.id_item)) {
			let convAmount = parseInt(amount);
			if (itemToSale.get(obj.id_item).amount + convAmount <= obj.amount) {
				itemToSale.get(obj.id_item).amount += convAmount;
			} else {
				console.error('No se puede agregar esacantidad');
			}
		} else {
			let newObj = {
				id_item: obj.id_item,
				name: obj.name,
				price: obj.price,
				amount: parseInt(amount),
				due_date: obj.due_date,
			};
			itemToSale.set(obj.id_item, newObj);
		}
		tableItemsSale.setRealObjeto(Array.from(itemToSale.values()));
		tableItemsSale.actualizarX();
		tableItemsSale.actualizarTabla();
		console.log(itemToSale);
	} else {
		console.error('invalid input');
	}
}

function removeSale(numFila) {
	let obj =
		tableItemsSale.realObjeto[
			tableItemsSale.cantidadInPage * tableItemsSale.puntero + numFila
		];
	itemToSale.delete(obj.id_item);
	console.log(obj)
}

function btnRemoveSale(numFila) {
	let newTd = document.createElement('td');
	let newBtn = document.createElement('button');
	newBtn.classList.add('btn');
	newBtn.classList.add('btn-danger');
	newBtn.appendChild(document.createTextNode('Eliminar'));
	newBtn.onclick = () => {
		removeSale(numFila);
	};
	newTd.appendChild(newBtn);
	return newTd;
}



getAllItems();
