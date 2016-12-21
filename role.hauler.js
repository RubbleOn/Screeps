module.exports = {
     /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }


        if (creep.memory.working == true) {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_TOWER ||
                            s.structureType == STRUCTURE_EXTENSION ||
                            s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity;
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
        else {
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            let container = undefined;
            if (containers != undefined) {
                if (containers.length > 1) {
                    if (containers[0].store[RESOURCE_ENERGY] > containers[1].store[RESOURCE_ENERGY]) {
                        container = containers[0];
                    }
                    else {
                        container = containers[1];
                    }
                }
                else {
                    container = containers[0];
                }
            }
            else {
                container = creep.room.storage;
            }
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        }
    }
};