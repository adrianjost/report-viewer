const presets = [
	[
		"@babel/env",
		{
			targets: {
				node: "8",
			},
			corejs: 3,
		},
	],
];

module.exports = { presets };
