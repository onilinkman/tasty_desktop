const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	AddMerchandise: (data) => {
		return ipcRenderer.invoke('addMerchandise',data);
	},
});
