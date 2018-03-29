import os from 'os';

export default class OsStats {
    constructor() {
        this.arrayOfData = [];
        const ONE_MINUTE = 60;
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

    starMonitor( avgTime, msg,  ) {
        this.samples = [];
        this.samples[1] = this.getCpuAvg();
        
        setInterval(() => {

            this.samples[0] = this.samples[1];
            this.samples[1] = this.getCpuAvg();

            let totalDiff = this.samples[1].total - this.samples[0].total;
            let idleDiff = this.samples[1].idle - this.samples[0].idle;

            let cpu_perc = ( 1 - (idleDiff / totalDiff) ) * 100;
            let memory   = ( 1 - ( os.freemem() / os.totalmem() )) * 100;

            let o = {memory: memory, cpu: cpu_perc }
            if ( this.arrayOfData.length == 10) {
                this.arrayOfData.shift();
            }
            this.arrayOfData.push(o);
            // if verbose on start outputting current CPU and Memory logs
            if (msg === 'v' || msg === 'verbose') {
                console.log(o);
            }

        }, avgTime);
    }

    /**
     * @argument n
     * @returns  number
     * This method returns memory usage in the previous {n} mins
     */
    getMemoryUsage(n) {
        
    }
}