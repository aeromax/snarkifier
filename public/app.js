const form = document.getElementById('snark-form')
const fileInput = document.getElementById('file')
const urlInput = document.getElementById('url')
const output = document.getElementById('output')
const submitBtn = document.getElementById('submit')
const fileField = document.getElementById('file-field')
const urlField = document.getElementById('url-field')

function enforceMutualExclusion() {
  const hasFile = fileInput.files.length > 0
  const hasUrl = urlInput.value.trim().length > 0

  // If a file is uploaded, disable and dim the URL field
  if (hasFile) {
    urlInput.value = ''
    urlInput.disabled = true
    urlField.classList.add('is-disabled')
  } else {
    urlInput.disabled = false
    urlField.classList.remove('is-disabled')
  }

  // If typing in URL, reset/disable/dim the file field
  if (hasUrl) {
    fileInput.value = ''
    fileInput.disabled = true
    fileField.classList.add('is-disabled')
  } else {
    fileInput.disabled = false
    fileField.classList.remove('is-disabled')
  }
}

fileInput.addEventListener('change', enforceMutualExclusion)
urlInput.addEventListener('input', enforceMutualExclusion)

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  output.value = ''
  submitBtn.disabled = true
  try {
    const hasFile = fileInput.files.length > 0
    const hasUrl = urlInput.value.trim().length > 0
    if ((hasFile && hasUrl) || (!hasFile && !hasUrl)) {
      alert('Please provide either a file or a URL, but not both.')
      submitBtn.disabled = false
      return
    }

    const fd = new FormData()
    if (hasFile) fd.append('file', fileInput.files[0])
    if (hasUrl) fd.append('url', urlInput.value.trim())

    // Reset the form immediately after pressing submit (per requirement)
    form.reset()
    enforceMutualExclusion()

    const res = await fetch('/api/snarkify', { method: 'POST', body: fd })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Server error')
    }
    const data = await res.json()
    output.value = data.text || '(No roast returned)'
  } catch (err) {
    output.value = `Error: ${err.message}`
  } finally {
    submitBtn.disabled = false
  }
})

// Initialize state on load
enforceMutualExclusion()
