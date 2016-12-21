module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if(creep.memory.working == true) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER ||
                              s.structureType == STRUCTURE_STORAGE) &&
                              s.store[RESOURCE_ENERGY] > 0
            });
            if (container != undefined && container.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else {
                var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN && s.energy > 0);
                    }
                });
                if (targets.length > 0) {
                    for (let x in targets) {
                        if (targets[x].energy > 10) {
                            if (targets[x].transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[x]);
                            }
                        }
                    }
                }
            }
        }
    }
};