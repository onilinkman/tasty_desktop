module.exports = {
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'inventorysystem',
				authors: 'Christian Marban Callisaya',
				exe: 'inventorysystem.exe',
			},
		},
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'onilinkman',
					name: 'tasty_desktop',
				},
				prerelease: false,
				draft: true,
			},
		},
	],
};
