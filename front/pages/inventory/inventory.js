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
	['Eliminar'],
	removeItem
);

const hiddenSuccessMessage = () => {
	setTimeout(() => {
		let succ = document.getElementById('successMessage');
		succ.style.display = 'none';
	}, 3000);
};

const AddMerchandise = async () => {
	let merchandise = document.getElementById('form_merchandise').value;
	let date = document.getElementById('form_data').value;
	let place = document.getElementById('form_place').value;
	let alert = document.getElementById('alertMessage');
	if (merchandise === '' && date === '' && place === '') {
		alert.style.display = 'block';
		alert.removeChild(alert.firstChild);
		alert.appendChild(
			document.createTextNode('debe llenar todos los campos')
		);
	} else if (itemsArray.length === 0) {
		alert.style.display = 'block';
		alert.removeChild(alert.firstChild);
		alert.appendChild(
			document.createTextNode('Debe agregar algun producto')
		);
	} else {
		alert.style.display = 'none';
		let msg = await window.api.AddMerchandise(
			JSON.stringify({
				merchandise,
				date,
				place,
				itemsArray,
			})
		);
		if (msg) {
			alert.style.display = 'block';
			alert.removeChild(alert.firstChild);
			alert.appendChild(
				document.createTextNode(
					'Ocurrio un error al ingresar los items',
					msg?.errno
				)
			);
			let succ = document.getElementById('successMessage');
			succ.style.display = 'none';
		} else {
			CleanDisplay();

			let succ = document.getElementById('successMessage');
			succ.style.display = 'block';
			hiddenSuccessMessage();
		}
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
		const toastLiveExample = document.getElementById('liveToast');

		const toastBootstrap =
			bootstrap.Toast.getOrCreateInstance(toastLiveExample);
		toastBootstrap.show();
		return;
	}
	itemsArray.push({
		nombre: nameItem,
		precio: price,
		cantidad: acount,
		due_date: date,
		id_categoria,
	});
	CleanDisplayItem();
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

const AddUser = async () => {
	let inputFullName = document.getElementById('recipient-name');
	let data = {
		fullname: inputFullName.value,
	};
	console.log(data);
	let msg = await window.api.AddUser(JSON.stringify(data));
	console.log(msg);
};

function CleanDisplay() {
	document.getElementById('item_name').value = '';
	document.getElementById('item_price').value = '';
	document.getElementById('item_acount').value = '';
	document.getElementById('due_date').value = '';
	document.getElementById('form_merchandise').value = '';
	document.getElementById('form_data').value = '';
	document.getElementById('form_place').value = '';
	itemsArray = [];
	tablaItems.setRealObjeto(itemsArray);
	tablaItems.actualizarX();
	tablaItems.actualizarTabla();
}

function CleanDisplayItem() {
	document.getElementById('item_name').value = '';
	document.getElementById('item_price').value = '';
	document.getElementById('item_acount').value = '';
	document.getElementById('due_date').value = '';
}
