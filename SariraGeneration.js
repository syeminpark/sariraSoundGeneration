class SariraGeneration {
    constructor() {
        this.directory = "./sarira_beats.mp3"

        //1.delay
        this.feedbackRate = 0.8 //range = 0 ,1

        //2.tranpose
        this.pitch_left = 0 //range -60 , 60
        this.pitch_right = -0 //range -60 , 60

        this.frequency_left = 100 //range -100, 100 
        this.frequency_right = -100 //range -100, 100 

        //3.convol reverb
        this.roomsize = 0.3 // 추가된 항목. range 0,1
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
        this.pitchShift_rightNode = new Tone.PitchShift(this.pitch_right)

        const damp = 830
        this.freeverbNode = new Tone.Freeverb(0.3, damp)
        this.freeverbNode.wet.value = this.freeverb_wet; //max is 1
    }

    async setup() {
        const LEFT= 0
        const RIGHT =1
        const MONO=0
        
        let buffer = new Tone.Buffer(this.directory, function () {
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
        await Tone.start()
    }

    setFeedbackRate(micorplasticCount){
        
    }



}