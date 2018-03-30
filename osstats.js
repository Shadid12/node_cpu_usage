import os from 'os';
import _ from 'lodash';

export default class OsStats {
    constructor() {
        this.arrayOfData = [];
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

    startMonitor( verbose ) {
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
            // if verbose enabled start outputting current CPU and Memory logs
            if (verbose == true) {
                console.log(o);
            }

        }, 1000);
    }

    /**
     * @argument {int} n seconds 
     * @returns  float
     * This method returns memory usage in the previous {n} mins
     */
    getMemoryUsage(n) {
        this.setTimer(n).then((e) => {
            if(e) {
                let temp = this.arrayOfData;
                temp = _.reverse(temp);
                let retArray = _.slice(temp, 0, n);
                let totalMemoryUsed = 0;
                for (let i = 0; i < retArray.length; i ++){
                    totalMemoryUsed = totalMemoryUsed + retArray[i].memory; 
                }
                console.log(totalMemoryUsed / retArray.length);
            }
        }).catch(() => {
            console.log('Something wrong with the array operations');
        });
    }

    /**
     * Wrapper function to set time constrain
     * @param {int} n  
     */
    setTimer(n) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, (n * 1000) + 2000 );
        })
    }

    /**
     * 
     * @param {int} n seconds
     * @returns float
     * This function returns the percentage of avg cpu used in a given period
     */
    getCpuUsage(n) {
        return new Promise((resolve, reject) => {

            this.setTimer(n).then((e) => {
                if(e) {
                    let temp = _.reverse(this.arrayOfData);
                    temp = _.slice(temp, 0, n);
                    let totalCpuUsed = 0;
                    for (let i = 0; i < temp.length; i ++){
                        totalCpuUsed = totalCpuUsed + temp[i].cpu; 
                    }
                    console.log(totalCpuUsed / temp.length);
                    resolve(true);
                }
                else {
                    reject('Cannot fetch');
                }
            }).catch(()=> {
                console.log('Error');
            });

        })
    }
}