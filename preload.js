const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	AddMerchandise: (data) => {
		return ipcRenderer.invoke('addMerchandise', data);
	},
	GetAllItems: () => {
		return ipcRenderer.invoke('getAllItems');
	},
	AddUser: (data) => {
		return ipcRenderer.invoke('addUser', data);
	},
});
