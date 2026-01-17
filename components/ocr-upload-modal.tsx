"use client"

import type React from "react"

import { useState } from "react"
import { X, FileText, ImageIcon } from "lucide-react"
import { extractTextFromPdf } from "@/lib/gemini-service"

interface OCRUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onExtractText: (text: string) => void
  onFileUpload?: (file: File) => void
}

export default function OCRUploadModal({ isOpen, onClose, onExtractText, onFileUpload }: OCRUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      // If it's a PDF, use Gemini service to extract text
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        if (onFileUpload) {
          // Use the provided handler which will use Gemini service
          await onFileUpload(file)
        } else {
          // Fallback: extract text directly
          const text = await extractTextFromPdf(file)
          onExtractText(text)
        }
        onClose()
      } else if (file.type.startsWith('image/')) {
        // For images, use Gemini service as well (it supports images)
        if (onFileUpload) {
          await onFileUpload(file)
        } else {
          const text = await extractTextFromPdf(file)
          onExtractText(text)
        }
        onClose()
      } else {
        setError('Unsupported file type. Please upload a PDF or image file.')
      }
    } catch (err) {
      console.error('Error processing file:', err)
      setError('Failed to extract text. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is set and try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-2 border-purple-500 rounded-lg w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">OCR - Scan Document</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {uploading ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white font-medium">Processing document...</p>
              <p className="text-sm text-slate-400">Extracting text using OCR</p>
            </div>
          ) : (
            <>
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition cursor-pointer ${
                  isDragging
                    ? "border-purple-400 bg-purple-500/10"
                    : "border-slate-600 hover:border-purple-500 hover:bg-purple-500/5"
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="flex gap-3 justify-center text-3xl">
                    <FileText size={32} className="text-purple-400" />
                    <ImageIcon size={32} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Upload PDF or Image</p>
                    <p className="text-xs text-slate-400 mt-1">Drag and drop or click to browse</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileInput} 
                  className="hidden" 
                  id="file-upload-input"
                />
                <label htmlFor="file-upload-input" className="cursor-pointer" />
              </label>
            </>
          )}
          {error && (
            <div className="mt-4 text-center text-red-400 bg-red-900/20 border border-red-500 rounded p-3 text-sm">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="border-t border-slate-700 p-4 bg-slate-700/50 text-xs text-slate-300 space-y-1">
          <p>Supported formats: PDF, PNG, JPG, JPEG</p>
          <p>The extracted text will be displayed in your reading panel</p>
          {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
            <p className="text-yellow-400 mt-2">
              ⚠️ Please set NEXT_PUBLIC_GEMINI_API_KEY for PDF extraction
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
