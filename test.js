console.log("hello world2")


const context = new AudioContext();
const tuna = new Tuna(context);
const source = context.createBufferSource();
const gain_left = context.createGain();
const gain_right = context.createGain();
const splitter = context.createChannelSplitter(2);
const merger = context.createChannelMerger(2);
const delay_left = delayEffect()
const delay_right = delayEffect()
const convol_left = convolReverb()
const convol_right = convolReverb()


let micorplasticCount = 3


getFile()
async function getFile() {
    try {
        let response = await fetch("./sarira_beats.mp3")
        let arrayBuffer = await response.arrayBuffer()

        source.buffer = await context.decodeAudioData(arrayBuffer)

        console.log(await context.decodeAudioData(arrayBuffer) )

        const buffer = new Tone.ToneAudioBuffer("./sarira_beats.mp3", () => {
            console.log(buffer)
        });
        source.loop = true

        source.connect(splitter)
        splitter.connect(delay_left, 0, 0)
        splitter.connect(delay_right, 1, 0)


        delay_left.connect(convol_left)
        delay_right.connect(convol_right)

        convol_left.connect(gain_left)
        convol_right.connect(gain_right)


        gain_left.connect(merger, 0, 0);
        gain_right.connect(merger, 0, 1);

        merger.connect(context.destination);


    } catch (error) {
        console.error(error);
    }

    var chorus = new tuna.Chorus({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: 0
    })
}
document.querySelector('button').addEventListener('click', () => {
    source.start(0)

})

function delayEffect() {
    let delay = new tuna.Delay({
        feedback: 0.3, //0.6을 넘으면 소리가 미치는 것 같은데? 
        delayTime: 600,
        wetLevel: 1,
        dryLevel: 1,
        cutoff: 2000,
        bypass: false
    })
    return delay
    //미세플라스틱 개수 3-100 map range
    //feedback (0-100)adf
}
// function delayEffect(context) {
//     const delay = context.createDelay()
//     delay.delayTime.value = 0.6;
//     const feedback = context.createGain();
//     feedback.gain.value=0.6

//     delay.connect(feedback)
//     feedback.connect(delay)

//     return delay
//     //미세플라스틱 개수 3-100 map range
//     //feedback (0-100)adf
// }

function transposeEffectSetup() {

}

function convolReverb() {
    let convolver = new tuna.Convolver({
        highCut: 2001, //20 to 22050
        lowCut: 421, //20 to 22050
        dryLevel: 0, //0 to 1+
        wetLevel: 0.5, //0 to 1+
        level: 1, //0 to 1+, adjusts total output of both wet and dry
        bypass: false
    })
    return convolver
}



// class GenerativeSound {
//     constructor(context) {
//         this.context = context
//         this.directory = "./sarira_beats.mp3"
//         this.tuna = new Tuna(this.context);
//         this.source = context.createBufferSource();
//         this.gain_left = context.createGain();
//         this.gain_right = context.createGain();
//         this.splitter = context.createChannelSplitter(2);
//         this.merger = context.createChannelMerger(2);
//     }

//     async getFile() {
//         try {
//             let response = await fetch(this.directory)
//             let arrayBuffer = await response.arrayBuffer()

//             this.source.buffer = await this.context.decodeAudioData(arrayBuffer)
//             this.source.loop = true

//             // source.connect(splitter)
//             // splitter.connect(gain_left, 0, 0)
//             // splitter.connect(gain_right, 1, 0)

//             // gain_left.connect(merger, 0, 0);
//             // gain_right.connect(merger, 0, 1);

//         } catch (error) {
//             console.error(error);
//         }
//     }

//     delayEffectSetup() {
//         const delay = this.context.createDelay()
//         delay.delayTime.value = 0.6;
//         const feedback = context.createGain();

//         delay.connect(feedback)
//         feedback.connect(delay)

//         return {
//             delay,
//             feedback
//         }
//         //미세플라스틱 개수 3-100 map range
//         //feedback (0-100)adf
//     }


//     transposeEffectSetup() {

//     }

//     convolReverbEffectSetup() {
//         var chorus = new tuna.Gain({
//             rate: 1.5,
//             feedback: 0.2,
//             delay: 0.0045,
//             bypass: 0
//         });
//     }

// }