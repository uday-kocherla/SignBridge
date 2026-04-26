import 'pose-viewer/loader';

// Initialize Lucide icons
lucide.createIcons();

// Elements
const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const btnClear = document.getElementById('btn-clear');
const btnMic = document.getElementById('btn-mic');
const outputPlaceholder = document.getElementById('output-placeholder');
const outputLoading = document.getElementById('output-loading');
const poseContainer = document.getElementById('pose-container');
const outputError = document.getElementById('output-error');
const errorMessage = document.getElementById('error-message');
const outputActions = document.getElementById('output-actions');
const btnRetry = document.getElementById('btn-retry');
const btnDownload = document.getElementById('btn-download');
const btnShare = document.getElementById('btn-share');
const btnFullscreen = document.getElementById('btn-fullscreen');
const quickPhraseBtns = document.querySelectorAll('.quick-phrases__btn');

// Modals
const modalOverlay = document.getElementById('modal-overlay');
const btnHowItWorks = document.getElementById('btn-how-it-works');
const btnModalClose = document.getElementById('btn-modal-close');

// Mic Toast
const micToast = document.getElementById('mic-toast');
const btnMicStop = document.getElementById('btn-mic-stop');

// State
let currentPoseViewer = null;
let currentPoseUrl = null;
let isTranslating = false;
let translationTimeout = null;
let isListening = false;
let recognition = null;

// Speech Recognition Setup
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening = true;
    btnMic.classList.add('active');
    micToast.classList.remove('hidden');
  };

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      const currentText = textInput.value;
      const newText = currentText ? `${currentText} ${finalTranscript}` : finalTranscript;
      textInput.value = newText;
      updateCharCount();
      triggerTranslation();
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    stopListening();
  };

  recognition.onend = () => {
    // If it ends automatically, restart if we are still supposed to be listening
    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        stopListening();
      }
    } else {
      stopListening();
    }
  };
} else {
  btnMic.style.display = 'none'; // Hide mic if not supported
}

function startListening() {
  if (recognition && !isListening) {
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  }
}

function stopListening() {
  isListening = false;
  btnMic.classList.remove('active');
  micToast.classList.add('hidden');
  if (recognition) {
    recognition.stop();
  }
}

btnMic.addEventListener('click', () => {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
});

btnMicStop.addEventListener('click', stopListening);

// Input Handling
function updateCharCount() {
  const count = textInput.value.length;
  charCount.textContent = `${count} / 500`;
  if (count > 0) {
    btnClear.classList.remove('hidden');
  } else {
    btnClear.classList.add('hidden');
  }
}

textInput.addEventListener('input', () => {
  updateCharCount();
  
  if (translationTimeout) {
    clearTimeout(translationTimeout);
  }
  
  // Debounce translation
  translationTimeout = setTimeout(() => {
    triggerTranslation();
  }, 1000);
});

btnClear.addEventListener('click', () => {
  textInput.value = '';
  updateCharCount();
  resetOutput();
  textInput.focus();
});

// Quick phrases
quickPhraseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    textInput.value = btn.dataset.text;
    updateCharCount();
    triggerTranslation();
  });
});

// Modal handling
btnHowItWorks.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
});

btnModalClose.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});

// Translation Logic
function resetOutput() {
  outputPlaceholder.classList.remove('hidden');
  outputLoading.classList.add('hidden');
  poseContainer.classList.add('hidden');
  outputError.classList.add('hidden');
  outputActions.classList.add('hidden');
  
  if (currentPoseViewer) {
    currentPoseViewer.remove();
    currentPoseViewer = null;
  }
  
  if (currentPoseUrl) {
    URL.revokeObjectURL(currentPoseUrl);
    currentPoseUrl = null;
  }
}

function showError(msg) {
  outputPlaceholder.classList.add('hidden');
  outputLoading.classList.add('hidden');
  poseContainer.classList.add('hidden');
  outputActions.classList.add('hidden');
  outputError.classList.remove('hidden');
  errorMessage.textContent = msg;
}

function showLoading() {
  outputPlaceholder.classList.add('hidden');
  outputLoading.classList.remove('hidden');
  poseContainer.classList.add('hidden');
  outputError.classList.add('hidden');
  outputActions.classList.add('hidden');
}

async function triggerTranslation() {
  const text = textInput.value.trim();
  if (!text) {
    resetOutput();
    return;
  }

  if (isTranslating) return;
  isTranslating = true;
  showLoading();

  try {
    const api = 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose';
    const url = `${api}?text=${encodeURIComponent(text)}&spoken=en&signed=ase`;

    // Fetch the pose data
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // The response is a stream/blob for the .pose file
    const blob = await response.blob();
    
    if (currentPoseUrl) {
      URL.revokeObjectURL(currentPoseUrl);
    }
    currentPoseUrl = URL.createObjectURL(blob);

    // Create the pose-viewer custom element
    if (currentPoseViewer) {
      currentPoseViewer.remove();
    }
    
    currentPoseViewer = document.createElement('pose-viewer');
    currentPoseViewer.setAttribute('src', currentPoseUrl);
    currentPoseViewer.setAttribute('autoplay', 'true');
    currentPoseViewer.setAttribute('loop', 'true');
    currentPoseViewer.style.width = '100%';
    currentPoseViewer.style.height = '100%';
    currentPoseViewer.style.display = 'block';

    poseContainer.innerHTML = '';
    poseContainer.appendChild(currentPoseViewer);

    // Show it
    outputLoading.classList.add('hidden');
    poseContainer.classList.remove('hidden');
    outputActions.classList.remove('hidden');

  } catch (error) {
    console.error('Translation error:', error);
    showError('Translation failed. Please try again.');
  } finally {
    isTranslating = false;
  }
}

btnRetry.addEventListener('click', triggerTranslation);

// Action buttons
btnDownload.addEventListener('click', () => {
  if (currentPoseUrl) {
    const a = document.createElement('a');
    a.href = currentPoseUrl;
    a.download = `sign-translation-${Date.now()}.pose`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});

btnShare.addEventListener('click', async () => {
  if (currentPoseUrl && navigator.share) {
    try {
      await navigator.share({
        title: 'Sign Language Translation',
        text: `Watch this sign language translation for: "${textInput.value}"`,
        url: window.location.href
      });
    } catch (e) {
      console.log('Error sharing', e);
    }
  } else {
    alert('Sharing is not supported on this browser.');
  }
});

btnFullscreen.addEventListener('click', () => {
  if (poseContainer && poseContainer.requestFullscreen) {
    poseContainer.requestFullscreen();
  } else if (poseContainer && poseContainer.webkitRequestFullscreen) { /* Safari */
    poseContainer.webkitRequestFullscreen();
  } else if (poseContainer && poseContainer.msRequestFullscreen) { /* IE11 */
    poseContainer.msRequestFullscreen();
  }
});

// Initialize
updateCharCount();
resetOutput();

// Define custom elements from pose-viewer
import { defineCustomElements } from 'pose-viewer/loader';
defineCustomElements();
