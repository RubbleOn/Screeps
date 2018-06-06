module.exports = {
    
    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax &&
                    s.structureType != STRUCTURE_WALL
            });
            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        }
        else {
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (dropenergy) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy);
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
                                    s.structureType == STRUCTURE_SPAWN) && s.energy > 0;
                        }
                    });
                    if (targets.length > 0) {
                        for (let x in targets) {
                            if (targets[x].energy > 10) {
                                if (creep.withdraw(targets[x], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets[x]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};