import OsStats from './osstats';

const oStats = new OsStats();

oStats.cpuLoad(1000, "Current:");

oStats.cpuLoad(10000, "10s --- interval ---> ");
