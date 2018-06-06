
module.exports = {
    
    /** @param {Creep} creep **/
    run: function (creep) {
        var roleJanitor = require('role.janitor');
        
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit))
        }

        if(creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target != undefined) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                roleJanitor.run(creep);
            }
        } 
        else {
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER ||
                              s.structureType == STRUCTURE_STORAGE) &&
                              s.store[RESOURCE_ENERGY] > 0
            });
            containers.sort(function (a, b) {
                if (a.store[RESOURCE_ENERGY] > b.store[RESOURCE_ENERGY]) {
                    return -1;
                }
                if (a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY]) {
                    return 1;
                }
                return 0;
            });
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
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
                            if (creep.withdraw(targets[x], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[x]);
                            }
                        }
                    }
                }
            }
        }
    }
};
