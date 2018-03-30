import OStats from './ostats';

const stats = new OStats();

stats.start(); // initiate CPU and Memory monitoring
// stats.start(true); // > when true is parsed will print cpu and memory usage in every ticks

/**
 * Get CPU usage in the last 1 min or 60 seconds
 * 
 * */
// stats.getCpuLast(60);

// Get Memory usage in the last 1 min or 60 seconds
stats.getMemLast(6);

// oStats.starMonitor(1000, 'verbose'); 