
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
                        this.spectrum = this.fft.analyze(fftbands);
                        for (var i = 0; i < fftbands; i++) {
                                var x = map(i, 0, fftbands, 0, width);
                                var h = -height / 2 + map(this.spectrum[i], 0, 255, height / 2, 0);
                                noStroke();
                                fill(map(i, 0, fftbands, 0, 360), 100, 100, 30);
                                rect(x, height, width / fftbands, h);
                        }
                } else {
                        return;
                }
        }
}
