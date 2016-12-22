require('prototype.creep')();
require('prototype.spawn')();
const creepController = require('creep.controller');
const spawnController = require('spawn.controller');

module.exports.loop = function () {
    //Bring out yer dead!
    creepController.clearDeadCreepMemory();

    //Loop through each spawn and execute the behavior
    for (let name in Game.spawns){
        let spawn = Game.spawns[name];
        if (spawn.memory['initialized'] == undefined) {
            spawnController.initialize(spawn);
        }
        spawnController.spawnNewCreeps(spawn);
    }

    creepController.setCreepRoles();
}