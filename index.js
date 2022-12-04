////////////////////////////////////////////////////////
class SariraGenerationSound {
    constructor() {
        this.directory = "./sarira_beats.mp3"
        this.hasStarted=false

        //1.delay
        this.feedbackRate = 0 //range = 0 ,1

        //2.tranpose
        this.pitch_left = -6 //range -60 , 60
        this.pitch_right = -6 //range -60 , 60

        this.frequency_left = 0 //range -100, 100 
        this.frequency_right = 0 //range -100, 100 

        //3.convol reverb
        this.roomsize = 0.7 // 추가된 항목. range 0,1
        this.freeverb_wet = 0.5 //range 0,1


        ////////////////////////////////////
        this.sourceNode = new Tone.BufferSource()
        this.splitNode = new Tone.Split();
        this.mergeNode = new Tone.Merge()
        const delayTime = 0.6
        this.feedbackDelayNode = new Tone.FeedbackDelay(delayTime, this.feedbackRate)
        this.frequency_shift_leftNode = new Tone.FrequencyShifter(this.frequency_left)
        this.frequency_shift_rightNode = new Tone.FrequencyShifter(this.frequency_right)
        this.pitchShift_leftNode = new Tone.PitchShift(this.pitch_left)
        // this.pitchShift_leftNode.feedback.value=0
        this.pitchShift_rightNode = new Tone.PitchShift(this.pitch_right)
        // this.pitchShift_rightNode.feedback.value=0
        const damp = 830
        this.freeverbNode = new Tone.Freeverb(this.roomsize, damp)
        this.freeverbNode.wet.value = this.freeverb_wet; //max is 1
    }

    async setup() {
        const LEFT = 0
        const RIGHT = 1
        const MONO = 0

        let buffer = new Tone.Buffer(this.directory,()=> {
            this.sourceNode.buffer = buffer.get();
            this.sourceNode.loop = true;
            this.sourceNode.start()

            this.sourceNode.connect(this.splitNode)
            this.splitNode.connect(this.frequency_shift_leftNode, LEFT, MONO)
            this.splitNode.connect(this.frequency_shift_rightNode, RIGHT, MONO)
            this.frequency_shift_leftNode.connect(this.pitchShift_leftNode)
            this.frequency_shift_rightNode.connect(this.pitchShift_rightNode)

            this.pitchShift_leftNode.connect(this.mergeNode, MONO, LEFT)
            this.pitchShift_rightNode.connect(this.mergeNode, MONO, RIGHT)
            Tone.connectSeries(this.mergeNode, this.feedbackDelayNode, this.freeverbNode, Tone.Destination)
        })
    }

    async start() {
        if(!this.hasStarted){
        await Tone.start()
        this.hasStarted=true
        console.log("tone has started")
        }

    }

    setFeedbackDelay(micorplasticCount) {
        this.feedbackRate = MyMath.map(micorplasticCount, 0, 1000, 0, 1)
        this.feedbackDelayNode.feedback = this.feedbackRate
    }

    setFreeverb(depth) {
        this.freeverb_wet = MyMath.map(depth, 0, 4, 0, 1)
        this.freeverbNode.wet.value = this.freeverb_wet; //max is 1
    }
    setFrequency_PitchShift(height, width) {
        this.pitch_left = MyMath.map(height, 0, 4, 60, -60)
        this.pitch_right = MyMath.map(width, 0, 4, 60, -60)

        this.frequency_left = MyMath.map(height, 0, 4, 100, -100)
        this.frequency_right = MyMath.map(width, 0, 4, 100 - 100)

        this.pitchShift_leftNode.pitch= this.pitch_left
        this.pitchShift_rightNode = this.pitch_right

        this.frequency_shift_leftNode.freqeuncy=this.frequency_left 
        this.frequency_shift_rightNode.freqeuncy=this.frequency_right
    }




}
//using tone.js effects
//https://tonejs.github.io/docs/14.7.77/

//조작법 : 화면에 떠 있는 작은 버튼을 클릭 
///////변수들

//1.delay
// let feedbackRate = 0.8 //range = 0 ,1

// //2.tranpose
// let pitch_left = 0 //range -60 , 60
// let pitch_right = -0 //range -60 , 60

// let frequency_left = 100 //range -100, 100 
// let frequency_right = -100 //range -100, 100 

// //3.convol reverb
// const roomsize=0.3 // 추가된 항목. range 0,1
// let freeverb_wet = 0.5//range 0,1


////////////////////////////////////////////////////////////////////
document.querySelector('button').addEventListener('click', async () => {
    await Tone.start()
    console.log('audio is ready')
})

// const source = new Tone.BufferSource()
// const split = new Tone.Split();
// const merge = new Tone.Merge()

// const delayTime=0.6
// const feedbackDelay = new Tone.FeedbackDelay(delayTime,  feedbackRate)

// const frequency_shift_left = new Tone.FrequencyShifter(frequency_left)
// const frequency_shift_right = new Tone.FrequencyShifter(frequency_right)
// const pitchShift_left = new Tone.PitchShift(pitch_left)
// const pitchShift_right = new Tone.PitchShift(pitch_right)

// const damp=830
// const freeverb = new Tone.Freeverb(0.3, damp)
// freeverb.wet.value = freeverb_wet; //max is 1

// var buffer = new Tone.Buffer("./sarira_beats.mp3", function () {
//     source.buffer = buffer.get();
//     source.loop = true;
//     source.start()

//     Tone.connect(source, split)
//     split.connect(frequency_shift_left, 0, 0)
//     split.connect(frequency_shift_right, 1, 0)
//     frequency_shift_left.connect(pitchShift_left)
//     frequency_shift_right.connect(pitchShift_right)

//     pitchShift_left.connect(merge, 0, 0)
//     pitchShift_right.connect(merge, 0, 1)
//     Tone.connectSeries(merge, feedbackDelay, freeverb, Tone.Destination)
// })


let sg=new SariraGenerationSound();
sg.setup();

