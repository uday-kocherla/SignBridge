import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import fp from 'fingerpose';

// --- GESTURE DEFINITIONS ---
// --- GESTURE DEFINITIONS ---
// A-Z ASL Alphabet Definitions using Fingerpose
const { Finger, FingerCurl, FingerDirection, GestureDescription } = fp;

const signs = {};

// A
signs.A = new GestureDescription('A');
signs.A.addCurl(Finger.Thumb, FingerCurl.NoCurl);
signs.A.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
signs.A.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9);
signs.A.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9);
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.A.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// B
signs.B = new GestureDescription('B');
signs.B.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
signs.B.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.9);
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.B.addCurl(finger, FingerCurl.NoCurl, 1.0);
    signs.B.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}

// C
signs.C = new GestureDescription('C');
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.C.addCurl(finger, FingerCurl.HalfCurl, 1.0);
}

// D
signs.D = new GestureDescription('D');
signs.D.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.D.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
for(let finger of [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.D.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    signs.D.addCurl(finger, FingerCurl.FullCurl, 0.9);
}

// E
signs.E = new GestureDescription('E');
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.E.addCurl(finger, FingerCurl.FullCurl, 1.0);
    signs.E.addCurl(finger, FingerCurl.HalfCurl, 0.9); // Thumb might be half curled
}

// F
signs.F = new GestureDescription('F');
signs.F.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
signs.F.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.F.addCurl(finger, FingerCurl.NoCurl, 1.0);
    signs.F.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}

// G
signs.G = new GestureDescription('G');
signs.G.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.G.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
signs.G.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
signs.G.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.G.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// H
signs.H = new GestureDescription('H');
signs.H.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.H.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
signs.H.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
signs.H.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
signs.H.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1.0);
signs.H.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1.0);
for(let finger of [Finger.Thumb, Finger.Ring, Finger.Pinky]) {
    signs.H.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// I
signs.I = new GestureDescription('I');
signs.I.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
signs.I.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring]) {
    signs.I.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// K
signs.K = new GestureDescription('K');
signs.K.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.K.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
signs.K.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
signs.K.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);
signs.K.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);
signs.K.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
for(let finger of [Finger.Ring, Finger.Pinky]) {
    signs.K.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// L
signs.L = new GestureDescription('L');
signs.L.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.L.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
signs.L.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
signs.L.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
signs.L.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.L.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// O
signs.O = new GestureDescription('O');
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.O.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    signs.O.addDirection(finger, FingerDirection.DiagonalUpRight, 1.0);
    signs.O.addDirection(finger, FingerDirection.DiagonalUpLeft, 1.0);
}

// S
signs.S = new GestureDescription('S');
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.S.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// U
signs.U = new GestureDescription('U');
signs.U.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.U.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
signs.U.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
signs.U.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
for(let finger of [Finger.Thumb, Finger.Ring, Finger.Pinky]) {
    signs.U.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// V
signs.V = new GestureDescription('V');
signs.V.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.V.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
signs.V.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);
signs.V.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
signs.V.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);
signs.V.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);
for(let finger of [Finger.Thumb, Finger.Ring, Finger.Pinky]) {
    signs.V.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// W
signs.W = new GestureDescription('W');
signs.W.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
signs.W.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
signs.W.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
for(let finger of [Finger.Thumb, Finger.Pinky]) {
    signs.W.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// X
signs.X = new GestureDescription('X');
signs.X.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
for(let finger of [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    signs.X.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// Y
signs.Y = new GestureDescription('Y');
signs.Y.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
signs.Y.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);
signs.Y.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
signs.Y.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
signs.Y.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1.0);
signs.Y.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
    signs.Y.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

const gestures = Object.values(signs);
const gestureEstimator = new fp.GestureEstimator(gestures);

// --- PIPELINE LOGIC ---
export class VisionPipeline {
  constructor() {
    this.video = document.getElementById('webcam-video');
    this.canvas = document.getElementById('webcam-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.overlay = document.getElementById('camera-overlay');
    this.charOutput = document.getElementById('detected-char');
    this.messageOutput = document.getElementById('detected-message');
    
    this.model = null;
    this.isTracking = false;
    this.stream = null;
    this.lastDetectedChar = '';
    this.charHistory = [];
    this.message = '';
  }

  async initialize() {
    this.overlay.querySelector('p').textContent = 'Loading AI Backend...';
    try {
      console.log("Waiting for TF.js to be ready...");
      await tf.ready();
      
      console.log("TF.js ready. Loading Handpose model...");
      this.overlay.querySelector('p').textContent = 'Loading Handpose Model (this takes a moment)...';
      
      this.model = await handpose.load();
      console.log("Handpose model loaded successfully.");
      
      this.overlay.querySelector('p').textContent = 'Model loaded. Click to enable camera.';
      return true;
    } catch (e) {
      console.error("Failed to load model:", e);
      this.overlay.querySelector('p').textContent = `Failed to load model: ${e.message}`;
      return false;
    }
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      this.video.srcObject = this.stream;
      
      return new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;
          this.overlay.classList.add('hidden');
          resolve(true);
        };
      });
    } catch (e) {
      console.error("Camera access denied:", e);
      if (e.name === 'NotReadableError') {
        this.overlay.querySelector('p').textContent = 'Camera is already in use by another app (like Zoom). Please close it and try again.';
      } else {
        this.overlay.querySelector('p').textContent = `Camera error: ${e.message}`;
      }
      return false;
    }
  }

  stopCamera() {
    this.isTracking = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.overlay.classList.remove('hidden');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async track() {
    if (!this.isTracking || !this.model) return;

    if (this.video.readyState === 4) {
      // Get hand landmarks
      const predictions = await this.model.estimateHands(this.video);
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      if (predictions.length > 0) {
        // Draw hand skeleton
        this.drawHand(predictions[0].landmarks);
        
        // Estimate gesture
        const estimated = gestureEstimator.estimate(predictions[0].landmarks, 8.0);
        
        if (estimated.gestures.length > 0) {
          // Find gesture with highest confidence
          const best = estimated.gestures.reduce((p, c) => {
            return (p.score > c.score) ? p : c;
          });
          
          this.updateDetection(best.name);
        } else {
          this.updateDetection('-');
        }
      } else {
        this.updateDetection('-');
      }
    }
    
    // Loop
    requestAnimationFrame(() => this.track());
  }

  updateDetection(char) {
    if (char === '-') {
        this.charOutput.textContent = '-';
        return;
    }
    
    this.charOutput.textContent = char;
    
    // Smoothing: Only add to message if we see it consistently
    this.charHistory.push(char);
    if (this.charHistory.length > 20) {
      this.charHistory.shift();
    }
    
    // Check if the last 15 frames are the same char, and it's different from the last recorded one
    const count = this.charHistory.filter(c => c === char).length;
    if (count > 15 && this.lastDetectedChar !== char) {
      this.lastDetectedChar = char;
      if (this.message === 'Waiting for signs...') {
          this.message = '';
      }
      this.message += char;
      this.messageOutput.textContent = this.message;
    }
  }
  
  clearMessage() {
      this.message = '';
      this.messageOutput.textContent = 'Waiting for signs...';
      this.lastDetectedChar = '';
      this.charHistory = [];
  }

  drawHand(landmarks) {
    // Finger joints connections
    const fingerJoints = {
      thumb: [0, 1, 2, 3, 4],
      index: [0, 5, 6, 7, 8],
      middle: [0, 9, 10, 11, 12],
      ring: [0, 13, 14, 15, 16],
      pinky: [0, 17, 18, 19, 20]
    };

    // Draw lines
    this.ctx.strokeStyle = '#0ea5e9'; // secondary-accent
    this.ctx.lineWidth = 4;
    
    for (let finger in fingerJoints) {
      const joints = fingerJoints[finger];
      this.ctx.beginPath();
      this.ctx.moveTo(landmarks[joints[0]][0], landmarks[joints[0]][1]);
      for (let i = 1; i < joints.length; i++) {
        this.ctx.lineTo(landmarks[joints[i]][0], landmarks[joints[i]][1]);
      }
      this.ctx.stroke();
    }

    // Draw points
    this.ctx.fillStyle = '#6366f1'; // primary-accent
    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, 3 * Math.PI);
      this.ctx.fill();
    }
  }
}
