module.exports = {
     /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        if (creep.memory.working == true) {
            var target = creep.room.storage
            if (target) {
                for (var resourceType in creep.carry) {
                    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }            
        }
        else {
            var dropmineral = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: m => m.resourceType != RESOURCE_ENERGY
            });
            if (dropmineral && (_.sum(creep.carry) < creep.carryCapacity)) {
                if (creep.pickup(dropmineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropmineral);
                }
            }
            else {
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[creep.memory.mineralType] > 0
                });
                let container = undefined;
                if (containers.length > 0) {
                    container = containers[0];
                }
                if (creep.withdraw(container, creep.memory.mineralType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
    }
};