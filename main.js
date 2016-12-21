require('prototype.spawn')();
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleWallBuilder = require('role.wallBuilder');
const roleJanitor = require('role.janitor');
const roleMiner = require('role.miner');
const roleHauler = require('role.hauler');
const roleClaimer = require('role.claimer');
const roleLongDistanceHarvester = require('role.longDistanceHarvester');
const roleRemoteBuilder = require('role.remoteBuilder');
const roleMineralMiner = require('role.mineralMiner');
const roleMineralHauler = require('role.mineralHauler');



module.exports.loop = function () {
    // Spawn Rooms
    let SPAWN1 = 'W8N3';
    let SPAWN2 = 'W7N3';
    let SPAWN3 = 'W6N1';

    // check memory for dead creeps and clear them out
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'janitor') {
            roleJanitor.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'wallBuilder') {
            roleWallBuilder.run(creep);
        }
        else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'mineralMiner') {
            roleMineralMiner.run(creep);
        }
        else if (creep.memory.role == 'mineralHauler') {
            roleMineralHauler.run(creep);
        }
        else if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
        else if (creep.memory.role == 'remoteBuilder') {
            roleRemoteBuilder.run(creep);
        }
    }

    let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            let username = target.owner.username;
            tower.attack(target);
            Game.notify('User ${username} spotted in room ${roomName}');
        }
    }

    // target number for different roles -- Add these to spawn memory
    /*
    var minHarvester = 1;
    var minUpgrader = 4;
    var minBuilder = 2;
    var minWallBuilder = 1;
    var minJanitor = 2;
    var minMiner = 2;
    var minHauler = 3;
    var minLongDistanceHarvester = 1;
    */
   

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

        //count the number of creeps alive for each role
        let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
        let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
        let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
        let numberOfWallBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'wallBuilder');
        let numberOfJanitors = _.sum(creepsInRoom, (c) => c.memory.role == 'janitor');
        let numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
        let numberOfHaulers = _.sum(creepsInRoom, (c) => c.memory.role == 'hauler');
        let numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.home == spawn.room.name);
        let numberOfMineralMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'mineralMiner');
        let numberOfMineralHaulers = _.sum(creepsInRoom, (c) => c.memory.role == 'mineralHauler');

        let energy = spawn.room.energyCapacityAvailable;
        let name = undefined;

        if (numberOfHarvesters == 0 && (numberOfMiners == 0 || numberOfHaulers == 0)) {
            if (numberOfMiners > 0) {
                name = spawn.createHauler(150);
            }
            else {
                name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester');
            }
        }
        else {
            let sources = spawn.room.find(FIND_SOURCES);
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    if (containers.length > 0) {
                        name = spawn.createMiner(source.id);
                        break;
                    }
                }
            }
        }
        
        if (name == undefined) {
            if (numberOfHarvesters < spawn.memory.minHarvester) {
                name = spawn.createCustomCreep(300, 'harvester');
            }
            else if (numberOfMiners >= 1 && numberOfHaulers < spawn.memory.minHauler) {
                name = spawn.createHauler(150);
            }
            else if (spawn.memory.claimRoom != undefined) {
                name = spawn.createClaimer(spawn.memory.claimRoom);
                if (!(name < 0)) {
                    delete spawn.memory.claimRoom;
                }
            }
            else if (numberOfUpgraders < spawn.memory.minUpgrader) {
                name = spawn.createCustomCreep(Math.floor(energy / 3), 'upgrader');
                let storage = spawn.room.storage;
                if (storage != undefined) {
                    if (storage.store[RESOURCE_ENERGY] > 20000) {
                        if (spawn.memory.minUpgrader != 3) {
                            console.log(spawn.name + ' minimum upgraders: 3');
                            spawn.memory.minUpgrader = 3;
                        }
                    }
                    if (storage.store[RESOURCE_ENERGY] > 10000 && storage.store[RESOURCE_ENERGY] < 20000) {
                        if (spawn.memory.minUpgrader != 2) {
                            console.log(spawn.name + ' minimum upgraders: 2');
                            spawn.memory.minUpgrader = 2;
                        }
                    }
                    if (storage.store[RESOURCE_ENERGY] < 1000) {
                        if (spawn.memory.minUpgrader != 1) {
                            console.log(spawn.name + ' minimum upgraders: 1');
                            spawn.memory.minUpgrader = 1;
                        }
                    }
                }
            }
            else if (numberOfJanitors < spawn.memory.minJanitor) {
                if (energy < 400) {
                    name = spawn.createCustomCreep(200, 'janitor');
                }
                else {
                    name = spawn.createCustomCreep(Math.floor(energy / 3), 'janitor');
                }
            }
            else if (numberOfBuilders < spawn.memory.minBuilder) {
                if (energy < 400) {
                    name = spawn.createCustomCreep(200, 'builder');
                }
                else {
                    name = spawn.createCustomCreep(Math.floor(energy / 3), 'builder');
                }
            }
            else if (numberOfWallBuilders < spawn.memory.minWallBuilder) {
                name = spawn.createCustomCreep(Math.floor(energy / 3), 'wallBuilder');
            }
            else if (numberOfLongDistanceHarvesters < spawn.memory.minLongDistanceHarvester) {
                if (spawnName == 'Spawn1') {
                    name = spawn.createLongDistanceHarvester(energy, 5, SPAWN1, 'W8N2');
                }
                else if (spawnName == 'Spawn2') {
                    name = spawn.createLongDistanceHarvester(energy, 5, SPAWN2, 'W7N4');
                }
                else if (spawnName == 'Spawn3') {
                    name = spawn.createLongDistanceHarvester(energy, 5, SPAWN3, 'W7N1');
                }
                else {
                    name = -1;
                }
            }
            else if (numberOfMineralMiners < spawn.memory.minMineralMiner) {
                let minerals = spawn.room.find(FIND_MINERALS);
                for (let mineral of minerals) {
                    if (!_.some(creepsInRoom, c => c.memory.role == 'mineralMiner' && c.memory.mineralId == mineral.id)) {
                        let containers = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                            filter: s => s.structureType == STRUCTURE_CONTAINER
                        });
                        if (containers.length > 0) {
                            name = spawn.createMineralMiner(mineral.id);
                            break;
                        }
                        else {
                            name = -1;
                        }
                    }
                    else {
                        name = -1;
                    }
                }
            }
            else if (numberOfMineralHaulers < spawn.memory.minMineralHauler) {
                let mineralType = spawn.room.find(FIND_MINERALS)[0].mineralType;
                name = spawn.createMineralHauler(Math.floor(energy / 3), mineralType);
            }
            else {
                name = -1;
            }
            //console.log(spawn + ' is trying to spawn: ' + name);
        }

        if (!(name < 0)) {
            console.log(spawn.name + ' spawned new creep: ' + name + ' (' + Game.creeps[name].memory.role + ')');
            console.log('Harvesters     : ' + numberOfHarvesters + ' of ' + spawn.memory.minHarvester);
            console.log('Miners         : ' + numberOfMiners + ' of ' + spawn.memory.minMiner);
            console.log('Haulers        : ' + numberOfHaulers + ' of ' + spawn.memory.minHauler);
            console.log('Upgraders      : ' + numberOfUpgraders + ' of ' + spawn.memory.minUpgrader);
            console.log('Builders       : ' + numberOfBuilders + ' of ' + spawn.memory.minBuilder);
            console.log('Wall Builders  : ' + numberOfWallBuilders + ' of ' + spawn.memory.minWallBuilder);
            console.log('Janitors       : ' + numberOfJanitors + ' of ' + spawn.memory.minJanitor);
            console.log('Long Distance  : ' + numberOfLongDistanceHarvesters + ' of ' + spawn.memory.minLongDistanceHarvester);
            console.log('Mineral Miner  : ' + numberOfMineralMiners + ' of ' + spawn.memory.minMineralMiner);
            console.log('Mineral Hauler  : ' + numberOfMineralHaulers + ' of ' + spawn.memory.minMineralHauler);
        }
    }
};