import os from 'os';
import _ from 'lodash';

export default class OStats {
    constructor(){
        this.arrayOfData = [];
    }

    /**
     * This function initiates monotoring of CPU and Memory usage
     * @param {boolean} verbose 
     */
    start(verbose){

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
            if ( this.arrayOfData.length == 900) { // 900 seconds == 15 mins. We record every seconds to maximum 900 seconds
                this.arrayOfData.shift();          // When max length is hit we delete the oldest element in array and track latest from there
            }
            this.arrayOfData.push(o);
            if (verbose) {
                console.log(o);
            }
        }, 1000);

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
     * Gets Cpu usage of the past n minutes
     * @param {int} n 
     * @returns Promise
     */
    getCpuUsage(n) {
        return new Promise((resolve, reject) => {
            
            let temp = _.reverse(this.arrayOfData);
            // console.log(temp);
            temp = _.slice(temp, 0, n);
            let totalCpuUsed = 0;
            for (let i = 0; i < temp.length; i ++){
                totalCpuUsed = totalCpuUsed + temp[i].cpu; 
            }
            let cpu_perc = totalCpuUsed / temp.length
            resolve(cpu_perc);
        })
    }

    /**
     * Gets Memory usage in the past n minutes
     * @param {int} n
     * @returns Promise 
     */
    getMemUsage(n) {
        return new Promise((resolve, reject) => {
            
            let temp = _.reverse(this.arrayOfData);
            // console.log(temp);
            temp = _.slice(temp, 0, n);
            let totalMemUsed = 0;
            for (let i = 0; i < temp.length; i ++){
                totalMemUsed = totalMemUsed + temp[i].memory; 
            }
            let mem_perc = totalMemUsed / temp.length;
            if (mem_perc){
                resolve(mem_perc);
            } else {
                reject('Error has occured');
            }
        })
    }

    /**
     * Runs every n minutes and prints memory usage of past n minutes from current time
     * @param {int} n 
     */
    getMemLast(n) {
        setInterval(() => {
            this.getMemUsage(n).
                then( (ret) => {
                    console.log(`In last ${n} seconds memory usage was: ${ret} %`);
                });
        }, n * 1000)
    }

    /**
     * Runs every n minutes and prints CPU usage of past n minutes from current time
     * @param {int} n 
     */
    getCpuLast(n) {
        setInterval(() => {
            this.getCpuUsage(n).
                then( (ret) => {
                    console.log(`In last ${n} seconds cpu usage was: ${ret} %`);
                });
        }, n * 1000)
    }


}