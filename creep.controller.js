/**
 * Created by mprimros on 12/21/16.
 */
const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const roleClaimer = require('role.claimer');
const roleHauler = require('role.hauler');
const roleMiner = require('role.miner');
const roleJanitor = require('role.janitor');
const roleWallBuilder = require('role.wallBuilder');
const roleLongDistanceHarvester = require('role.longDistanceHarvester');

module.exports={
    setCreepRoles: function() {
        //Loop through each creep and execute the behavior
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.memory.role == Creep.Role.Harvester) {
                roleHarvester.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Builder) {
                roleBuilder.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Upgrader) {
                roleUpgrader.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Claimer) {
                roleClaimer.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Energy_Hauler || creep.memory.role == Creep.Role.Mineral_Hauler) {
                roleHauler.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Energy_Miner || creep.memory.role == Creep.Role.Mineral_Miner) {
                roleMiner.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Janitor) {
                roleJanitor.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Wall_Builder) {
                roleWallBuilder.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Long_Distance_Harvester) {
                roleLongDistanceHarvester.run(creep);
            }
            else if (creep.memory.role == Creep.Role.Archer) {
                //TODO Add Archer Role
            }
            else if (creep.memory.role == Creep.Role.Defender) {
                //TODO Add Defender Role
            }
            else if (creep.memory.role == Creep.Role.Healer) {
                //TODO Add Healer Role
            }
            else if (creep.memory.role == Creep.Role.Soldier) {
                //TODO Add Soldier Role
            }
        }
    },
    //Checks if any creeps have died and clears them from memory
    clearDeadCreepMemory: function() {
        for (let name in Memory.creeps){
            if (!Game.creeps[name]){
                console.log('Removing ' + Game.creeps[name].memory.role + ' from memory.  RIP ' +name);
                delete Memory.creeps[name];
            }
        }
    }
};