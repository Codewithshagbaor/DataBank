"use client"

import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMintDocument } from "@/hooks/write/useMintDocument";
import { useRecoilValue } from "recoil";
import { loadingState } from "../state/atom";

const UploadAndMint = () => {
  const [openModal, setOpenModal] = useState(false)
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const loading = useRecoilValue(loadingState)
  const { uploadToIpfs } = useMintDocument()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName("");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName("");
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={(openState) => { setFile(null); setFileName(""); setOpenModal(openState) }}>
      <DialogTrigger onClick={() => setOpenModal(true)} className="btn py-3 px-6 bg-[#2B9DDA] text-white hover:text-black border-2 border-white shadow-lg">
        Upload New Document
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="font-bold">Document Upload and Mint</DialogTitle>
        </DialogHeader>

        <div className="">
          {loading ? (
            <div className="w-full max-w-3xl text-center space-y-4 mx-auto bg-black/90 p-6 rounded-lg border-2 border-dashed border-[#2B9DDA]">
              <h6 className="text-lg">Your document is being minted as an NFT. Please wait while we process this transaction</h6>
              
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#2B9DDA] h-full rounded-full w-2/3 animate-indeterminate" />
              </div>
            </div>
          ) : (
            <>
              <div onDrop={handleDrop} onDragOver={handleDragOver} className="w-full h-4/5 p-10 md:p-24 bg-gray-900 rounded-xl border-2 border-dashed border-blue-500">
                <div className="flex flex-col items-center text-center">
                  <Image src="/img/upload2.png" alt="upload image" className="mb-4 w-16 h-16" height={10000} width={10000} />
                  <h6 className="mb-2">Select your file or drag and drop</h6>
                  <h6 className="text-gray-400 mb-6">PNG, PDF, JPG, DOCX accepted</h6>
                  
                  <label htmlFor="fileInput" className="px-8 py-2 btn rounded-md font-medium cursor-pointer">Browse</label>
                  <input type="file" id="fileInput" onChange={handleFileChange} accept=".png,.pdf,.jpg,.docx" className="hidden"/>
                </div>

                {file && (
                  <div className="mt-4 text-center">
                    <h6 className="text-green-500">File selected: {file.name}</h6>
                    <input type="text" placeholder="Enter a name for your document" value={fileName} onChange={(e) => setFileName(e.target.value)}
                      className="mt-4 p-2 border border-gray-300 rounded-md w-full bg-gray-800 text-white"
                    />
                  </div>
                )}
              </div>
              
              <Button onClick={() => uploadToIpfs(file, fileName).then(response => (response === true && setOpenModal(false)))} className="flex gap-x-4 items-center justify-center px-5 py-3 btn text-lg hover:bg-[#2B9DDA] mt-7 w-full max-w-xs place-self-center">
                <Coins size={17} />
                Mint
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadAndMint