/**
 * Created by mprimros on 12/21/16.
 */
const SPAWN_MEMORY_PROPERTIES = {
    Initialized: 'initialized',
    MinHarvester: 'minHarvester',
    MinEnergyMiner: 'minEnergyMiner',
    MinEnergyHauler: 'minEnergyHauler',
    MinUpgrader: 'minUpgrader',
    MinBuilder: 'minBuilder',
    MinJanitor: 'minJanitor',
    MinWallBuilder: 'minWallBuilder',
    MinLongDistanceHarvester: 'minLongDistanceHarvester',
    MinMineralMiner: 'minMineralMiner',
    MinMineralHauler: 'minMineralHauler',
    MinDefender: 'minDefender',
    MinHealer: 'minHealer',
    MinArcher: 'minArcher',
    MinSoldier: 'minSoldier'
};


module.exports={
    //Checks to make sure that Spawn Memory has all of the required properties
    initialize: function(spawn){
        //Initialize the memory space for each spawn
        for (let prop in SPAWN_MEMORY_PROPERTIES) {
            if (spawn.memory[SPAWN_MEMORY_PROPERTIES[prop]] == undefined){
                if (SPAWN_MEMORY_PROPERTIES[prop] == 'initialized'){
                    spawn.memory[SPAWN_MEMORY_PROPERTIES[prop]] = true;
                }
                else {
                    spawn.memory[SPAWN_MEMORY_PROPERTIES[prop]] = 0;
                }
            }
        }
    },
    //Checks current energy and defense situation and adjust the minimum required creeps
    adjustCreepsForSpawn: function(spawn){

    },
    //Checks if any creeps are missing and spawns replacements if needed
    spawnNewCreeps: function(spawn) {
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.home == spawn.room.name
        });
        let sources = spawn.room.find(FIND_SOURCES);

        let numberOfHarvesters = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Harvester);
        let numberOfUpgraders = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Upgrader);
        let numberOfBuilders = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Builder);
        let numberOfWallBuilders = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Wall_Builder);
        let numberOfJanitors = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Janitor);
        let numberOfEnergyMiners = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Energy_Miner);
        let numberOfEnergyHaulers = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Energy_Hauler);
        let numberOfLongDistanceHarvesters = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Long_Distance_Harvester);
        let numberOfMineralMiners = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Mineral_Miner);
        let numberOfMineralHaulers = _.sum(creepsInRoom, c => c.memory.role == Creep.Role.Mineral_Hauler);

        let name = undefined;
        let energy = spawn.room.energyCapacityAvailable;

        if (name == undefined){
            if (numberOfEnergyHaulers < spawn.memory.minEnergyHauler){
                name = spawn.createHauler(spawn.room.name, false, Creep.Role.Energy_Hauler);
            }
            if (numberOfEnergyMiners < spawn.memory.minEnergyMiner){
                for (let source of sources){
                    if (!_.some(creepsInRoom, c => c.memory.role == Creep.Role.Energy_Miner && c.memory.target == source.id)){
                        let containers = source.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                            filter: s => s.structureType == STRUCTURE_CONTAINER
                        });
                        if (containers.length > 0){
                            name = spawn.createMiner(spawn.room.name, source.id, Creep.Role.Energy_Miner);
                            break;
                        }
                    }
                }
            }
            if (numberOfHarvesters < spawn.memory.minHarvester){
                name = spawn.createHarvester(300, spawn.room.name, false);
            }
            else if (numberOfUpgraders < spawn.memory.minUpgrader){
                name = spawn.createUpgrader(energy, spawn.room.name, spawn.room.controller);
            }
            else if (numberOfBuilders < spawn.memory.minBuilder){
                if (energy < 400) {
                    name = spawn.createBuilder(200, spawn.room.name, false);
                }
                else {
                    name = spawn.createBuilder(Math.floor(energy / 3), spawn.room.name, false);
                }
            }
            else if (numberOfJanitors < spawn.memory.minJanitor){
                if (energy < 400){
                    name = spawn.createJanitor(Math.floor(energy / 3), spawn.room.name, false);
                }
                else {
                    name = spawn.createJanitor(200, spawn.room.name, false);
                }
            }
            else if (numberOfWallBuilders < spawn.memory.minWallBuilder){
                if (energy > 600) {
                    name = spawn.createWallBuilder(Math.floor(energy / 3), spawn.room.name, false);
                }
            }
            else if (numberOfLongDistanceHarvesters < spawn.memory.minLongDistanceHarvester){
                if (energy > 1000 && spawn.memory.longDistanceHarvestigRoom != undefined){
                    name = spawn.createLongDistanceHarvester(energy, 5, spawn.room.name, spawn.memory.longDistanceHarvestingRoom);
                }
            }
            else if (numberOfMineralHaulers < spawn.memory.minMineralHauler){
                name = spawn.createHauler(spawn.room.name, false, Creep.Role.Mineral_Hauler);
            }
            else if (numberOfMineralMiners < spawn.memory.minMineralMiner){
                let extractor = spawn.room.find(FIND_MY_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_EXTRACTOR
                });
                name = spawn.createMiner(spawn.room.name, extractor, Creep.Role.Mineral_Miner);
            }

        }
        else {
            name = -1;
        }
        if (!(name = -1)){
            console.log(spawn.name + ' spawned new creep: ' + name + ' (' + Game.creeps[name].memory.role + ')');
        }
    }
};