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

    /**
     * @argument time
     * @return Promise 
     * wrapper function to get CPU average after certain time 
     * 
     */
    getEndCpuUsage(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('First promise loading');
                let end = this.getCpuAvg(); // get end measure
                if (end) {
                    resolve(end);
                } else {
                    reject(Error("Could not calculate data"));
                }
            }, time)
        })
    }

    getCpuUsage() {
        let start =  this.getCpuAvg(); // get first measure
        this.getEndCpuUsage(100)
            .then((end) => {
                console.log("Promise returned");
                let idleDiff = end.idle - start.idle;
                let totalDiff = end.total - start.total;

                let percentCpuUsage = 100 - ~~(100 * idleDiff / totalDiff);
                console.log('CPU USAGE %', percentCpuUsage);
                return {
                    percentCpuUsage : percentCpuUsage
                };
            }).catch(() => {
                return {
                    error: 'could not calculate'
                }
            });
    }
}