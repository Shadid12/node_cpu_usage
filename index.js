import OsStats from './osstats';

const oStats = new OsStats();



oStats.starMonitor(); 
// oStats.starMonitor(true);

// Get memory usage in 5 seconds
oStats.getMemoryUsage(5);

// oStats.starMonitor(1000, 'verbose'); 