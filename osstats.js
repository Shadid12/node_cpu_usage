import os from 'os';

export default class OsStats {
    constructor() {
    }
    /**
     * Function to get Avg CPU 
     */
    getCpuAvg() {
        const cpus = os.cpus();
        
        let totalIdle   = 0;
        let totalTicks  = 0;

        /**
         * For each CPUs we will loop though 
         * and calculate the ticks and add them 
         * together as totalTicks
         * 
         * and add up all total idel times as totalIdel
         */

         for (let i = 0; i < cpus.length; i++) {
             let currentCPU = cpus[i];
             
            for (let t in currentCPU.times) {
                totalTicks += currentCPU.times[t];
            }

            totalIdle += currentCPU.times.idle;
        }

        return { 
            idle: totalIdle / cpus.length, 
            total: totalTicks / cpus.length 
        }
    }

    cpuLoad( avgTime, msg ) {

        this.samples = [];
        this.samples[1] = this.getCpuAvg();

        setInterval((cb) => {

            this.samples[0] = this.samples[1];
            this.samples[1] = this.getCpuAvg();

            let totalDiff = this.samples[1].total - this.samples[0].total;
            let idleDiff = this.samples[1].idle - this.samples[0].idle;

            let ret = 1 - (idleDiff / totalDiff);

            console.log(msg, ret * 100);

        }, avgTime);
    }

    // cpuLoad( avgTime ) {
    //     return new Promise((resolve, reject) => { 
    //         this.samples = [];
    //         this.samples[1] = this.getCpuAvg();
    //         setTimeout( () => {
    //             this.samples[0] = this.samples[1];
    //             this.samples[1] = this.getCpuAvg();

    //             let totalDiff = this.samples[1].total - this.samples[0].total;
    //             let idleDiff = this.samples[1].idle - this.samples[0].idle;
                
    //             let ret = 1 - (idleDiff / totalDiff);

    //             if (ret) {
    //                 console.log('From Google', os.loadavg());
    //                 resolve(ret);
    //             } else {
    //                 reject('Error');
    //             }

    //         }, avgTime)
    //     });
    // }
}