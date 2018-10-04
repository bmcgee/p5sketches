
function FftVis() {
        let octaveBands, barsNumber;

        this.setup = function(obj) {
                this.fft = new p5.FFT(fftsmooth);
                this.fft.setInput(obj);

        }

        this.draw = function() {
                if (logView) {
                        this.spectrum = this.fft.analyze();
                        this.octaveBands = this.fft.getOctaveBands(oct_bands, oct_center);
                        this.barsNumber = this.octaveBands.length;
                        let groupedFreq = this.fft.logAverages(this.octaveBands);
                        noStroke();
                        //fill(100);
                        for (var i = 0; i < this.barsNumber; i++) {
                                colorMode(HSB);
                                fill(map(i, 0, this.barsNumber, 0, 360), 100, 100, 30);
                                var h = -height / 2 + map(groupedFreq[i], 0, 255, height / 2, 0);
                                var x = ((i + 1) * width / this.barsNumber) - width / this.barsNumber;
                                rect(i * (width / this.barsNumber), height, (width / this.barsNumber), h);
                        }
                } else if (spectView) {
                        this.spectrum = this.fft.analyze(fftbands, analyzeType);
                        for (var i = 0; i < fftbands; i++) {
                                let x = map(i, 0, fftbands, 0, width);
                                //console.log(this.spectrum[i]);
                                let spectMap;
                                if (analyzeType == 'db') {
                                        spectMap = map(this.spectrum[i], -100, -30,  height / 2, 0);
                                }
                                else {
                                        spectMap = map(this.spectrum[i], 0, 255,  height / 2, 0);
                                }

                                let h = -height / 2 + spectMap;
                                noStroke();
                                fill(map(i, 0, fftbands, 0, 360), 255, 255, 200);
                                rect(x, height, width / fftbands, h);
                        }
                } else {
                        return;
                }
        }
}
