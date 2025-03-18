import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'

// Set worker source to the CDN URL
GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
// Define a Pinia store named 'counter' for managing users-related data
export const useHelperStore = defineStore('helper', {
  state: () => ({

  }),
  actions: {
    // Function to create a thumbnail and make it clickable
    async createPdfThumbnail(base64Pdf, containerId) { // Changed to a regular function
      // Convert base64 PDF to a Blob
      const pdfBlob = this.base64ToBlob(base64Pdf, 'application/pdf')

      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob)

      // Render the first page of the PDF as a thumbnail
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // Use PDF.js to render the first page
      const pdf = await getDocument(pdfUrl).promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 0.1 })
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise

      // Append the canvas as a clickable thumbnail
      const container = document.getElementById(containerId)
      const thumbnailLink = document.createElement('a')
      thumbnailLink.href = pdfUrl
      thumbnailLink.target = '_blank' // Open the PDF in a new tab
      thumbnailLink.appendChild(canvas)
      container.appendChild(thumbnailLink)
    },

    // Function to convert base64 to a Blob
    base64ToBlob(base64, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(base64)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      return new Blob(byteArrays, { type: contentType })
    }
  }
})
