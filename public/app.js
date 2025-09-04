const form = document.getElementById('snark-form')
const fileInput = document.getElementById('file')
const urlInput = document.getElementById('url')
const output = document.getElementById('output')
const submitBtn = document.getElementById('submit')

function enforceMutualExclusion() {
  if (fileInput.files.length > 0) {
    urlInput.value = ''
    urlInput.disabled = true
  } else {
    urlInput.disabled = false
  }
  if (urlInput.value.trim().length > 0) {
    fileInput.value = ''
    fileInput.disabled = true
  } else {
    fileInput.disabled = false
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

