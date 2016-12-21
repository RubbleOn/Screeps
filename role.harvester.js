module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (creep.memory.working == false) {
            let source = creep.pos.findClosestByPath(FIND_SOURCES)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_EXTENSION ||
                            s.structureType == STRUCTURE_SPAWN ||
                            s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity;
                }
            });
            if (target == undefined) {
                target = creep.room.storage;
            }

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};