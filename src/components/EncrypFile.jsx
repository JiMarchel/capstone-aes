import { useState } from "react";
import axios from "axios"; // Ensure Axios is imported
import Wrapper from "./Wrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { CardResult } from "./CardResult";

const EncryptFile = () => {
	const [file, setFile] = useState(null);
	const [keyLength, setKeyLength] = useState("128");
	const [aesKey, setAesKey] = useState("");
	const [iv, setIv] = useState("");
	const [encryptedFilePath, setEncryptedFilePath] = useState("");

	// Handle file encryption
	const handleEncrypt = async () => {
		if (!file) {
			alert("Pilih file terlebih dahulu.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("key_length", keyLength);

		try {
			// Update URL with the correct backend URL
			const response = await axios.post("http://110.239.71.90:7832/encrypt", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// Process encryption response
			setAesKey(response.data.key);
			setIv(response.data.iv);
			setEncryptedFilePath(response.data.encrypted_file);
			alert("File berhasil dienkripsi.");
		} catch (error) {
			console.error("Error during encryption:", error);
			alert("Terjadi kesalahan saat proses enkripsi.");
		}
	};

	// Handle file download
	const handleDownload = () => {
		if (!encryptedFilePath) {
			alert("Tidak ada file terenkripsi untuk diunduh.");
			return;
		}

		// Make sure the download URL is correct
		const downloadUrl = `http://110.239.71.90:7832${encryptedFilePath}`;
		window.open(downloadUrl, "_blank");
	};

	return (
		<Wrapper >
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">
						Enkripsi File
					</CardTitle>
					<CardDescription>
						Encrypt your file
					</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-2 mb-8">

					<Input
						type="file"
						accept=".pdf,.docx,.xlsx"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<div>
						<Select
							onValueChange={setKeyLength}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select an algorithm" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Algorithm</SelectLabel>
									<SelectItem value="128">AES-128</SelectItem>
									<SelectItem value="256">AES-256</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Button onClick={handleEncrypt}>
							Encrypt
						</Button>
					</div>
				</CardContent>

				{aesKey && iv && encryptedFilePath && (
					<CardFooter>
						<div className="w-full space-y-2">
							<h3>Encryption result:</h3>
							<CardResult title="Kunci AES:" result={aesKey} />
							<CardResult title="IV:" result={iv} />
							<CardResult title="Encrypted file:" result={encryptedFilePath} />

							<Button onClick={handleDownload}>
								Download File
							</Button>
						</div>

					</CardFooter>
				)}
			</Card>
		</Wrapper>
	);
};

export default EncryptFile;
