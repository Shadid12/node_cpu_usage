import OStats from './ostats';

const stats = new OStats();

stats.start(); // initiate CPU and Memory monitoring
// stats.start(true); // > when true is parsed will print cpu and memory usage in every ticks

/**
 * Get CPU usage in the last 1 min or 60 seconds
 * 
 * */
// stats.getCpuLast(60);

// Get Memory usage in the last 5 seconds
stats.getMemLast(5);

// Get Memory usage in the last 1 min or 60 seconds
stats.getMemLast(60);

// Get Memory usage in the last 5 min or 300 seconds
stats.getMemLast(300);

// Get Memory usage in the last 15 min or 900 seconds
stats.getMemLast(900);

// Get CPU usage in the last 10 seconds
stats.getCpuLast(10);

// Get CPU usage in the last 30 seconds
stats.getCpuLast(30);

// Get CPU usage in the last 10 min or 600 seconds
stats.getCpuLast(600);