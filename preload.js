const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	AddMerchandise: (name, date, place) => {
		return ipcRenderer.invoke('addMerchandise',name,date,place);
	},
});
