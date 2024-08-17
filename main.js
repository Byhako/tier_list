import './style.css'

const $ = el => document.querySelector(el)
const $$ = el => document.querySelectorAll(el)

const imageInput = $('#image-input')
const itemsSection = $('#selector-items')

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

imageInput.addEventListener('change', (event) => {
  const [file] = event.target.files

  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (eventReader) => {
      createItem(eventReader.target.result)
    }

  }
})


let draggenElement = null
let sourceContainer = null

const rows = $$('.tier .row')

rows.forEach((row) => {
  row.addEventListener('drop', handleDrop)
  row.addEventListener('dragover', handleDragOver)
  row.addEventListener('dragleave', handleDragLeave)
})

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
  console.log('drop')

  if (sourceContainer && draggenElement) {
    sourceContainer.removeChild(draggenElement)
  }

  if (draggenElement) {
    const src = dataTransfer.getData('text/plain')
    const imageElement = createItem(src)
    currentTarget.appendChild(imageElement)
  }
}

function handleDragOver(event) {
  event.preventDefault()
  const { currentTarget } = event
  console.log('drag over')
}

function handleDragLeave(event) {
  event.preventDefault()
  const { currentTarget } = event
  console.log('drag leave')
}