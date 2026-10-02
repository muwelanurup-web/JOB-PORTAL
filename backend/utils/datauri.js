const getDataUri = (file) => ({
	content: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
});

export default getDataUri;
