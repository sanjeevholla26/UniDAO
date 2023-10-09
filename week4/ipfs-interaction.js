const { ethers } = require("hardhat");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const config = {
    apiKey: '', // Replace with your Pinata API Key
    apiSecret: '', // Replace with your Pinata API Secret
    pinataBaseURL: "https://api.pinata.cloud",
};

async function uploadImageToIPFS(imageFilePath) {
    try {
        if (!fs.existsSync(imageFilePath)) {
            console.error('Image file does not exist at the specified path:', imageFilePath);
            process.exit(1);
        }
        const imageBuffer = fs.readFileSync(imageFilePath);
        const headers = {
            'pinata_api_key': config.apiKey,
            'pinata_secret_api_key': config.apiSecret,
            'Content-Type': 'multipart/form-data',
        };
        const formData = new FormData();
        formData.append("file", imageBuffer, { filename: 'pic.jpg' });
        try {
            delete headers['Content-Type'];
            const response = await axios.post(`${config.pinataBaseURL}/pinning/pinFileToIPFS`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    ...headers,
                },
                maxContentLength: Infinity,
            });

            if (response.status === 200 && response.data.IpfsHash) {
                console.log('Image uploaded to IPFS with CID:', response.data.IpfsHash);
                return response.data.IpfsHash;
            } else {
                console.error('Error uploading image to IPFS:');
                console.error('Response status:', response.status);
                console.error('Response data:', response.data);
                process.exit(1);
            }
        } catch (error) {
            console.error('Error uploading image to IPFS:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            process.exit(1);
        }
    } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        process.exit(1);
    }
}

async function main() {
    const [deployer] = await ethers.getSigners();
    const contractAddress = "0xdfb86F0e94e57DF936cEb848ae902b9b282BF93B"; // Replace with your deployed contract address
    const imageFilePath = "/home/sanjeev/Pictures/img.jpg"; // Replace with the path to your image file

    // Upload image to IPFS and get the imageURI
    const imageURI = `https://gateway.pinata.cloud/ipfs/${await uploadImageToIPFS(imageFilePath)}`;

    console.log("Minting NFT...");

    try {
        const abiFile = "artifacts/contracts/myNFT.sol/MyNFT.json"; // Replace with the path to your contract's ABI file
        const abiData = fs.readFileSync(abiFile);
        const abi = JSON.parse(abiData.toString()).abi;
        const nftContract = new ethers.Contract(contractAddress, abi, deployer);

        const tx = await nftContract.mintNFT(imageURI);
        await tx.wait();
        console.log("NFT minted successfully. Transaction Hash:", tx.hash);
    } catch (error) {
        console.error('Error minting NFT:', error.message);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
