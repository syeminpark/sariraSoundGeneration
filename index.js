//using tone.js effects
//https://tonejs.github.io/docs/14.7.77/


////////////////////////////////////////////////////////
class SariraGenerationSound {
    constructor() {
        this.directory = "./sarira_beats.mp3"
        this.hasStarted = false


///////////////////////////////////////////////////////////////////////////
        //조작법 : 화면에 떠 있는 작은 버튼을 클릭 
        ///////변수들

        //1.Feedback delay    https://tonejs.github.io/docs/14.7.77/FeedbackDelay
        this.feedbackRate = 0 //range = 0 ,1

        //2.PitchShfit  https://tonejs.github.io/docs/14.7.77/PitchShift
        this.pitch_left = -6 //range -60 , 60
        this.pitch_right = -6 //range -60 , 60

        //FrequencyShifter  https://tonejs.github.io/docs/14.7.77/FrequencyShifter
        this.frequency_left = 0 //range -100, 100 
        this.frequency_right = 0 //range -100, 100 

        //3.Freeverb    https://tonejs.github.io/docs/14.7.77/Freeverb
        this.roomsize = 0.7 // 추가된 항목. range 0,1
        this.freeverb_wet = 0.5 //range 0,1
///////////////////////////////////////////////////////////////////////////


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

        let buffer = new Tone.Buffer(this.directory, () => {
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
        if (!this.hasStarted) {
            await Tone.start()
            this.hasStarted = true
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

        this.pitchShift_leftNode.pitch = this.pitch_left
        this.pitchShift_rightNode = this.pitch_right

        this.frequency_shift_leftNode.freqeuncy = this.frequency_left
        this.frequency_shift_rightNode.freqeuncy = this.frequency_right
    }
}

document.querySelector('button').addEventListener('click', async () => {
    await Tone.start()
    console.log('audio is ready')
})

let sg = new SariraGenerationSound();
sg.setup();