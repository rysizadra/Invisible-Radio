let a, b, c, d; // hh=a clap=b bass=c 
let aPat, bPat, cPat, dPat; //INSTRUMENT PATTERN. it will be an array of numbers that we can manipulate to make beats
let aPhrase, bPhrase, cPhrase, dPhrase; //INSTRUMENT PHRASE. which defines how the instrument pattern is interpreted. 
let drums; //PART. we will attach the phrase to the part, which will serve as our transport to drive the phrase
let bpmCTRL;
let beatLength;
let cellWidth;
let cnv, playPause;
let sPat;
let cursorPos;
let rateCTRL;
let arate = 1;
let brate = 1;
let crate = 1;
let drate = 1;
let bpmval;
let arateCTRL, brateCTRL, crateCTRL, drateCTRL;
let span_bpm;


function setup() {
  getAudioContext().suspend();
  cnv = createCanvas(640, 160);
  cnv.mousePressed(canvasPressed);



  beatLength = 16;
  cellWidth = width / beatLength;
  cursorPos = 0;

  a = loadSound('assets/a.wav', () => {});
  b = loadSound('assets/b.wav', () => {});
  c = loadSound('assets/c.wav', () => {});
  d = loadSound('assets/d.wav', () => {});


  aPat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  bPat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  cPat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  dPat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  sPat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  aPhrase = new p5.Phrase('a', (time) => {
    a.play(time, arate, undefined, Math.random()*(a.duration()-arate/(bpmval/60)), arate/(bpmval/60)/2);
  }, aPat);
  bPhrase = new p5.Phrase('b', (time) => {
    b.play(time,brate,undefined,Math.random()*(b.duration()-brate/(bpmval/60)), brate/(bpmval/60)/2);
  }, bPat);
  cPhrase = new p5.Phrase('c', (time) => {
    c.play(time, crate,undefined,Math.random()*(c.duration()-crate/(bpmval/60)), crate/(bpmval/60)/2);
  }, cPat);
  dPhrase = new p5.Phrase('d', (time) => {
    d.play(time, drate, undefined, Math.random()*(d.duration()-drate/(bpmval/60)), drate/(bpmval/60)/2);
  }, dPat);
//The above eqations allow for samples to stay the same length despite the tempo and pitch changes.

  playPause = createButton("play")
    .position(270, 180)
    .mouseClicked(() => {
      userStartAudio();
    if (a.isLoaded() && b.isLoaded() && c.isLoaded() && d.isLoaded()) {
      if (!drums.isPlaying) {
        // drums.metro.metroTicks = 0;
        drums.loop();
        playPause.html("pause")
      } else {
        drums.pause();
        playPause.html("play")
      }
    } else {
      console.log('oops, be patient as the drums load...');
    }
  }) 

  drums = new p5.Part();

  drums.addPhrase(aPhrase);
  drums.addPhrase(bPhrase);
  drums.addPhrase(cPhrase);
  drums.addPhrase(dPhrase);
  drums.addPhrase('seq', sequence, sPat);

  arateCTRL = createSlider(0.25, 2, 1, 0);
  arateCTRL.position(10, 180);
  arateCTRL.input(() => {
    arate=(arateCTRL.value())
  });
  createSpan('Channel A').position(150, 180);

  brateCTRL = createSlider(0.25, 2, 1, 0);
  brateCTRL.position(10, 200);
  brateCTRL.input(() => {
    brate=(brateCTRL.value())
  });
  createSpan('Channel B').position(150, 200);

  crateCTRL = createSlider(0.25, 2, 1, 0);
  crateCTRL.position(10, 220);
  crateCTRL.input(() => {
    crate=(crateCTRL.value())
  });
  createSpan('Channel C').position(150, 220);
  
  drateCTRL = createSlider(0.25, 2, 1, 0);
  drateCTRL.position(10, 240);
  drateCTRL.input(() => {
    drate=(drateCTRL.value())
  });
  createSpan('Channel D').position(150, 240);
  
  span_bpm = createSpan('BPM');
  span_bpm.position(480, 180);

  bpmCTRL = createSlider(30, 600, 60, 1);
  bpmCTRL.position(515, 180);
  bpmCTRL.input(() => {
    drums.setBPM(bpmval = bpmCTRL.value())
    span_bpm.html(bpmval);
    
  });
  drums.setBPM('60');
  bpmval = 60;

 	drawMatrix();
}


function keyPressed() {
  if (key === " ") {
    if (a.isLoaded() && b.isLoaded() && c.isLoaded() && d.isLoaded()) {
      if (!drums.isPlaying) {
        // drums.metro.metroTicks = 0;
        drums.loop();
        playPause.html("pause")
      } else {
        drums.pause();
        playPause.html("play")
      }
    } else {
      console.log('oops, be patient as the drums load...');
    }
  }
}



function canvasPressed() {
  let rowClicked = floor(4 * mouseY / height);
  let indexClicked = floor(16*mouseX/width);
  if (rowClicked === 0) {
    console.log('first row ' + indexClicked);
    aPat[indexClicked] = +!aPat[indexClicked];
  } else if (rowClicked === 1) {
    console.log('second row');
    bPat[indexClicked] = +!bPat[indexClicked];
  } else if (rowClicked === 2) {
    console.log('third row');
    cPat[indexClicked] = +!cPat[indexClicked];
  } else if (rowClicked === 3) {
    console.log('fourth row');
    dPat[indexClicked] = +!dPat[indexClicked];
  }

  drawMatrix();
}



const drawMatrix = () => {
  background(80);
  stroke('gray');
  strokeWeight(2);
  fill('white');

  let rows = [aPat, bPat, cPat, dPat];

  for (let i = 0; i < beatLength + 1; i++) {
    //startx, starty, endx, endy
    line(i * cellWidth, 0, i * cellWidth, height);
  }
  for (let i = 0; i < 4; i++) {
    line(0, i * height / 4, width, i * height / 4);
  }
  noStroke();
  for (let i = 0; i < beatLength; i++) {
    for(let j=0;j<rows.length;j++) {
      if (rows[j][i] === 1) {
        ellipse(i * cellWidth + 0.5 * cellWidth, ((j/rows.length)* height) + (height/rows.length/2), 10);
      }
    }
  }
}

const sequence = (time, beatIndex) => {
	// console.log(beatIndex);
  setTimeout(() => {
  	drawMatrix();
  	drawPlayhead(beatIndex);
  }, time*1000);
}

const drawPlayhead = (beatIndex) => {
	stroke('red');
  fill(255, 0, 0, 30);
  rect((beatIndex-1)*cellWidth, 0, cellWidth, height);

}

const touchStarted = () => {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

