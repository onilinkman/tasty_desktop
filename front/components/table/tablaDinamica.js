class TablasDinamicas {
	puntero = 0;
	paginadorContenedor;
	cantidadElementos;
	funcionFila = null;
	funcionColumna = null;

	/**
	 *
	 * @param contenedorId Ingresar el ID del div o contenedor donde se le agregara la tabla
	 * @param x Aqui va el array de JSONs a mostrar
	 * @param tituloTabla Aqui viene un String que sera el titulo de la tabla
	 * @param cambiarNombre con este map se puede cambiar el nombre de los encabezados
	 * @param nombreTabla le da el class/className a la tabla
	 * @param datosAOmitir un has map para mostrar columnas que intente generar un JSON
	 * @param cabeceraExtra un Array de Strings para aumentar cabeceras
	 */
	constructor(
		contenedorId,
		x,
		tituloTabla,
		cambiarNombre,
		nombreTabla,
		datosAOmitir,
		cabeceraExtra
	) {
		this.contenedorId = contenedorId;
		this.realObjeto = x;
		this.tituloTabla = tituloTabla;
		this.cambiarNombre = cambiarNombre;
		this.nombreTabla = nombreTabla;
		this.datosAOmitir = datosAOmitir;
		this.cabeceraExtra = cabeceraExtra;
		this.botonExcel;
		this.cantidadInPage = 10;
		this.x = this.realObjeto.slice(0, this.cantidadInPage);
		this.cantidadElementos = this.realObjeto.length;
		this.agregarColumnaExtra = arguments;
	}

	crearTablaPorObjeto() {
		if (this.x.length > 0) {
			var arrayNameObjects = Object.keys(this.x[0]);
			this.newTable = document.createElement('table');

			this.newTable.createCaption();
			this.newTable.innerHTML =
				'<caption>' + this.tituloTabla + '</caption>';

			var thead = document.createElement('thead');

			var contenedorTabla = document.getElementById(this.contenedorId);
			var nuevoFragmento = document.createDocumentFragment();

			//*9****Para llenar la cabezera******
			var newTr = this.obteniendoCabezera(
				arrayNameObjects,
				this.datosAOmitir,
				this.cabeceraExtra,
				this.cambiarNombre
			); //Obtenemos la cabezera
			thead.appendChild(newTr);
			this.newTable.appendChild(thead);
			//            this.newTable.appendChild(newTr);
			//****FIN DEL LLENADO DE LA CABECERA***

			var tbody = document.createElement('tbody');

			//*******LLENADO DEL CUERPO******
			for (let i = 0; i < this.x.length; i++) {
				var newTrBody = this.obteniendoCuerpo(
					this.x[i],
					i,
					arrayNameObjects,
					this.datosAOmitir,
					this.agregarColumnaExtra
				);
				tbody.appendChild(newTrBody);
			}
			//*******FIN LLENADO TABLA **********
			this.newTable.appendChild(tbody);
			this.newTable.classList.add(this.nombreTabla); //nombre de la clase que se le asigna la tabla
			nuevoFragmento.appendChild(this.newTable);
			this.newTable.id = this.nombreTabla;

			this.botonExcel = document.createElement('button');

			this.botonExcel.onclick = () => {
				var data_type = 'data:application/vnd.ms-excel';
				var tabla_html = this.newTable.outerHTML.replace(/ |#/g, '%20');
				var tempElemento = document.createElement('a');
				tempElemento.href =
					data_type + ',<meta charset="UTF-8">' + tabla_html;
				tempElemento.download = 'TablaExcel.xls';
				tempElemento.click();
			};
			this.botonExcel.id = 'button' + this.nombreTabla;
			this.botonExcel.classList.add('botonEditarPedido');
			this.botonExcel.appendChild(
				document.createTextNode('Generar Excel')
			);
			//this.botonExcel.style.display="none";//comentar para que aparezca el boton de generar excel
			contenedorTabla.appendChild(this.botonExcel);
			contenedorTabla.appendChild(nuevoFragmento);
			this.tabla = document.getElementById(this.nombreTabla);
			this.paginador();
			this.inputTamañoTabla();
		}
	}

	/**
	 * Se define el tamaño de la tabla con un input
	 */
	inputTamañoTabla() {
		var newInput = document.createElement('input');
		newInput.value = this.cantidadInPage;
		newInput.setAttribute('type', 'number');
		newInput.setAttribute('min', '1');
		newInput.onkeydown = () => {
			this.cantidadInPage = newInput.value;
			this.x = this.realObjeto.slice(0, this.cantidadInPage);
			this.actualizarTabla();
		};
		document.getElementById(this.nombreTabla).appendChild(newInput);
		//        document.getElementById(this.nombreTabla).prepend(newInput);
	}

	//Obtiene de un objeto
	obteniendoCabezera(objetoTr, datosAOmitir, cabeceraExtra, cambiarNombre) {
		var newTr = document.createElement('tr');

		for (let i = 0; i < objetoTr.length; i++) {
			if (!datosAOmitir.has(objetoTr[i])) {
				var newTh = document.createElement('th');
				newTh.appendChild(
					document.createTextNode(
						typeof cambiarNombre == 'object' &&
							cambiarNombre.has(objetoTr[i])
							? cambiarNombre.get(objetoTr[i])
							: objetoTr[i]
					)
				);
				newTh.classList.add('cabecera');
				newTr.appendChild(newTh);
			}
		}
		for (let j = 0; j < cabeceraExtra.length; j++) {
			var newTh = document.createElement('th');
			newTh.appendChild(document.createTextNode(cabeceraExtra[j]));
			newTh.classList.add('cabecera');
			newTr.appendChild(newTh);
		}
		return newTr;
	}

	setId(nuevoID) {
		this.newTable.id = nuevoID;
	}

	setX(newX) {
		this.x = newX;
	}

	actualizarTabla() {
		this.eliminarEstaTabla();
		if (!!this.botonExcel) {
			this.botonExcel.remove();
		}
		this.crearTablaPorObjeto();
	}

	resetearTabla() {
		this.eliminarEstaTabla();
		this.x = this.realObjeto;
		this.x = this.realObjeto.slice(0, this.cantidadInPage);
		this.cantidadElementos = this.realObjeto.length;
		if (!!this.botonExcel) {
			this.botonExcel.remove();
		}
		this.crearTablaPorObjeto();
	}

	paginador(funcionBoton = null) {
		this.eliminarPaginador();
		var contenedor = document.getElementById(this.contenedorId);
		this.paginadorContenedor = document.createElement('div');
		this.paginadorContenedor.classList.add('contPaginador');
		this.paginadorContenedor.id = 'contPaginador' + this.nombreTabla;
		var modObj = this.cantidadElementos / this.cantidadInPage;
		var intLengthObj = Math.trunc(modObj);
		var sw = true;
		var pageCont =
			modObj - intLengthObj === 0 ? intLengthObj : intLengthObj + 1;
		for (
			let i = this.puntero - 2 > 0 ? this.puntero - 2 : 0;
			i < pageCont;
			i++
		) {
			if (i < this.puntero + 3 || i === pageCont - 1) {
				var newButton = document.createElement('button');
				newButton.id = 'paginaButton' + pageCont;
				newButton.appendChild(document.createTextNode(i + 1));
				if (this.puntero === i) {
					newButton.style.background = 'rgb(233, 144, 144)';
				}
				if (funcionBoton === null) {
					newButton.onclick = () => {
						this.puntero = i;
						this.x = this.realObjeto.slice(
							i * this.cantidadInPage,
							(i + 1) * this.cantidadInPage
						);
						this.actualizarTabla();
					};
				} else {
					newButton.onclick = () => {
						this.puntero = i;
						funcionBoton(i);
						this.paginador(funcionBoton);
					};
				}
				this.paginadorContenedor.appendChild(newButton);
			} else if (i < pageCont - 1 && sw) {
				sw = false;
				var tres = document.createElement('label');
				tres.id = 'tresPuntos';
				tres.appendChild(document.createTextNode(' ......... '));
				this.paginadorContenedor.appendChild(tres);
			}
		}
		contenedor.appendChild(this.paginadorContenedor);
	}

	eliminarPaginador() {
		if (this.existePaginador()) {
			this.paginadorContenedor.remove();
		}
	}

	existePaginador() {
		return !!document.getElementById('contPaginador' + this.nombreTabla);
	}

	/**
	 * Agrega una nueva clase a la tabla, es bueno para darle mas estilos.
	 * @param {string} nameclass
	 */
	AddClass(nameclass) {
		try {
			this.newTable.classList.add(nameclass);
		} catch (err) {}
	}

	//obteniendoCuerpo agrega una fila a la tabla
	obteniendoCuerpo(
		Elemento,
		fila,
		arrayNameObjects,
		datosAOmitir,
		agregarColumnaExtra
	) {
		var newTr = document.createElement('tr');

		newTr.id = 'fila' + fila;
		for (let i = 0; i < arrayNameObjects.length; i++) {
			if (!datosAOmitir.has(arrayNameObjects[i])) {
				var newTd = document.createElement('td');
				newTd.appendChild(
					document.createTextNode(Elemento[arrayNameObjects[i]])
				);
				newTd.classList.add('casilla');
				if (this.funcionColumna !== null) {
					newTd.onclick = () => {
						this.funcionColumna(i);
					};
				}
				newTr.appendChild(newTd);
			}
		}
		for (let i = 0; i < agregarColumnaExtra.length; i++) {
			if (typeof agregarColumnaExtra[i] === 'function') {
				var newTd = agregarColumnaExtra[i](fila);
				newTd.classList.add('casilla');
				newTr.appendChild(newTd);
			}
		}

		if (this.funcionFila !== null) {
			newTr.onclick = () => {
				this.funcionFila(fila);
			};
		}
		return newTr;
	}

	mostrarBotonExcel() {
		if (this.existeBotonExcel()) {
			document.getElementById('button' + this.nombreTabla).style.display =
				'block';
		}
	}

	ocultarBotonExcel() {
		if (this.existeBotonExcel()) {
			document.getElementById('button' + this.nombreTabla).style.display =
				'none';
		}
	}

	existeBotonExcel() {
		return !!document.getElementById('button' + this.nombreTabla);
	}

	eliminarFila(fila) {
		document.getElementById('fila' + fila).remove();
	}

	eliminarEstaTabla() {
		if (!!this.newTable) {
			this.newTable.remove();
		}
	}

	agregarFila(fila, objeto) {
		var arrayLlaves = Object.keys(objeto);
		var newTr = this.newTable.insertRow(fila);
		newTr.id = 'filaCreada' + fila;
		for (let i = 0; i < arrayLlaves.length; i++) {
			var newTd = document.createElement('td');
			newTd.appendChild(document.createTextNode(objeto[arrayLlaves[i]]));
			newTd.classList.add('casilla');
			newTr.appendChild(newTd);
		}

		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === 'function') {
				var newTd = arguments[i](fila);
				newTd.classList.add('casilla');
				newTr.appendChild(newTd);
			}
		}
	}

	get getTable() {
		return this.newTable;
	}

	searchTextByArray(texto) {
		var objetoFiltrado = [];
		if (texto == '') {
			return this.realObjeto;
		}
		texto = texto.toString().toLocaleLowerCase();
		if (this.realObjeto.length > 0) {
			var arrayNameObjects = Object.keys(this.realObjeto[0]);
			for (let i = 0; i < this.realObjeto.length; i++) {
				var aux = this.realObjeto[i];
				for (let j = 0; j < arrayNameObjects.length; j++) {
					if (
						this.datosAOmitir.has(
							Object.keys(this.realObjeto[0])[j]
						)
					) {
						var detalle = aux[arrayNameObjects[j]];
						if (detalle != null) {
							detalle = detalle.toLocaleLowerCase();
							if (
								texto.length > detalle.length ||
								detalle
									.normalize('NFD')
									.replace(/[\u0300-\u036f]/g, '')
									.search(
										texto
											.normalize('NFD')
											.replace(/[\u0300-\u036f]/g, '')
									) == '-1'
							) {
								continue;
							} else if (
								detalle
									.normalize('NFD')
									.replace(/[\u0300-\u036f]/g, '')
									.search(
										texto
											.normalize('NFD')
											.replace(/[\u0300-\u036f]/g, '')
									) != '-1'
							) {
								objetoFiltrado.push(aux);
								break;
							}
						}
					}
				}
			}
		}
		return objetoFiltrado;
	}

	setCantidadElementos(nuevaCantidad) {
		this.cantidadElementos = nuevaCantidad;
	}

	setFuncionFila(funcionFila) {
		this.funcionFila = funcionFila;
	}

	setFuncionColumna(functionColumna) {
		this.funcionColumna = functionColumna;
	}

	setRealObjeto(x) {
		this.realObjeto = x;
		this.x = this.realObjeto.slice(0, this.cantidadInPage);
		this.cantidadElementos = this.realObjeto.length;
	}
}
