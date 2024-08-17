import './style.css'

const $ = el => document.querySelector(el)
const $$ = el => document.querySelectorAll(el)

const imageInput = $('#image-input')
const itemsSection = $('#selector-items')
const resetButton = $('#reset-button')

const createItem = (image) => {
  const imgElement = document.createElement('img')
  imgElement.draggable = true
  imgElement.src = image
  imgElement.classList.add('item-image')

  imgElement.addEventListener('dragstart', handleDragStart)
  imgElement.addEventListener('dragend', handleDragEnd)

  itemsSection.appendChild(imgElement)

  return imgElement
}

const useFilesToCreateItems = (files) => {
  if (files?.length > 0) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
  
      reader.onload = (eventReader) => {
        createItem(eventReader.target.result)
      }
    })
  }
}

imageInput.addEventListener('change', (event) => {
  const { files } = event.target

  useFilesToCreateItems(files)
})

let draggenElement = null
let sourceContainer = null

const rows = $$('.tier .row')

rows.forEach((row) => {
  row.addEventListener('drop', handleDrop)
  row.addEventListener('dragover', handleDragOver)
  row.addEventListener('dragleave', handleDragLeave)
})

itemsSection.addEventListener('drop', handleDrop)
itemsSection.addEventListener('dragover', handleDragOver)
itemsSection.addEventListener('dragleave', handleDragLeave)

function handleDragStart(event) {
  draggenElement = event.target
  sourceContainer = draggenElement.parentElement
  event.dataTransfer.setData('text/plain', draggenElement.src)
}

function handleDragEnd() {
  draggenElement = null
  sourceContainer = null
}

function handleDrop(event) {
  event.preventDefault()
  const { currentTarget, dataTransfer } = event

  if (sourceContainer && draggenElement) {
    sourceContainer.removeChild(draggenElement)
  }

  if (draggenElement) {
    const src = dataTransfer.getData('text/plain')
    const imageElement = createItem(src)
    currentTarget.appendChild(imageElement)
  }

  currentTarget.classList.remove('drag-over')
  currentTarget.querySelector('.drag-preview')?.remove()
}

function handleDragOver(event) {
  event.preventDefault()
  const { currentTarget } = event

  if (sourceContainer === currentTarget) {
    return
  }

  currentTarget.classList.add('drag-over')

  const dragPreview = $('.drag-preview')

  if (draggenElement && !dragPreview) {
    const previewElement = draggenElement.cloneNode(true)
    previewElement.classList.add('drag-preview')
    currentTarget.appendChild(previewElement)
  }
}

function handleDragLeave(event) {
  event.preventDefault()
  const { currentTarget } = event

  currentTarget.classList.remove('drag-over')
  currentTarget.querySelector('.drag-preview')?.remove()
}

resetButton.addEventListener('click', () => {
  const items = $$('.tier .item-image')

  items.forEach((item) => {
    item.remove()
    itemsSection.appendChild(item)
  })
})