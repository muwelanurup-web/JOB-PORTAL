import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const singleUpload = upload.single("file");
export const profileUpload = upload.fields([
	{ name: "file", maxCount: 1 },
	{ name: "profilePicture", maxCount: 1 },
]);
